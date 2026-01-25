/**
 * Export Screen Tool Tests
 * SPEC-MCP-002: AC-008 Screen Export
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rmSync, existsSync, readFileSync } from 'fs';
import { exportScreenTool } from '../../src/tools/export-screen.js';
import { generateBlueprintTool } from '../../src/tools/generate-blueprint.js';
describe('exportScreenTool', () => {
    const testStorageDir = '.tekton-test/blueprints';
    const testExportDir = 'test-exports';
    beforeEach(() => {
        // Clean up test directories
        try {
            rmSync(testStorageDir, { recursive: true, force: true });
            rmSync(testExportDir, { recursive: true, force: true });
        }
        catch (e) {
            // Ignore errors
        }
    });
    afterEach(() => {
        // Clean up after tests
        try {
            rmSync(testStorageDir, { recursive: true, force: true });
            rmSync(testExportDir, { recursive: true, force: true });
        }
        catch (e) {
            // Ignore errors
        }
    });
    it('should export blueprint to JSX format', async () => {
        // First, generate a blueprint
        const genResult = await generateBlueprintTool({
            description: 'Test screen for export',
            layout: 'single-column',
            themeId: 'calm-wellness'
        });
        expect(genResult.success).toBe(true);
        const blueprintId = genResult.blueprint.id;
        // Export to JSX
        const result = await exportScreenTool({
            blueprintId,
            format: 'jsx'
        });
        expect(result.success).toBe(true);
        expect(result.code).toBeDefined();
        expect(result.code).toContain('export default function');
        expect(result.code).toContain('return');
    });
    it('should export blueprint to TSX format with TypeScript annotations', async () => {
        // Generate blueprint
        const genResult = await generateBlueprintTool({
            description: 'Test dashboard',
            layout: 'single-column',
            themeId: 'dynamic-fitness'
        });
        expect(genResult.success).toBe(true);
        // Export to TSX
        const result = await exportScreenTool({
            blueprintId: genResult.blueprint.id,
            format: 'tsx'
        });
        expect(result.success).toBe(true);
        expect(result.code).toBeDefined();
        expect(result.code).toContain('import React from');
        expect(result.code).toContain('React.ReactElement');
    });
    it('should export blueprint to Vue format', async () => {
        // Generate blueprint
        const genResult = await generateBlueprintTool({
            description: 'Vue test screen',
            layout: 'single-column',
            themeId: 'calm-wellness'
        });
        expect(genResult.success).toBe(true);
        // Export to Vue
        const result = await exportScreenTool({
            blueprintId: genResult.blueprint.id,
            format: 'vue'
        });
        expect(result.success).toBe(true);
        expect(result.code).toBeDefined();
        expect(result.code).toContain('<template>');
        expect(result.code).toContain('<script setup lang="ts">');
        expect(result.code).toContain('</template>');
    });
    it('should save exported code to file when outputPath provided', async () => {
        // Generate blueprint
        const genResult = await generateBlueprintTool({
            description: 'File export test',
            layout: 'single-column',
            themeId: 'calm-wellness'
        });
        expect(genResult.success).toBe(true);
        const outputPath = `${testExportDir}/test-screen.tsx`;
        // Export with file path
        const result = await exportScreenTool({
            blueprintId: genResult.blueprint.id,
            format: 'tsx',
            outputPath
        });
        expect(result.success).toBe(true);
        expect(result.filePath).toBe(outputPath);
        expect(existsSync(outputPath)).toBe(true);
        // Verify file contents
        const fileContent = readFileSync(outputPath, 'utf-8');
        expect(fileContent).toContain('export default function');
    });
    it('should return error for non-existent blueprint', async () => {
        const result = await exportScreenTool({
            blueprintId: 'non-existent-id',
            format: 'jsx'
        });
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain('Blueprint not found');
    });
    it('should create output directory if it does not exist', async () => {
        // Generate blueprint
        const genResult = await generateBlueprintTool({
            description: 'Directory creation test',
            layout: 'single-column',
            themeId: 'calm-wellness'
        });
        expect(genResult.success).toBe(true);
        const outputPath = `${testExportDir}/nested/deep/test.jsx`;
        // Export with nested path
        const result = await exportScreenTool({
            blueprintId: genResult.blueprint.id,
            format: 'jsx',
            outputPath
        });
        expect(result.success).toBe(true);
        expect(existsSync(outputPath)).toBe(true);
    });
});
//# sourceMappingURL=export-screen.test.js.map