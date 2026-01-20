#!/usr/bin/env bash
# Bash completion script for tekton worktree commands
# Install: source this file in your ~/.bashrc or copy to /etc/bash_completion.d/

_tekton_worktree_completions() {
    local cur prev words cword
    _init_completion || return

    # Main commands
    local commands="new list switch remove sync status config clean"

    # Config subcommands
    local config_commands="list get set"

    # Format options
    local format_options="table json"

    # Status options
    local status_options="active merged stale"

    # Sync strategies
    local sync_strategies="merge rebase"

    # If we're completing the first argument after 'worktree'
    if [[ $cword -eq 2 ]]; then
        COMPREPLY=( $(compgen -W "${commands}" -- "${cur}") )
        return 0
    fi

    # Get the subcommand (word at position 2)
    local subcommand="${words[2]}"

    case "${subcommand}" in
        new)
            # tekton worktree new SPEC-ID [description] [options]
            case "${prev}" in
                --base)
                    # Complete with git branch names
                    local branches=$(git branch --format='%(refname:short)' 2>/dev/null)
                    COMPREPLY=( $(compgen -W "${branches}" -- "${cur}") )
                    return 0
                    ;;
                *)
                    if [[ ${cur} == -* ]]; then
                        COMPREPLY=( $(compgen -W "--base --no-switch" -- "${cur}") )
                    fi
                    return 0
                    ;;
            esac
            ;;

        list)
            # tekton worktree list [options]
            case "${prev}" in
                --format)
                    COMPREPLY=( $(compgen -W "${format_options}" -- "${cur}") )
                    return 0
                    ;;
                --status)
                    COMPREPLY=( $(compgen -W "${status_options}" -- "${cur}") )
                    return 0
                    ;;
                *)
                    if [[ ${cur} == -* ]]; then
                        COMPREPLY=( $(compgen -W "--format --status" -- "${cur}") )
                    fi
                    return 0
                    ;;
            esac
            ;;

        switch|remove|status|sync)
            # These commands take SPEC-ID as argument
            case "${prev}" in
                --format)
                    COMPREPLY=( $(compgen -W "${format_options}" -- "${cur}") )
                    return 0
                    ;;
                --strategy)
                    COMPREPLY=( $(compgen -W "${sync_strategies}" -- "${cur}") )
                    return 0
                    ;;
                "${subcommand}")
                    # Complete with existing SPEC IDs from worktree list
                    local spec_ids=$(tekton worktree list --format json 2>/dev/null | grep -oP '"spec_id":\s*"\K[^"]+')
                    COMPREPLY=( $(compgen -W "${spec_ids}" -- "${cur}") )
                    return 0
                    ;;
                *)
                    if [[ ${cur} == -* ]]; then
                        local opts=""
                        case "${subcommand}" in
                            remove)
                                opts="--force --keep-branch"
                                ;;
                            status)
                                opts="--format"
                                ;;
                            sync)
                                opts="--strategy --dry-run"
                                ;;
                        esac
                        COMPREPLY=( $(compgen -W "${opts}" -- "${cur}") )
                    fi
                    return 0
                    ;;
            esac
            ;;

        config)
            # tekton worktree config <action> [key] [value]
            if [[ $cword -eq 3 ]]; then
                # Complete config action
                COMPREPLY=( $(compgen -W "${config_commands}" -- "${cur}") )
                return 0
            elif [[ $cword -eq 4 ]]; then
                # Complete config key
                local config_keys="worktree_root auto_sync cleanup_merged default_base"
                COMPREPLY=( $(compgen -W "${config_keys}" -- "${cur}") )
                return 0
            fi
            ;;

        clean)
            # tekton worktree clean [options]
            case "${prev}" in
                *)
                    if [[ ${cur} == -* ]]; then
                        COMPREPLY=( $(compgen -W "--merged-only --force" -- "${cur}") )
                    fi
                    return 0
                    ;;
            esac
            ;;
    esac

    return 0
}

# Register the completion function
complete -F _tekton_worktree_completions tekton
