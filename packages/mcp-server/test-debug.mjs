#!/usr/bin/env node
import { listTokensTool } from './dist/tools/list-tokens.js';

console.log('Testing list_tokens with mobile shells...\n');

const result = await listTokensTool({ tokenType: 'shell' });

console.log('Success:', result.success);
console.log('Total shells:', result.shells?.length);
console.log('\nShell IDs:');
result.shells?.forEach(s => console.log(`  - ${s.id} (${s.platform})`));

const mobileCount = result.shells?.filter(s => s.id.startsWith('shell.mobile.')).length || 0;
const webCount = result.shells?.filter(s => s.id.startsWith('shell.web.')).length || 0;

console.log(`\nWeb shells: ${webCount}`);
console.log(`Mobile shells: ${mobileCount}`);

if (mobileCount === 0) {
    console.error('\n❌ ERROR: No mobile shells found!');
    process.exit(1);
}

console.log('\n✅ SUCCESS: Mobile shells are present!');
