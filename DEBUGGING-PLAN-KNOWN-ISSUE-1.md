# Debugging Plan: Known Issue #1 - "generate is not a function"

**Status**: Root Cause Identified
**Date**: 2026-01-20
**Severity**: Critical - Blocks renderScreen MCP tool functionality

---

## Root Cause Analysis

### The Problem

When calling `knowledge.renderScreen` MCP tool, the error occurs:

```
Unexpected error: generate is not a function
```

### Deep Dive: Why This Happens

#### 1. Package Type Mismatch

**@babel/generator is a CommonJS package**:

```json
// node_modules/@babel/generator/package.json
{
  "type": "commonjs"
}
```

Our packages are ESM:

```json
// packages/component-generator/package.json
{
  "type": "module"
}
```

#### 2. Node.js ESM Wrapper Behavior

When importing a CommonJS module into ESM, Node.js creates a wrapper:

```javascript
// What we write:
import generate from '@babel/generator';

// What Node.js actually gives us:
{
  __esModule: true,
  default: [Function: generate],  // ← The actual function
  generate: [Function: generate], // ← Named export
  CodeGenerator: [Class: CodeGenerator]
}
```

#### 3. TypeScript Compilation Issue

**TypeScript configuration**:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // ← Designed for bundlers
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**The problem**:

- TypeScript with `moduleResolution: "bundler"` assumes a bundler will handle imports
- It compiles `import generate from '@babel/generator'` to exactly that in the .js output
- Node.js ESM (without bundler) gives us the wrapper object, not the function
- When we call `generate(ast)`, we're calling `wrapperObject(ast)` → error!

#### 4. Why Tests Pass but Runtime Fails

**Tests (Vitest)**:

- Vitest has custom module resolution
- Handles CJS ↔ ESM interop automatically
- Works perfectly ✅

**Runtime (Node.js with tsx)**:

- tsx can start the server (module loading works)
- But tsx doesn't bundle - it just transpiles on-the-fly
- Native Node.js ESM rules apply
- Import wrapper causes runtime error ❌

---

## Solution Options

### Option A: Use Named Import (Quick Fix) ⚡

**Change**: Modify import statement to use named export

**Implementation**:

```typescript
// Before (BROKEN):
import generate from '@babel/generator';

// After (WORKING):
import { generate } from '@babel/generator';
```

**Pros**:

- ✅ Simplest solution
- ✅ No build system changes
- ✅ Works with current setup
- ✅ 2-minute fix

**Cons**:

- ⚠️ Requires changing TypeScript source
- ⚠️ May need similar fixes for other CJS dependencies

**Effort**: 🟢 Low (5 minutes)

---

### Option B: Bundle with esbuild (Recommended for Production) 📦

**Change**: Add bundling step to build process

**Implementation**:

1. Install esbuild:

```bash
pnpm add -D esbuild
```

2. Create build script (`scripts/build-bundle.js`):

```javascript
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'node',
  target: 'node20',
  external: [
    // Don't bundle dependencies that should stay external
    '@tekton/component-knowledge',
    '@tekton/theme',
    'prettier',
    'zod',
  ],
  sourcemap: true,
  minify: false, // Keep readable for debugging
});
```

3. Update package.json:

```json
{
  "scripts": {
    "build": "node scripts/build-bundle.js && tsc --emitDeclarationOnly",
    "build:types": "tsc --emitDeclarationOnly"
  }
}
```

**How it solves the problem**:

- esbuild resolves ALL imports at build time
- Bundles everything into single file
- No runtime import resolution needed
- Handles CJS ↔ ESM automatically

**Pros**:

- ✅ Resolves ALL potential import issues
- ✅ Faster runtime (no module resolution overhead)
- ✅ Smaller dist size (tree-shaking)
- ✅ Production-ready approach

**Cons**:

- ⚠️ More complex build process
- ⚠️ Need to manage externals list
- ⚠️ Debugging bundled code is harder

**Effort**: 🟡 Medium (30 minutes)

---

### Option C: Fix TypeScript moduleResolution (Alternative)

**Change**: Switch from "bundler" to "node16" or "nodenext"

**Implementation**:

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "moduleResolution": "node16", // or "nodenext"
    "module": "Node16" // or "NodeNext"
  }
}
```

**How it solves the problem**:

- TypeScript generates Node.js-compatible ESM output
- Better handles CJS/ESM interop
- Stricter about import/export syntax

**Pros**:

- ✅ More correct for Node.js projects
- ✅ Better type checking
- ✅ Future-proof

**Cons**:

- ⚠️ May require fixing other imports
- ⚠️ May break existing code
- ⚠️ Requires .js extensions in imports (already done)

**Effort**: 🟡 Medium (needs testing all imports)

---

### Option D: Runtime Import Fix (Workaround)

**Change**: Add runtime check for CJS wrapper

**Current approach** (already attempted):

```typescript
import babelGenerate from '@babel/generator';
const generate = babelGenerate.default || babelGenerate;
```

**Status**: ❌ This doesn't work because TypeScript still treats the import incorrectly

**Why it fails**:

- The runtime fix happens AFTER TypeScript compilation
- TypeScript already generated code assuming default import works
- By the time our fix runs, the damage is done

---

## Recommended Action Plan

### Phase 1: Quick Fix (Now) ⚡

**Goal**: Get v0.1.0 working immediately

**Steps**:

1. Change import in `jsx-generator.ts`:
   ```typescript
   import { generate } from '@babel/generator';
   ```
2. Remove the runtime workaround (no longer needed)
3. Rebuild and test
4. Deploy v0.1.0 Beta with working renderScreen

**Time**: 5 minutes
**Risk**: Low

---

### Phase 2: Production Hardening (v0.2.0) 📦

**Goal**: Bulletproof solution for production

**Steps**:

1. Implement esbuild bundling (Option B)
2. Test all MCP tools with bundled version
3. Update build documentation
4. Consider switching to `moduleResolution: "node16"` (Option C)

**Time**: 1-2 hours
**Risk**: Medium (needs thorough testing)

---

## Testing Protocol

### After Quick Fix (Option A)

```bash
# 1. Rebuild packages
cd packages/component-generator
pnpm build
cd ../studio-mcp
pnpm build

# 2. Start MCP server
npx tsx dist/server/index.js

# 3. Test renderScreen
curl -X POST http://localhost:3000/tools/knowledge.renderScreen \
  -H "Content-Type: application/json" \
  -d '{
    "blueprint": {
      "blueprintId": "test-001",
      "recipeName": "test-component",
      "analysis": {"intent": "Test", "tone": "simple"},
      "structure": {"componentName": "Card", "props": {"variant": "elevated"}}
    },
    "outputPath": "src/app/test/page.tsx"
  }'

# Expected: {"success": true, "filePath": "...", "code": "..."}
```

### After esbuild Implementation (Option B)

```bash
# 1. Run existing tests
pnpm test

# 2. Test bundled output
node dist/index.js  # Should not throw import errors

# 3. Full E2E test
pnpm test:integration

# 4. Check bundle size
ls -lh dist/index.js
```

---

## Technical Details for Future Reference

### Module Resolution Comparison

| Setting         | Best For               | Node.js Compatible? | Bundle Required? |
| --------------- | ---------------------- | ------------------- | ---------------- |
| `bundler`       | Webpack, esbuild, Vite | ⚠️ Partial          | Yes              |
| `node16`        | Node.js ESM projects   | ✅ Yes              | No               |
| `nodenext`      | Node.js (latest)       | ✅ Yes              | No               |
| `node` (legacy) | Old Node.js            | ❌ Outdated         | No               |

### ESM Import Behavior

```javascript
// CommonJS module (old style):
module.exports = function generate() {
  /* ... */
};
module.exports.CodeGenerator = class {
  /* ... */
};

// ESM import from CJS (Node.js wrapper):
import x from 'cjs-module';
// x = { default: [Function], __esModule: true, ... }

// What actually works:
import { generate } from 'cjs-module'; // ✅ Named export
import x from 'cjs-module';
x.default(); // ✅ Access via .default
import x from 'cjs-module';
x(); // ❌ Wrapper object, not function
```

---

## Success Criteria

### v0.1.0 (Quick Fix)

- [ ] renderScreen MCP tool returns success
- [ ] Generated code file is created correctly
- [ ] All existing tests still pass
- [ ] No regression in other MCP tools

### v0.2.0 (Production)

- [ ] esbuild bundling working
- [ ] All tests pass with bundled version
- [ ] Build time acceptable (< 5 seconds)
- [ ] Bundle size reasonable (< 500KB)
- [ ] No runtime import errors
- [ ] Documentation updated

---

## Conclusion

**Immediate action**: Use Option A (Named Import) to unblock v0.1.0 release.

**Long-term strategy**: Implement Option B (esbuild bundling) for v0.2.0 to ensure production stability and prevent similar issues with other dependencies.

**Root lesson**: When building Node.js ESM packages that import CommonJS dependencies, either:

1. Use named imports when available
2. Bundle with esbuild/webpack to resolve all imports at build time
3. Use `moduleResolution: "node16"` for better Node.js compatibility
