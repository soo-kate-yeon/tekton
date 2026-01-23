import * as vscode from 'vscode';
import {
  isCLIInstalled,
  showCLINotInstalledError,
} from '../utils/cliRunner.js';

/**
 * Command: Generate Design Tokens
 * Executes `tekton generate` in an integrated terminal for interactive prompts
 *
 * Note: We use the terminal approach instead of runCLI because the generate
 * command uses enquirer for interactive prompts (color input, preset selection).
 * The terminal provides a better UX for interactive commands.
 */
export async function generateTokens(): Promise<void> {
  try {
    // Check if CLI is installed
    const cliInstalled = await isCLIInstalled();
    if (!cliInstalled) {
      await showCLINotInstalledError();
      return;
    }

    // Create a new terminal and execute the command
    const terminal = vscode.window.createTerminal('Tekton');
    terminal.sendText('tekton generate');
    terminal.show();

    // Inform user
    vscode.window.showInformationMessage(
      'Token generation started. Follow the prompts in the terminal.'
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(
      `Failed to generate tokens: ${errorMessage}`
    );
  }
}
