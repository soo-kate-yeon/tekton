import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runCLI, createOutputChannel } from '../../src/utils/cliRunner';
import * as vscode from 'vscode';

// Mock vscode module
vi.mock('vscode', () => ({
  window: {
    createOutputChannel: vi.fn(),
  },
  workspace: {
    workspaceFolders: [{ uri: { fsPath: '/test/workspace' } }],
  },
}));

// Mock execa
vi.mock('execa', () => ({
  execa: vi.fn(),
}));

describe('cliRunner', () => {
  let mockOutputChannel: any;

  beforeEach(() => {
    mockOutputChannel = {
      appendLine: vi.fn(),
      append: vi.fn(),
      show: vi.fn(),
      clear: vi.fn(),
      dispose: vi.fn(),
    };

    (vscode.window.createOutputChannel as any).mockReturnValue(mockOutputChannel);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createOutputChannel', () => {
    it('should create an output channel with correct name', () => {
      const channel = createOutputChannel();

      expect(vscode.window.createOutputChannel).toHaveBeenCalledWith('Tekton');
      expect(channel).toBe(mockOutputChannel);
    });
  });

  describe('runCLI', () => {
    it('should execute CLI command with correct arguments', async () => {
      const { execa } = await import('execa');
      (execa as any).mockResolvedValue({
        stdout: 'Success output',
        stderr: '',
        exitCode: 0,
      });

      const result = await runCLI('detect', []);

      expect(execa).toHaveBeenCalledWith('tekton', ['detect'], {
        cwd: '/test/workspace',
        reject: false,
      });
      expect(result.stdout).toBe('Success output');
      expect(result.stderr).toBe('');
    });

    it('should execute CLI command with additional arguments', async () => {
      const { execa } = await import('execa');
      (execa as any).mockResolvedValue({
        stdout: 'Setup complete',
        stderr: '',
        exitCode: 0,
      });

      await runCLI('setup', ['shadcn']);

      expect(execa).toHaveBeenCalledWith('tekton', ['setup', 'shadcn'], {
        cwd: '/test/workspace',
        reject: false,
      });
    });

    it('should return stderr when command fails', async () => {
      const { execa } = await import('execa');
      (execa as any).mockResolvedValue({
        stdout: '',
        stderr: 'Error: Command not found',
        exitCode: 1,
      });

      const result = await runCLI('invalid', []);

      expect(result.stderr).toBe('Error: Command not found');
      expect(result.exitCode).toBe(1);
    });

    it('should throw error when no workspace is open', async () => {
      const originalWorkspaceFolders = vscode.workspace.workspaceFolders;
      (vscode.workspace as any).workspaceFolders = undefined;

      await expect(runCLI('detect', [])).rejects.toThrow(
        'No workspace folder open'
      );

      (vscode.workspace as any).workspaceFolders = originalWorkspaceFolders;
    });

    it('should handle execa errors gracefully', async () => {
      const { execa } = await import('execa');
      (execa as any).mockRejectedValue(new Error('ENOENT: tekton not found'));

      await expect(runCLI('detect', [])).rejects.toThrow(
        'ENOENT: tekton not found'
      );
    });

    it('should use custom working directory if provided', async () => {
      const { execa } = await import('execa');
      (execa as any).mockResolvedValue({
        stdout: 'Success',
        stderr: '',
        exitCode: 0,
      });

      await runCLI('detect', [], '/custom/path');

      expect(execa).toHaveBeenCalledWith('tekton', ['detect'], {
        cwd: '/custom/path',
        reject: false,
      });
    });
  });

  describe('displayOutput', () => {
    it('should display stdout in output channel', async () => {
      // This will be tested through commands
    });

    it('should display stderr in output channel with error styling', async () => {
      // This will be tested through commands
    });
  });
});
