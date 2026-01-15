import type { KeyboardKey } from '../types';

/**
 * Check if keyboard event matches a specific key or array of keys
 */
export function isKeyboardKey(
  event: React.KeyboardEvent,
  key: KeyboardKey | KeyboardKey[]
): boolean {
  if (Array.isArray(key)) {
    return key.includes(event.key as KeyboardKey);
  }
  return event.key === key;
}

/**
 * Handle keyboard event if key matches
 * Prevents default behavior and calls handler
 */
export function handleKeyboardEvent(
  event: React.KeyboardEvent,
  key: KeyboardKey | KeyboardKey[],
  handler: (event: React.KeyboardEvent) => void
): void {
  if (isKeyboardKey(event, key)) {
    event.preventDefault();
    handler(event);
  }
}

/**
 * Create a keyboard event handler that responds to specific keys
 */
export function createKeyboardHandler(
  handlers: Partial<Record<KeyboardKey, (event: React.KeyboardEvent) => void>>
): (event: React.KeyboardEvent) => void {
  return (event: React.KeyboardEvent) => {
    const handler = handlers[event.key as KeyboardKey];
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  };
}
