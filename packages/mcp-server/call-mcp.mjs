import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SERVER_PATH = join(__dirname, 'dist', 'index.js');

async function callMCP(method, params = {}) {
    const child = spawn('node', [SERVER_PATH], {
        stdio: ['pipe', 'pipe', 'inherit'],
    });

    return new Promise((resolve, reject) => {
        let output = '';
        const id = 1;

        child.stdout.on('data', (data) => {
            output += data.toString();
            const lines = output.split('\n');
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const response = JSON.parse(line);
                    if (response.id === id) {
                        child.kill();
                        resolve(response.result);
                        return;
                    }
                } catch (e) {
                    // Fragmented JSON or other output
                }
            }
        });

        child.on('error', reject);

        const request = JSON.stringify({
            jsonrpc: '2.0',
            id,
            method,
            params,
        }) + '\n';

        child.stdin.write(request);

        setTimeout(() => {
            child.kill();
            reject(new Error('MCP Request Timeout'));
        }, 10000);
    });
}

const [method, paramsStr] = process.argv.slice(2);
if (!method) {
    console.log('Usage: node call-mcp.mjs <method> [params-json]');
    process.exit(1);
}

const params = paramsStr ? JSON.parse(paramsStr) : {};

callMCP(method, params)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
