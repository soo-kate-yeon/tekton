import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { activate, deactivate } from '../../src/extension';
import * as vscode from 'vscode';

// Mock vscode module
vi.mock('vscode', () => ({
  commands: {
    registerCommand: vi.fn(),
  },
}));

// Mock command modules
vi.mock('../../src/commands/detectStack', () => ({
  detectStack: vi.fn(),
}));

vi.mock('../../src/commands/setupShadcn', () => ({
  setupShadcn: vi.fn(),
}));

vi.mock('../../src/commands/generateTokens', () => ({
  generateTokens: vi.fn(),
}));

describe('Extension', () => {
  let mockContext: vscode.ExtensionContext;
  let mockDisposables: any[];

  beforeEach(() => {
    vi.clearAllMocks();

    mockDisposables = [];
    mockContext = {
      subscriptions: mockDisposables,
      extensionPath: '/test/path',
      globalState: {} as any,
      workspaceState: {} as any,
      extensionUri: {} as any,
      environmentVariableCollection: {} as any,
      storageUri: {} as any,
      globalStorageUri: {} as any,
      logUri: {} as any,
      extensionMode: 1,
      storagePath: '/test/storage',
      globalStoragePath: '/test/global-storage',
      logPath: '/test/log',
      asAbsolutePath: vi.fn(),
      extension: {} as any,
      secrets: {} as any,
      languageModelAccessInformation: {} as any,
    };

    // Mock registerCommand to return a disposable
    (vscode.commands.registerCommand as any).mockImplementation(
      (command: string, callback: (...args: any[]) => any) => {
        return {
          dispose: vi.fn(),
          command,
          callback,
        };
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('activate', () => {
    it('should register all three commands', () => {
      activate(mockContext);

      expect(vscode.commands.registerCommand).toHaveBeenCalledTimes(3);
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'tekton.detectStack',
        expect.any(Function)
      );
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'tekton.setupShadcn',
        expect.any(Function)
      );
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'tekton.generateTokens',
        expect.any(Function)
      );
    });

    it('should add all commands to subscriptions', () => {
      activate(mockContext);

      expect(mockContext.subscriptions.length).toBe(3);
      expect(mockContext.subscriptions[0]).toHaveProperty('dispose');
      expect(mockContext.subscriptions[1]).toHaveProperty('dispose');
      expect(mockContext.subscriptions[2]).toHaveProperty('dispose');
    });

    it('should register commands with correct IDs', () => {
      activate(mockContext);

      const calls = (vscode.commands.registerCommand as any).mock.calls;
      const commandIds = calls.map((call: any) => call[0]);

      expect(commandIds).toContain('tekton.detectStack');
      expect(commandIds).toContain('tekton.setupShadcn');
      expect(commandIds).toContain('tekton.generateTokens');
    });
  });

  describe('deactivate', () => {
    it('should not throw errors', () => {
      expect(() => deactivate()).not.toThrow();
    });

    it('should be callable after activation', () => {
      activate(mockContext);
      expect(() => deactivate()).not.toThrow();
    });
  });
});
