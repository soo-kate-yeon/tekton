import * as vscode from 'vscode';
import {
  runCLI,
  displayOutput,
  isCLIInstalled,
  showCLINotInstalledError,
} from '../utils/cliRunner.js';

/**
 * Command: Setup shadcn/ui
 * Executes `tekton setup shadcn` with progress notification
 */
export async function setupShadcn(): Promise<void> {
  try {
    // Check if CLI is installed
    const cliInstalled = await isCLIInstalled();
    if (!cliInstalled) {
      await showCLINotInstalledError();
      return;
    }

    // Execute setup command with progress notification
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Setting up shadcn/ui...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Running shadcn init...' });

        const result = await runCLI('setup', ['shadcn']);

        // Display output in output channel
        displayOutput(result, true);

        // Show appropriate message based on exit code
        if (result.exitCode === 0) {
          vscode.window.showInformationMessage(
            'shadcn/ui setup complete! Check the Tekton output channel for details.'
          );
        } else {
          vscode.window.showErrorMessage(
            'shadcn/ui setup failed. Check the Tekton output channel for details.'
          );
        }
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(
      `Failed to setup shadcn/ui: ${errorMessage}`
    );
  }
}
