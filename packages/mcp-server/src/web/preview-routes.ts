/**
 * Preview HTTP routes for web server
 * SPEC-MCP-002: E-004 Preview URL Access, E-005 Real-Time Theme Switch
 */

import { IncomingMessage, ServerResponse } from 'http';
import { loadTheme, generateCSSVariables } from '@tekton/core';

/**
 * Handle preview page requests
 * SPEC: E-004 Preview URL Access - Serve HTML with theme CSS variables
 * SPEC: E-005 Real-Time Theme Switch - Support theme switching via URL parameter
 *
 * @param req - HTTP request
 * @param res - HTTP response
 * @param timestamp - Blueprint timestamp
 * @param themeId - Theme ID to apply
 */
export function handlePreviewRequest(
  _req: IncomingMessage,
  res: ServerResponse,
  timestamp: string,
  themeId: string
): void {
  try {
    // SPEC: U-003 @tekton/core Integration - Use loadTheme from @tekton/core
    const theme = loadTheme(themeId);

    if (!theme) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Theme Not Found</title></head>
        <body>
          <h1>Theme not found: ${themeId}</h1>
          <p>Please check the theme ID and try again.</p>
        </body>
        </html>
      `);
      return;
    }

    // SPEC: U-003 @tekton/core Integration - Use generateCSSVariables from @tekton/core
    const cssVariables = generateCSSVariables(theme);

    // Convert CSS variables object to CSS string
    const cssString = Object.entries(cssVariables)
      .map(([key, value]) => `    ${key}: ${value};`)
      .join('\n');

    // SPEC: E-004 Preview URL Access - Generate HTML with CSS variables and preview data
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tekton Preview - ${themeId}</title>
  <style>
    :root {
${cssString}
    }
    body {
      margin: 0;
      font-family: var(--font-family, system-ui, -apple-system, sans-serif);
      background: var(--color-background, #ffffff);
      color: var(--color-text, #000000);
    }
  </style>
</head>
<body>
  <div id="root" data-timestamp="${timestamp}" data-theme-id="${themeId}"></div>
  <script>
    window.__TEKTON_PREVIEW__ = {
      timestamp: ${timestamp},
      themeId: "${themeId}",
      blueprintUrl: "/api/blueprints/${timestamp}"
    };
  </script>
  <!-- SPEC-PLAYGROUND-001 will inject rendering logic here -->
</body>
</html>`;

    // SPEC: E-004 Preview URL Access - Set CORS headers for playground access
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(html);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
