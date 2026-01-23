import * as vscode from 'vscode';
import {
  runCLI,
  displayOutput,
  isCLIInstalled,
  showCLINotInstalledError,
} from '../utils/cliRunner.js';

/**
 * Command: Detect Framework Stack
 * Executes `tekton detect` and displays results in the output channel
 */
export async function detectStack(): Promise<void> {
  try {
    // Check if CLI is installed
    const cliInstalled = await isCLIInstalled();
    if (!cliInstalled) {
      await showCLINotInstalledError();
      return;
    }

    // Execute detect command
    const result = await runCLI('detect', []);

    // Display output in output channel
    displayOutput(result, true);

    // Show appropriate message based on exit code
    if (result.exitCode === 0) {
      vscode.window.showInformationMessage(
        'Framework detection complete. Check the Tekton output channel for results.'
      );
    } else {
      vscode.window.showErrorMessage(
        'Framework detection failed. Check the Tekton output channel for details.'
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    vscode.window.showErrorMessage(
      `Failed to detect framework stack: ${errorMessage}`
    );
  }
}
