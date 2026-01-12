import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTokens } from '../../src/commands/generateTokens';
import * as cliRunner from '../../src/utils/cliRunner';
import * as vscode from 'vscode';

// Mock vscode module
vi.mock('vscode', () => ({
  window: {
    showInformationMessage: vi.fn(),
    showErrorMessage: vi.fn(),
    createTerminal: vi.fn(),
  },
}));

// Mock cliRunner
vi.mock('../../src/utils/cliRunner');

describe('generateTokens command', () => {
  let mockTerminal: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTerminal = {
      sendText: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    };

    (vscode.window.createTerminal as any).mockReturnValue(mockTerminal);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create terminal and execute generate command', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);

    await generateTokens();

    expect(vscode.window.createTerminal).toHaveBeenCalledWith('Tekton');
    expect(mockTerminal.sendText).toHaveBeenCalledWith('tekton generate');
    expect(mockTerminal.show).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'Token generation started. Follow the prompts in the terminal.'
    );
  });

  it('should show error message when CLI is not installed', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(false);
    vi.spyOn(cliRunner, 'showCLINotInstalledError').mockResolvedValue();

    await generateTokens();

    expect(cliRunner.showCLINotInstalledError).toHaveBeenCalled();
    expect(vscode.window.createTerminal).not.toHaveBeenCalled();
  });

  it('should handle terminal creation errors', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    (vscode.window.createTerminal as any).mockImplementation(() => {
      throw new Error('Failed to create terminal');
    });

    await generateTokens();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'Failed to generate tokens: Failed to create terminal'
    );
  });

  it('should not call CLI directly for interactive command', async () => {
    vi.spyOn(cliRunner, 'isCLIInstalled').mockResolvedValue(true);
    const runCLISpy = vi.spyOn(cliRunner, 'runCLI');

    await generateTokens();

    // Should use terminal instead of runCLI for interactive commands
    expect(runCLISpy).not.toHaveBeenCalled();
    expect(mockTerminal.sendText).toHaveBeenCalledWith('tekton generate');
  });
});
