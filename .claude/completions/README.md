# Shell Completion for Tekton Worktree Commands

This directory contains shell completion scripts for the `tekton worktree` command suite. Shell completion provides tab-completion for commands, subcommands, options, and arguments.

## Features

- **Command Completion**: Tab-complete worktree subcommands (new, list, switch, etc.)
- **SPEC ID Completion**: Automatically complete existing SPEC IDs from worktree list
- **Branch Completion**: Tab-complete Git branch names for `--base` option
- **Option Completion**: Complete all available flags and options
- **Format Completion**: Complete output format options (table, json)
- **Status Completion**: Complete status filter options (active, merged, stale)
- **Strategy Completion**: Complete sync strategies (merge, rebase)
- **Config Key Completion**: Complete configuration keys

## Installation

### Bash

Add to your `~/.bashrc`:

```bash
# Tekton worktree completion
source ~/.claude/completions/tekton-worktree.bash
```

Or copy to system completion directory:

```bash
sudo cp tekton-worktree.bash /etc/bash_completion.d/tekton
```

Then reload your shell:

```bash
source ~/.bashrc
```

### Zsh

Add to your `~/.zshrc`:

```bash
# Add completion directory to fpath
fpath=(~/.claude/completions $fpath)

# Initialize completions
autoload -Uz compinit && compinit
```

Or copy to system completion directory:

```bash
sudo cp tekton-worktree.zsh /usr/local/share/zsh/site-functions/_tekton
```

Then reload your shell:

```bash
source ~/.zshrc
```

### Fish

Copy to Fish completions directory:

```bash
cp tekton-worktree.fish ~/.config/fish/completions/tekton.fish
```

Fish will automatically load the completions. No additional configuration needed.

## Usage Examples

After installation, you can use tab-completion:

```bash
# Complete worktree subcommands
tekton worktree <TAB>
# Suggests: new, list, switch, remove, sync, status, config, clean

# Complete SPEC IDs for switch command
tekton worktree switch <TAB>
# Suggests: SPEC-AUTH-001, SPEC-PAY-001, SPEC-DASH-001

# Complete options for list command
tekton worktree list --<TAB>
# Suggests: --format, --status

# Complete format values
tekton worktree list --format <TAB>
# Suggests: table, json

# Complete status filters
tekton worktree list --status <TAB>
# Suggests: active, merged, stale

# Complete sync strategies
tekton worktree sync SPEC-001 --strategy <TAB>
# Suggests: merge, rebase

# Complete Git branches for base option
tekton worktree new SPEC-NEW-001 "Description" --base <TAB>
# Suggests: master, develop, feature/xyz, etc.

# Complete config actions
tekton worktree config <TAB>
# Suggests: list, get, set

# Complete config keys
tekton worktree config get <TAB>
# Suggests: worktree_root, auto_sync, cleanup_merged, default_base
```

## Completion Features by Command

### `new` Command

- SPEC ID: Manual input (no completion)
- Description: Manual input (no completion)
- `--base`: Completes with Git branch names
- `--no-switch`: Flag completion

### `list` Command

- `--format`: Completes with `table` or `json`
- `--status`: Completes with `active`, `merged`, or `stale`

### `switch` Command

- SPEC ID: Completes with existing worktree SPEC IDs

### `remove` Command

- SPEC ID: Completes with existing worktree SPEC IDs
- `--force`: Flag completion
- `--keep-branch`: Flag completion

### `sync` Command

- SPEC ID: Completes with existing worktree SPEC IDs
- `--strategy`: Completes with `merge` or `rebase`
- `--dry-run`: Flag completion

### `status` Command

- SPEC ID: Completes with existing worktree SPEC IDs
- `--format`: Completes with `table` or `json`

### `config` Command

- Action: Completes with `list`, `get`, or `set`
- Key: Completes with `worktree_root`, `auto_sync`, `cleanup_merged`, `default_base`

### `clean` Command

- `--merged-only`: Flag completion
- `--force`: Flag completion

## Troubleshooting

### Completions not working

1. **Verify installation**:
   ```bash
   # Bash
   echo $BASH_COMPLETION_COMPAT_DIR
   ls -la ~/.bash_completion.d/

   # Zsh
   echo $fpath
   which _tekton

   # Fish
   ls -la ~/.config/fish/completions/
   ```

2. **Reload shell**:
   ```bash
   # Bash
   source ~/.bashrc

   # Zsh
   source ~/.zshrc

   # Fish
   fish_update_completions
   ```

3. **Check script syntax**:
   ```bash
   # Bash
   bash -n tekton-worktree.bash

   # Zsh
   zsh -n tekton-worktree.zsh

   # Fish
   fish -n tekton-worktree.fish
   ```

### SPEC ID completion not working

The SPEC ID completion requires:
1. Tekton CLI to be in PATH
2. `tekton worktree list --format json` to work
3. At least one worktree to exist

Test manually:
```bash
tekton worktree list --format json
```

If this fails, SPEC ID completion will not work.

### Git branch completion not working (Bash/Zsh)

Git branch completion requires:
1. Git to be installed and in PATH
2. Current directory to be inside a Git repository

Test manually:
```bash
git branch --format='%(refname:short)'
```

## Technical Details

### Dynamic Completion

The completion scripts use dynamic command execution to provide context-aware suggestions:

- **SPEC ID completion**: Runs `tekton worktree list --format json` and parses output
- **Git branch completion**: Runs `git branch --format='%(refname:short)'`

### Performance

Completion scripts are optimized for performance:
- **Caching**: Shell maintains completion cache between invocations
- **Lazy evaluation**: Dynamic commands only run when needed
- **Fast parsing**: Uses efficient grep/sed for JSON parsing

### Compatibility

- **Bash**: Requires Bash 4.0+ with bash-completion 2.0+
- **Zsh**: Requires Zsh 5.0+ with compinit
- **Fish**: Requires Fish 3.0+

## Contributing

To add new completions:

1. Update the appropriate completion script (bash/zsh/fish)
2. Add examples to this README
3. Test completion functionality
4. Submit a pull request

## Support

For issues or questions:
- File an issue: [GitHub Issues](https://github.com/asleep/tekton/issues)
- Documentation: [Worktree Workflow Guide](../../docs/worktree-workflow-guide.md)
- Integration Analysis: [MoAI Integration](../../docs/worktree-moai-integration.md)
