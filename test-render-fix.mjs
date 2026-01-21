#!/usr/bin/env node
/**
 * Quick test script to verify renderScreen fix
 */

import { JSXGenerator } from './packages/component-generator/dist/index.js';

const testBlueprint = {
  blueprintId: 'test-fix-001',
  recipeName: 'test-component',
  analysis: {
    intent: 'Test component to verify import fix',
    tone: 'simple',
  },
  structure: {
    componentName: 'Card',
    props: {
      variant: 'elevated',
    },
  },
};

console.log('🧪 Testing JSXGenerator with fixed import...\n');

try {
  const generator = new JSXGenerator();
  console.log('✓ JSXGenerator instantiated successfully');

  const result = await generator.generate(testBlueprint);

  if (result.success && result.code) {
    console.log('✅ SUCCESS! Code generation works!\n');
    console.log('Generated code:');
    console.log('─'.repeat(50));
    console.log(result.code);
    console.log('─'.repeat(50));
    console.log('\n✅ Known Issue #1 is FIXED!');
    process.exit(0);
  } else {
    console.error('❌ FAILED: Generation returned error');
    console.error('Errors:', result.errors);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ FAILED: Exception thrown');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
