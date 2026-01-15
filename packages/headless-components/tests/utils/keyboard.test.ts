import { describe, it, expect, vi } from 'vitest';
import { handleKeyboardEvent, isKeyboardKey, createKeyboardHandler } from '../../src/utils/keyboard';

describe('keyboard utility functions', () => {
  describe('isKeyboardKey', () => {
    it('should return true for Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      expect(isKeyboardKey(event, 'Enter')).toBe(true);
    });

    it('should return true for Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      expect(isKeyboardKey(event, ' ')).toBe(true);
    });

    it('should return true for Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      expect(isKeyboardKey(event, 'Escape')).toBe(true);
    });

    it('should return false for non-matching key', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      expect(isKeyboardKey(event, 'Enter')).toBe(false);
    });

    it('should handle array of keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      expect(isKeyboardKey(event, ['ArrowUp', 'ArrowDown'])).toBe(true);
    });
  });

  describe('handleKeyboardEvent', () => {
    it('should call handler when key matches', () => {
      const handler = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'Enter' }) as any;

      handleKeyboardEvent(event, 'Enter', handler);

      expect(handler).toHaveBeenCalledWith(event);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should prevent default when key matches', () => {
      const handler = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      handleKeyboardEvent(event as any, 'Enter', handler);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not call handler when key does not match', () => {
      const handler = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'a' }) as any;

      handleKeyboardEvent(event, 'Enter', handler);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle multiple keys', () => {
      const handler = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any;

      handleKeyboardEvent(event, ['ArrowUp', 'ArrowDown'], handler);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('createKeyboardHandler', () => {
    it('should create handler that responds to specific keys', () => {
      const enterHandler = vi.fn();
      const escapeHandler = vi.fn();

      const handler = createKeyboardHandler({
        Enter: enterHandler,
        Escape: escapeHandler,
      });

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' }) as any;
      handler(enterEvent);

      expect(enterHandler).toHaveBeenCalledWith(enterEvent);
      expect(escapeHandler).not.toHaveBeenCalled();
    });

    it('should prevent default when handler exists', () => {
      const enterHandler = vi.fn();
      const handler = createKeyboardHandler({ Enter: enterHandler });

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      handler(event as any);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not call handler or prevent default for unhandled keys', () => {
      const enterHandler = vi.fn();
      const handler = createKeyboardHandler({ Enter: enterHandler });

      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      handler(event as any);

      expect(enterHandler).not.toHaveBeenCalled();
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
