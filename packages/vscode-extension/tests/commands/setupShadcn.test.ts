import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupShadcn } from '../../src/commands/setupShadcn';
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

describe('setupShadcn command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute setup shadcn command with progress notification', async () => {
    const mockResult = {
      stdout: 'shadcn/ui has been configured successfully',
      stderr: '',
      exitCode: 0,
    };

    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockResolvedValue(mockResult);
    vi.spyOn(cliRunner, 'displayOutput').mockImplementation(() => {});

    // Mock withProgress to immediately call the callback
    (vscode.window.withProgress as any).mockImplementation(
      async (options: any, task: any) => {
        return await task({ report: vi.fn() });
      }
    );

    await setupShadcn();

    expect(vscode.window.withProgress).toHaveBeenCalledWith(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Setting up shadcn/ui...',
        cancellable: false,
      },
      expect.any(Function)
    );

    expect(cliRunner.runCLI).toHaveBeenCalledWith('setup', ['shadcn']);
    expect(cliRunner.displayOutput).toHaveBeenCalledWith(mockResult, true);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'shadcn/ui setup complete! Check the Tekton output channel for details.'
    );
  });

  it('should show error message when CLI is not installed', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(false);
    vi.spyOn(cliRunner, 'showCLINotInstalledError').mockResolvedValue();

    await setupShadcn();

    expect(cliRunner.showCLINotInstalledError).toHaveBeenCalled();
    expect(cliRunner.runCLI).not.toHaveBeenCalled();
  });

  it('should handle CLI execution errors', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockRejectedValue(
      new Error('Command execution failed')
    );

    (vscode.window.withProgress as any).mockImplementation(
      async (options: any, task: any) => {
        return await task({ report: vi.fn() });
      }
    );

    await setupShadcn();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'Failed to setup shadcn/ui: Command execution failed'
    );
  });

  it('should display stderr when command returns error', async () => {
    const mockResult = {
      stdout: '',
      stderr: 'Error: Tailwind CSS not found',
      exitCode: 1,
    };

    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockResolvedValue(mockResult);
    vi.spyOn(cliRunner, 'displayOutput').mockImplementation(() => {});

    (vscode.window.withProgress as any).mockImplementation(
      async (options: any, task: any) => {
        return await task({ report: vi.fn() });
      }
    );

    await setupShadcn();

    expect(cliRunner.displayOutput).toHaveBeenCalledWith(mockResult, true);
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'shadcn/ui setup failed. Check the Tekton output channel for details.'
    );
  });

  it('should show progress report during execution', async () => {
    const mockResult = {
      stdout: 'Success',
      stderr: '',
      exitCode: 0,
    };

    const mockReport = vi.fn();

    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    vi.spyOn(cliRunner, 'runCLI').mockResolvedValue(mockResult);
    vi.spyOn(cliRunner, 'displayOutput').mockImplementation(() => {});

    (vscode.window.withProgress as any).mockImplementation(
      async (options: any, task: any) => {
        return await task({ report: mockReport });
      }
    );

    await setupShadcn();

    expect(mockReport).toHaveBeenCalledWith({
      message: 'Running shadcn init...',
    });
  });
});
