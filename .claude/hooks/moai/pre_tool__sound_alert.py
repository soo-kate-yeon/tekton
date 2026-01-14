#!/usr/bin/env python3
"""
MoAI Sound Alert Hook - Plays notification sound when AskUserQuestion is called

This hook enhances user interaction by providing audio feedback when
Claude Code requires user input through AskUserQuestion.
"""

import sys
import json
import platform
import subprocess


def play_sound():
    """Play system notification sound based on OS"""
    system = platform.system()

    try:
        if system == "Darwin":  # macOS
            # Use afplay with system sound
            subprocess.run(
                ["afplay", "/System/Library/Sounds/Glass.aiff"],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        elif system == "Linux":
            # Try paplay (PulseAudio) or aplay (ALSA)
            subprocess.run(
                ["paplay", "/usr/share/sounds/freedesktop/stereo/message.oga"],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        # Windows: Could use winsound module, but skipping for now
    except Exception:
        # Silently fail if sound cannot be played
        pass


def main():
    """Main hook execution"""
    try:
        # Read hook input from stdin
        hook_input = json.loads(sys.stdin.read())

        # Extract tool name
        tool_name = hook_input.get("tool", "")

        # Play sound only for AskUserQuestion
        if tool_name == "AskUserQuestion":
            play_sound()

        # Always allow the tool to proceed (exit 0)
        sys.exit(0)

    except Exception as e:
        # On error, log to stderr but still allow tool execution
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
