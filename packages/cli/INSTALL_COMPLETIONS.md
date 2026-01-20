# Shell Completion Installation Guide

## Quick Installation

### Zsh (Your Current Shell)

```bash
# Create completion directory if it doesn't exist
mkdir -p ~/.zsh/completions

# Copy completion script
cp .claude/completions/tekton-worktree.zsh ~/.zsh/completions/_tekton-worktree

# Add to ~/.zshrc if not already present
if ! grep -q "fpath=(~/.zsh/completions" ~/.zshrc; then
  echo 'fpath=(~/.zsh/completions $fpath)' >> ~/.zshrc
  echo 'autoload -U compinit && compinit' >> ~/.zshrc
fi

# Reload shell
exec zsh
```

### Bash

```bash
# Copy completion script
sudo cp .claude/completions/tekton-worktree.bash /etc/bash_completion.d/tekton-worktree

# Or for user-local installation:
mkdir -p ~/.bash_completion.d
cp .claude/completions/tekton-worktree.bash ~/.bash_completion.d/tekton-worktree

# Add to ~/.bashrc if not already present
if ! grep -q "~/.bash_completion.d/tekton-worktree" ~/.bashrc; then
  echo 'source ~/.bash_completion.d/tekton-worktree' >> ~/.bashrc
fi

# Reload shell
exec bash
```

### Fish

```bash
# Copy completion script
mkdir -p ~/.config/fish/completions
cp .claude/completions/tekton-worktree.fish ~/.config/fish/completions/

# Reload completions
fish_update_completions
```

## Verification

After installation, test tab completion:

```bash
# Type and press TAB:
tekton worktree <TAB>

# Should show:
# new list switch remove sync status config clean

# Type and press TAB:
tekton worktree new SPEC-<TAB>

# Should complete from existing worktrees
```

## Troubleshooting

### Completions not working (Zsh)

```bash
# Check if completions are loaded
echo $fpath | grep completions

# Rebuild completion cache
rm -f ~/.zcompdump
autoload -U compinit && compinit
```

### Completions not working (Bash)

```bash
# Check if completion is sourced
type _tekton_worktree

# If not found, source manually:
source ~/.bash_completion.d/tekton-worktree
```

### Completions not working (Fish)

```bash
# Check if file exists
ls ~/.config/fish/completions/tekton-worktree.fish

# Reload Fish config
source ~/.config/fish/config.fish
```

## Features

Once installed, you'll get:

- **Command completion**: Tab-complete worktree subcommands
- **SPEC ID completion**: Tab-complete from existing worktrees
- **Option completion**: Tab-complete flags and values
- **Branch completion**: Tab-complete Git branches for `--base`
- **Dynamic lookup**: Completions update based on actual worktrees

Enjoy your enhanced CLI experience! 🚀
