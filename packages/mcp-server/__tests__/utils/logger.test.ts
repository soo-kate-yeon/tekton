/**
 * Logger Utility Tests
 * SPEC-MCP-002: Phase 4 - Logger Tests
 *
 * Tests logger utility:
 * - Verify logger.info() writes to stderr
 * - Verify logger.error() writes to stderr
 * - Verify logger.debug() writes to stderr
 * - Verify log format has prefixes
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { info, error, debug } from '../../src/utils/logger.js';

describe('logger utility', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.error to capture stderr output
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console.error
    consoleErrorSpy.mockRestore();
  });

  describe('info()', () => {
    it('should write to stderr via console.error', () => {
      const message = 'Test info message';
      info(message);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should include [INFO] prefix', () => {
      const message = 'Information message';
      info(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      );
    });

    it('should handle additional arguments', () => {
      const message = 'Info with args';
      const arg1 = { key: 'value' };
      const arg2 = 123;

      info(message, arg1, arg2);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        arg1,
        arg2
      );
    });

    it('should format message correctly', () => {
      const message = 'Server started';
      info(message);

      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toBe(`[INFO] ${message}`);
    });
  });

  describe('error()', () => {
    it('should write to stderr via console.error', () => {
      const message = 'Test error message';
      error(message);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should include [ERROR] prefix', () => {
      const message = 'Error occurred';
      error(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]')
      );
    });

    it('should handle error objects', () => {
      const message = 'Error with object';
      const errorObj = new Error('Something went wrong');

      error(message, errorObj);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        errorObj
      );
    });

    it('should format message correctly', () => {
      const message = 'Critical error';
      error(message);

      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toBe(`[ERROR] ${message}`);
    });
  });

  describe('debug()', () => {
    it('should write to stderr via console.error', () => {
      const message = 'Test debug message';
      debug(message);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should include [DEBUG] prefix', () => {
      const message = 'Debug information';
      debug(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]')
      );
    });

    it('should handle complex debug data', () => {
      const message = 'Debug data';
      const debugData = {
        request: { id: 1, method: 'tools/list' },
        timestamp: Date.now()
      };

      debug(message, debugData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        debugData
      );
    });

    it('should format message correctly', () => {
      const message = 'Debugging info';
      debug(message);

      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toBe(`[DEBUG] ${message}`);
    });
  });

  describe('log level prefixes', () => {
    it('should use different prefixes for different levels', () => {
      info('info message');
      error('error message');
      debug('debug message');

      const calls = consoleErrorSpy.mock.calls;

      expect(calls[0][0]).toContain('[INFO]');
      expect(calls[1][0]).toContain('[ERROR]');
      expect(calls[2][0]).toContain('[DEBUG]');
    });

    it('should maintain consistent prefix format', () => {
      const messages = ['test1', 'test2', 'test3'];

      info(messages[0]);
      error(messages[1]);
      debug(messages[2]);

      const calls = consoleErrorSpy.mock.calls;

      for (let i = 0; i < calls.length; i++) {
        const logMessage = calls[i][0] as string;
        expect(logMessage).toMatch(/^\[INFO|ERROR|DEBUG\] /);
        expect(logMessage).toContain(messages[i]);
      }
    });
  });

  describe('stderr output verification', () => {
    it('should always use console.error, never console.log', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      info('test');
      error('test');
      debug('test');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
      expect(consoleLogSpy).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should not write to stdout', () => {
      const stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

      info('test message');

      expect(stdoutWriteSpy).not.toHaveBeenCalled();

      stdoutWriteSpy.mockRestore();
    });
  });

  describe('multiple arguments', () => {
    it('should pass all arguments to console.error', () => {
      const message = 'Message with args';
      const arg1 = { data: 'value' };
      const arg2 = [1, 2, 3];
      const arg3 = 'string arg';

      info(message, arg1, arg2, arg3);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `[INFO] ${message}`,
        arg1,
        arg2,
        arg3
      );
    });

    it('should handle variadic arguments for all log levels', () => {
      const args = ['arg1', 42, { key: 'value' }, true];

      info('info', ...args);
      error('error', ...args);
      debug('debug', ...args);

      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, '[INFO] info', ...args);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, '[ERROR] error', ...args);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(3, '[DEBUG] debug', ...args);
    });
  });

  describe('edge cases', () => {
    it('should handle empty messages', () => {
      info('');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[INFO] ');
    });

    it('should handle messages with special characters', () => {
      const message = 'Test\nwith\nnewlines\tand\ttabs';
      info(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(`[INFO] ${message}`);
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(10000);
      info(longMessage);

      expect(consoleErrorSpy).toHaveBeenCalledWith(`[INFO] ${longMessage}`);
    });

    it('should handle undefined and null arguments', () => {
      info('test', undefined, null);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[INFO] test', undefined, null);
    });
  });
});
