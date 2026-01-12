import * as vscode from 'vscode';
import { execa } from 'execa';

export interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

let outputChannel: vscode.OutputChannel | null = null;

/**
 * Create or get the Tekton output channel
 */
export function createOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('Tekton');
  }
  return outputChannel;
}

/**
 * Get the current workspace path
 */
function getWorkspacePath(): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error('No workspace folder open');
  }
  return workspaceFolders[0].uri.fsPath;
}

/**
 * Run a Tekton CLI command
 * @param command - The CLI command (e.g., 'detect', 'setup', 'generate')
 * @param args - Additional arguments for the command
 * @param cwd - Custom working directory (defaults to workspace root)
 * @returns CLI execution result
 */
export async function runCLI(
  command: string,
  args: string[] = [],
  cwd?: string
): Promise<CLIResult> {
  const workingDir = cwd || getWorkspacePath();

  try {
    const result = await execa('tekton', [command, ...args], {
      cwd: workingDir,
      reject: false,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode || 0,
    };
  } catch (error) {
    // Re-throw errors like ENOENT (command not found)
    throw error;
  }
}

/**
 * Display CLI output in the output channel
 * @param result - CLI execution result
 * @param showChannel - Whether to show the output channel
 */
export function displayOutput(
  result: CLIResult,
  showChannel: boolean = true
): void {
  const channel = createOutputChannel();

  if (result.stdout) {
    channel.appendLine(result.stdout);
  }

  if (result.stderr) {
    channel.appendLine(`[ERROR] ${result.stderr}`);
  }

  if (showChannel) {
    channel.show(true); // preserveFocus = true
  }
}

/**
 * Check if Tekton CLI is installed
 * @returns true if CLI is available
 */
export async function isCLIInstalled(): Promise<boolean> {
  try {
    const result = await execa('tekton', ['--version'], {
      reject: false,
    });
    return result.exitCode === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Show error message for missing CLI
 */
export async function showCLINotInstalledError(): Promise<void> {
  const action = await vscode.window.showErrorMessage(
    'Tekton CLI is not installed. Please install it to use this extension.',
    'Install Instructions'
  );

  if (action === 'Install Instructions') {
    vscode.env.openExternal(
      vscode.Uri.parse('https://github.com/your-org/tekton#installation')
    );
  }
}
