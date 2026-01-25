#compdef tekton

# Zsh completion script for tekton worktree commands
# Install: Copy to one of the directories in $fpath (e.g., /usr/local/share/zsh/site-functions/)
# Or add to ~/.zshrc: fpath=(~/.claude/completions $fpath) && autoload -Uz compinit && compinit

_tekton_worktree() {
    local -a commands config_commands format_options status_options sync_strategies

    commands=(
        'new:Create a new isolated worktree'
        'list:List all registered worktrees'
        'switch:Get path to switch to worktree'
        'remove:Remove a worktree'
        'sync:Synchronize worktree with base branch'
        'status:Show detailed worktree status'
        'config:Manage worktree configuration'
        'clean:Clean up merged worktrees'
    )

    config_commands=(
        'list:List all configuration'
        'get:Get configuration value'
        'set:Set configuration value'
    )

    format_options=('table' 'json')
    status_options=('active' 'merged' 'stale')
    sync_strategies=('merge' 'rebase')

    local curcontext="$curcontext" state line
    typeset -A opt_args

    _arguments -C \
        '1: :->command' \
        '*:: :->args'

    case $state in
        command)
            _describe -t commands 'tekton worktree commands' commands
            ;;
        args)
            case $words[1] in
                new)
                    _arguments \
                        '1:SPEC ID:' \
                        '2:Description:' \
                        '--base[Base branch]:branch:_git_branch_names' \
                        '--no-switch[Do not display switch instructions]'
                    ;;
                list)
                    _arguments \
                        '--format[Output format]:format:(table json)' \
                        '--status[Filter by status]:status:(active merged stale)'
                    ;;
                switch|remove|status|sync)
                    local -a spec_ids
                    spec_ids=(${(f)"$(tekton worktree list --format json 2>/dev/null | grep -oP '"spec_id":\s*"\K[^"]+')"})

                    case $words[1] in
                        switch)
                            _arguments \
                                "1:SPEC ID:(${spec_ids})"
                            ;;
                        remove)
                            _arguments \
                                "1:SPEC ID:(${spec_ids})" \
                                '--force[Force removal without confirmation]' \
                                '--keep-branch[Keep branch after removing worktree]'
                            ;;
                        status)
                            _arguments \
                                "1:SPEC ID:(${spec_ids})" \
                                '--format[Output format]:format:(table json)'
                            ;;
                        sync)
                            _arguments \
                                "1:SPEC ID:(${spec_ids})" \
                                '--strategy[Sync strategy]:strategy:(merge rebase)' \
                                '--dry-run[Show what would be synced]'
                            ;;
                    esac
                    ;;
                config)
                    case $CURRENT in
                        2)
                            _describe -t config-commands 'config commands' config_commands
                            ;;
                        3)
                            local -a config_keys
                            config_keys=(
                                'worktree_root:Root directory for worktrees'
                                'auto_sync:Enable automatic sync'
                                'cleanup_merged:Auto-cleanup merged worktrees'
                                'default_base:Default base branch'
                            )
                            _describe -t config-keys 'configuration keys' config_keys
                            ;;
                    esac
                    ;;
                clean)
                    _arguments \
                        '--merged-only[Only remove merged worktrees]' \
                        '--force[Skip confirmation prompts]'
                    ;;
            esac
            ;;
    esac
}

_tekton_worktree "$@"
