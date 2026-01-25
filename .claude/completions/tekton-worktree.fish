# Fish completion script for tekton worktree commands
# Install: Copy to ~/.config/fish/completions/tekton.fish

# Main worktree command completion
complete -c tekton -n '__fish_seen_subcommand_from worktree' -f

# Worktree subcommands
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'new' -d 'Create a new isolated worktree'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'list' -d 'List all registered worktrees'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'switch' -d 'Get path to switch to worktree'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'remove' -d 'Remove a worktree'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'sync' -d 'Synchronize worktree with base branch'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'status' -d 'Show detailed worktree status'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'config' -d 'Manage worktree configuration'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and not __fish_seen_subcommand_from new list switch remove sync status config clean' -a 'clean' -d 'Clean up merged worktrees'

# Helper function to get SPEC IDs
function __fish_tekton_worktree_spec_ids
    tekton worktree list --format json 2>/dev/null | string match -r '"spec_id":\s*"([^"]+)"' | string replace -r '.*"spec_id":\s*"([^"]+)".*' '$1'
end

# Helper function to get git branches
function __fish_tekton_git_branches
    git branch --format='%(refname:short)' 2>/dev/null
end

# Completion for 'new' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from new' -l base -d 'Base branch for new worktree' -a '(__fish_tekton_git_branches)'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from new' -l no-switch -d 'Do not display switch instructions'

# Completion for 'list' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from list' -l format -d 'Output format' -a 'table json'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from list' -l status -d 'Filter by status' -a 'active merged stale'

# Completion for 'switch' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from switch' -a '(__fish_tekton_worktree_spec_ids)' -d 'SPEC ID'

# Completion for 'remove' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from remove' -a '(__fish_tekton_worktree_spec_ids)' -d 'SPEC ID'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from remove' -l force -d 'Force removal without confirmation'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from remove' -l keep-branch -d 'Keep branch after removing worktree'

# Completion for 'sync' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from sync' -a '(__fish_tekton_worktree_spec_ids)' -d 'SPEC ID'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from sync' -l strategy -d 'Sync strategy' -a 'merge rebase'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from sync' -l dry-run -d 'Show what would be synced'

# Completion for 'status' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from status' -a '(__fish_tekton_worktree_spec_ids)' -d 'SPEC ID'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from status' -l format -d 'Output format' -a 'table json'

# Completion for 'config' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and not __fish_seen_subcommand_from list get set' -a 'list' -d 'List all configuration'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and not __fish_seen_subcommand_from list get set' -a 'get' -d 'Get configuration value'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and not __fish_seen_subcommand_from list get set' -a 'set' -d 'Set configuration value'

# Config keys completion
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and __fish_seen_subcommand_from get set' -a 'worktree_root' -d 'Root directory for worktrees'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and __fish_seen_subcommand_from get set' -a 'auto_sync' -d 'Enable automatic sync'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and __fish_seen_subcommand_from get set' -a 'cleanup_merged' -d 'Auto-cleanup merged worktrees'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from config; and __fish_seen_subcommand_from get set' -a 'default_base' -d 'Default base branch'

# Completion for 'clean' subcommand
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from clean' -l merged-only -d 'Only remove merged worktrees'
complete -c tekton -n '__fish_seen_subcommand_from worktree; and __fish_seen_subcommand_from clean' -l force -d 'Skip confirmation prompts'
