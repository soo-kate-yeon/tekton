import * as vscode from 'vscode';
import { detectStack } from './commands/detectStack.js';
import { setupShadcn } from './commands/setupShadcn.js';
import { generateTokens } from './commands/generateTokens.js';

/**
 * Extension activation
 * Called when the extension is activated (first command execution)
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Tekton extension is now active');

  // Register commands
  const detectStackCommand = vscode.commands.registerCommand(
    'tekton.detectStack',
    detectStack
  );

  const setupShadcnCommand = vscode.commands.registerCommand(
    'tekton.setupShadcn',
    setupShadcn
  );

  const generateTokensCommand = vscode.commands.registerCommand(
    'tekton.generateTokens',
    generateTokens
  );

  // Add commands to subscriptions for proper cleanup
  context.subscriptions.push(
    detectStackCommand,
    setupShadcnCommand,
    generateTokensCommand
  );
}

/**
 * Extension deactivation
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  console.log('Tekton extension is now deactivated');
}
