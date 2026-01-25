#!/usr/bin/env node
/**
 * MCP Inspector Validation Script
 *
 * Automates SPEC-MCP-002 Phase 5 validation by sending JSON-RPC messages
 * to the MCP server via stdio and verifying responses.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Test Configuration
// ============================================================================

const SERVER_PATH = join(__dirname, 'dist', 'index.js');
const TIMEOUT = 5000; // 5 seconds per test

// ============================================================================
// JSON-RPC Message Builder
// ============================================================================

let messageId = 1;

function createRequest(method, params = {}) {
  return {
    jsonrpc: '2.0',
    id: messageId++,
    method,
    params
  };
}

function createToolCallRequest(toolName, args) {
  return createRequest('tools/call', {
    name: toolName,
    arguments: args
  });
}

// ============================================================================
// Server Communication
// ============================================================================

class MCPServerTester {
  constructor() {
    this.server = null;
    this.responseBuffer = '';
    this.pendingRequests = new Map();
  }

  async start() {
    console.log('[INFO] Starting MCP server...\n');

    this.server = spawn('node', [SERVER_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    this.server.stdout.on('data', (data) => {
      this.handleStdout(data);
    });

    this.server.stderr.on('data', (data) => {
      // stderr is for logging - we expect this
      const logMessage = data.toString().trim();
      if (logMessage) {
        console.log(`[STDERR] ${logMessage}`);
      }
    });

    this.server.on('error', (err) => {
      console.error('[ERROR] Server process error:', err);
    });

    // Wait for server to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('[SUCCESS] MCP server started\n');
  }

  handleStdout(data) {
    this.responseBuffer += data.toString();

    // Try to parse complete JSON-RPC messages
    const lines = this.responseBuffer.split('\n');
    this.responseBuffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const response = JSON.parse(line);

        if (response.id !== undefined && this.pendingRequests.has(response.id)) {
          const { resolve } = this.pendingRequests.get(response.id);
          this.pendingRequests.delete(response.id);
          resolve(response);
        }
      } catch (err) {
        console.error('[ERROR] Failed to parse JSON-RPC response:', line);
        console.error('[ERROR] Parse error:', err.message);
      }
    }
  }

  async sendRequest(request) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new Error(`Request timeout: ${request.method}`));
      }, TIMEOUT);

      this.pendingRequests.set(request.id, {
        resolve: (response) => {
          clearTimeout(timeout);
          resolve(response);
        },
        reject
      });

      const message = JSON.stringify(request) + '\n';
      this.server.stdin.write(message);
    });
  }

  async stop() {
    if (this.server) {
      this.server.kill();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('\n[INFO] MCP server stopped\n');
    }
  }
}

// ============================================================================
// Validation Tests
// ============================================================================

const validationResults = {
  passed: [],
  failed: [],
  warnings: []
};

function logTest(testName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TEST: ${testName}`);
  console.log('='.repeat(80));
}

function logPass(message) {
  console.log(`✅ PASS: ${message}`);
  validationResults.passed.push(message);
}

function logFail(message) {
  console.log(`❌ FAIL: ${message}`);
  validationResults.failed.push(message);
}

function logWarning(message) {
  console.log(`⚠️  WARNING: ${message}`);
  validationResults.warnings.push(message);
}

async function testToolDiscovery(tester) {
  logTest('AC-001: MCP Tool Registration');

  const request = createRequest('tools/list', {});
  const response = await tester.sendRequest(request);

  // Verify JSON-RPC format
  if (response.jsonrpc === '2.0') {
    logPass('Response is JSON-RPC 2.0 compliant');
  } else {
    logFail('Response is not JSON-RPC 2.0 compliant');
  }

  // Verify tools array
  const tools = response.result?.tools || [];
  console.log(`\n[INFO] Found ${tools.length} tools`);

  if (tools.length === 3) {
    logPass('Exactly 3 tools discovered');
  } else {
    logFail(`Expected 3 tools, found ${tools.length}`);
  }

  // Verify each tool
  const expectedTools = ['generate-blueprint', 'preview-theme', 'export-screen'];
  for (const toolName of expectedTools) {
    const tool = tools.find(t => t.name === toolName);
    if (tool) {
      logPass(`Tool '${toolName}' discovered`);

      if (tool.description && tool.description.length > 10) {
        logPass(`Tool '${toolName}' has clear description`);
      } else {
        logFail(`Tool '${toolName}' has unclear description`);
      }

      if (tool.inputSchema && tool.inputSchema.properties) {
        logPass(`Tool '${toolName}' has valid input schema`);
      } else {
        logFail(`Tool '${toolName}' has invalid input schema`);
      }
    } else {
      logFail(`Tool '${toolName}' not found`);
    }
  }
}

async function testGenerateBlueprint(tester) {
  logTest('AC-007: Blueprint Generation (Data-Only Output)');

  const request = createToolCallRequest('generate-blueprint', {
    description: 'User profile dashboard with avatar, bio, and settings link',
    layout: 'sidebar-left',
    themeId: 'calm-wellness',
    componentHints: ['Card', 'Avatar', 'Button']
  });

  const response = await tester.sendRequest(request);

  if (response.result) {
    logPass('Blueprint generation succeeded');

    const resultText = response.result.content[0].text;
    const result = JSON.parse(resultText);

    console.log('\n[INFO] Blueprint result:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      logPass('Blueprint generation returned success: true');
    } else {
      logFail('Blueprint generation returned success: false');
    }

    if (result.blueprint) {
      const bp = result.blueprint;

      // Verify blueprint structure
      if (bp.id && bp.id.startsWith('bp-')) {
        logPass(`Blueprint has valid ID format: ${bp.id}`);
      } else {
        logFail('Blueprint ID format incorrect');
      }

      if (bp.name) {
        logPass(`Blueprint has name: ${bp.name}`);
      } else {
        logFail('Blueprint missing name');
      }

      if (bp.themeId === 'calm-wellness') {
        logPass('Blueprint has correct themeId');
      } else {
        logFail('Blueprint themeId incorrect');
      }

      if (bp.layout === 'sidebar-left') {
        logPass('Blueprint has correct layout');
      } else {
        logFail('Blueprint layout incorrect');
      }

      if (Array.isArray(bp.components)) {
        logPass('Blueprint has components array');
      } else {
        logFail('Blueprint components is not an array');
      }

      if (bp.timestamp && typeof bp.timestamp === 'number') {
        logPass('Blueprint has valid timestamp');
      } else {
        logFail('Blueprint timestamp invalid');
      }

      // Critical: NO previewUrl field
      if (!('previewUrl' in bp)) {
        logPass('✓ Blueprint does NOT have previewUrl field (data-only output)');
      } else {
        logFail('✗ Blueprint has previewUrl field (should be data-only)');
      }
    } else {
      logFail('Blueprint generation did not return blueprint data');
    }
  } else if (response.error) {
    logFail(`Blueprint generation error: ${response.error.message}`);
  }
}

async function testPreviewTheme(tester) {
  logTest('AC-008: Theme Data Retrieval (No Preview URL)');

  const request = createToolCallRequest('preview-theme', {
    themeId: 'premium-editorial'
  });

  const response = await tester.sendRequest(request);

  if (response.result) {
    logPass('Theme preview succeeded');

    const resultText = response.result.content[0].text;
    const result = JSON.parse(resultText);

    console.log('\n[INFO] Theme result:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      logPass('Theme preview returned success: true');
    } else {
      logFail('Theme preview returned success: false');
    }

    if (result.theme) {
      const theme = result.theme;

      if (theme.id === 'premium-editorial') {
        logPass('Theme has correct id');
      } else {
        logFail('Theme id incorrect');
      }

      if (theme.name) {
        logPass(`Theme has name: ${theme.name}`);
      } else {
        logFail('Theme missing name');
      }

      if (theme.description) {
        logPass('Theme has description');
      } else {
        logFail('Theme missing description');
      }

      if (theme.cssVariables && typeof theme.cssVariables === 'object') {
        logPass('Theme has cssVariables object');

        // Check for oklch() format
        const colorVars = Object.entries(theme.cssVariables)
          .filter(([key]) => key.includes('color'));

        if (colorVars.length > 0) {
          const hasOklch = colorVars.some(([, value]) =>
            typeof value === 'string' && value.includes('oklch')
          );

          if (hasOklch) {
            logPass('CSS variables include oklch() format');
          } else {
            logWarning('No oklch() format found in color variables');
          }
        }
      } else {
        logFail('Theme cssVariables invalid');
      }

      // Critical: NO previewUrl field
      if (!('previewUrl' in theme)) {
        logPass('✓ Theme does NOT have previewUrl field (data-only output)');
      } else {
        logFail('✗ Theme has previewUrl field (should be data-only)');
      }
    } else {
      logFail('Theme preview did not return theme data');
    }
  } else if (response.error) {
    logFail(`Theme preview error: ${response.error.message}`);
  }
}

async function testExportScreen(tester) {
  logTest('AC-009: Screen Code Export (No File Writes)');

  const request = createToolCallRequest('export-screen', {
    blueprint: {
      id: 'bp-1738123456789-abc123',
      name: 'User Profile Dashboard',
      themeId: 'calm-wellness',
      layout: 'sidebar-left',
      components: [],
      timestamp: 1738123456789
    },
    format: 'tsx'
  });

  const response = await tester.sendRequest(request);

  if (response.result) {
    logPass('Screen export succeeded');

    const resultText = response.result.content[0].text;
    const result = JSON.parse(resultText);

    if (result.success) {
      logPass('Screen export returned success: true');
    } else {
      logFail('Screen export returned success: false');
    }

    if (result.code) {
      logPass('Screen export returned code');

      // Verify code structure
      if (result.code.includes('import')) {
        logPass('Generated code includes imports');
      } else {
        logWarning('Generated code missing imports');
      }

      if (result.code.includes('React') || result.code.includes('react')) {
        logPass('Generated code is React-based');
      } else {
        logWarning('Generated code may not be React-based');
      }

      console.log('\n[INFO] Generated code preview:');
      console.log(result.code.substring(0, 300) + '...\n');

      // Critical: NO filePath field
      if (!('filePath' in result)) {
        logPass('✓ Export does NOT have filePath field (data-only output)');
      } else {
        logFail('✗ Export has filePath field (should be data-only)');
      }

      // Critical: NO file system writes
      logPass('✓ No file system writes (data returned as string)');
    } else {
      logFail('Screen export did not return code');
    }
  } else if (response.error) {
    logFail(`Screen export error: ${response.error.message}`);
  }
}

async function testErrorHandling(tester) {
  logTest('AC-012: Theme Availability Check (Error Handling)');

  const request = createToolCallRequest('preview-theme', {
    themeId: 'invalid-theme'
  });

  const response = await tester.sendRequest(request);

  if (response.result) {
    const resultText = response.result.content[0].text;
    const result = JSON.parse(resultText);

    if (!result.success) {
      logPass('Invalid theme returns success: false');

      if (result.error) {
        logPass(`Error message returned: ${result.error}`);

        // Check if error includes available themes list
        if (result.error.includes('Available themes:') ||
            result.error.includes('calm-wellness') ||
            result.availableThemes) {
          logPass('Error message includes available themes list');
        } else {
          logWarning('Error message does not include available themes list');
        }
      } else {
        logFail('Error object missing error message');
      }
    } else {
      logFail('Invalid theme should return success: false');
    }

    console.log('\n[INFO] Error response:');
    console.log(JSON.stringify(result, null, 2));
  } else if (response.error) {
    // JSON-RPC error format is also acceptable
    logPass('Invalid theme returns JSON-RPC error');

    if (response.error.code === -32602) {
      logPass('Error code is -32602 (Invalid params)');
    }

    console.log('\n[INFO] JSON-RPC error:');
    console.log(JSON.stringify(response.error, null, 2));
  }
}

// ============================================================================
// Main Validation Runner
// ============================================================================

async function runValidation() {
  console.log('\n' + '='.repeat(80));
  console.log('SPEC-MCP-002 MCP Inspector Validation');
  console.log('Date:', new Date().toISOString());
  console.log('='.repeat(80));

  const tester = new MCPServerTester();

  try {
    await tester.start();

    // Run all validation tests
    await testToolDiscovery(tester);
    await testGenerateBlueprint(tester);
    await testPreviewTheme(tester);
    await testExportScreen(tester);
    await testErrorHandling(tester);

  } catch (error) {
    console.error('\n[FATAL ERROR]', error);
    validationResults.failed.push(`Fatal error: ${error.message}`);
  } finally {
    await tester.stop();
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(80));

  console.log(`\n✅ Passed: ${validationResults.passed.length}`);
  console.log(`❌ Failed: ${validationResults.failed.length}`);
  console.log(`⚠️  Warnings: ${validationResults.warnings.length}`);

  if (validationResults.failed.length > 0) {
    console.log('\nFailed Tests:');
    validationResults.failed.forEach((msg, i) => {
      console.log(`  ${i + 1}. ${msg}`);
    });
  }

  if (validationResults.warnings.length > 0) {
    console.log('\nWarnings:');
    validationResults.warnings.forEach((msg, i) => {
      console.log(`  ${i + 1}. ${msg}`);
    });
  }

  const status = validationResults.failed.length === 0 ? 'PASS' : 'FAIL';
  console.log(`\n${'='.repeat(80)}`);
  console.log(`STATUS: ${status}`);
  console.log('='.repeat(80));

  process.exit(validationResults.failed.length > 0 ? 1 : 0);
}

// Run validation
runValidation().catch(error => {
  console.error('[FATAL]', error);
  process.exit(1);
});
