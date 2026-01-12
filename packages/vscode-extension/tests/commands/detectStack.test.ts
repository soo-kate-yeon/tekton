import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectStack } from '../../src/commands/detectStack';
import * as cliRunner from '../../src/utils/cliRunner';
import * as vscode from 'vscode';

// Mock vscode module
vi.mock('vscode', () => ({
  window: {
    showInformationMessage: vi.fn(),
    showErrorMessage: vi.fn(),
    withProgress: vi.fn(),
  },
  ProgressLocation: {
    Notification: 15,
  },
}));

// Mock cliRunner
vi.mock('../../src/utils/cliRunner');

describe('detectStack command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute detect command and display output', async () => {
    const mockResult = {
      stdout: '✓ Framework: Next.js 14.0.0\n✓ Tailwind CSS: Installed\n✗ shadcn/ui: Not installed',
      stderr: '',
      exitCode: 0,
    };

    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockResolvedValue(mockResult);
    vi.spyOn(cliRunner, 'displayOutput').mockImplementation(() => {});

    await detectStack();

    expect(cliRunner.runCLI).toHaveBeenCalledWith('detect', []);
    expect(cliRunner.displayOutput).toHaveBeenCalledWith(mockResult, true);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'Framework detection complete. Check the Tekton output channel for results.'
    );
  });

  it('should show error message when CLI is not installed', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(false);
    vi.spyOn(cliRunner, 'showCLINotInstalledError').mockResolvedValue();

    await detectStack();

    expect(cliRunner.showCLINotInstalledError).toHaveBeenCalled();
    expect(cliRunner.runCLI).not.toHaveBeenCalled();
  });

  it('should handle CLI execution errors', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockRejectedValue(
      new Error('Command execution failed')
    );

    await detectStack();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'Failed to detect framework stack: Command execution failed'
    );
  });

  it('should display stderr when command returns error', async () => {
    const mockResult = {
      stdout: '',
      stderr: 'Error: No package.json found',
      exitCode: 1,
    };

    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockResolvedValue(mockResult);
    vi.spyOn(cliRunner, 'displayOutput').mockImplementation(() => {});

    await detectStack();

    expect(cliRunner.displayOutput).toHaveBeenCalledWith(mockResult, true);
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'Framework detection failed. Check the Tekton output channel for details.'
    );
  });

  it('should handle empty workspace scenario', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockRejectedValue(
      new Error('No workspace folder open')
    );

    await detectStack();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'Failed to detect framework stack: No workspace folder open'
    );
  });
});
