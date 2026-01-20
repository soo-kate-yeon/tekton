#!/bin/bash

# Shell Completion Installer for Tekton Worktree
# Automatically detects shell and installs completions

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Tekton Worktree Shell Completion Installer${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

# Detect shell
CURRENT_SHELL=$(basename "$SHELL")
echo -e "${YELLOW}Detected shell: ${CURRENT_SHELL}${NC}\n"

# Function to install Zsh completion
install_zsh() {
    echo -e "${GREEN}Installing Zsh completion...${NC}"

    # Create completion directory
    mkdir -p ~/.zsh/completions

    # Copy completion script
    cp "$COMPLETIONS_DIR/tekton-worktree.zsh" ~/.zsh/completions/_tekton-worktree
    echo -e "${GREEN}✓ Copied completion script to ~/.zsh/completions/_tekton-worktree${NC}"

    # Check if fpath is already configured
    if ! grep -q "fpath=(~/.zsh/completions" ~/.zshrc 2>/dev/null; then
        echo "" >> ~/.zshrc
        echo "# Tekton Worktree completions" >> ~/.zshrc
        echo "fpath=(~/.zsh/completions \$fpath)" >> ~/.zshrc
        echo "autoload -U compinit && compinit" >> ~/.zshrc
        echo -e "${GREEN}✓ Added completion configuration to ~/.zshrc${NC}"
    else
        echo -e "${YELLOW}⚠ Completion configuration already exists in ~/.zshrc${NC}"
    fi

    echo -e "\n${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Zsh completion installed successfully!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "\n${YELLOW}To activate completions, run:${NC}"
    echo -e "${BLUE}  exec zsh${NC}"
    echo -e "${YELLOW}Or:${NC}"
    echo -e "${BLUE}  source ~/.zshrc${NC}"
}

# Function to install Bash completion
install_bash() {
    echo -e "${GREEN}Installing Bash completion...${NC}"

    # Create completion directory
    mkdir -p ~/.bash_completion.d

    # Copy completion script
    cp "$COMPLETIONS_DIR/tekton-worktree.bash" ~/.bash_completion.d/tekton-worktree
    echo -e "${GREEN}✓ Copied completion script to ~/.bash_completion.d/tekton-worktree${NC}"

    # Check if source is already configured
    if ! grep -q "~/.bash_completion.d/tekton-worktree" ~/.bashrc 2>/dev/null; then
        echo "" >> ~/.bashrc
        echo "# Tekton Worktree completions" >> ~/.bashrc
        echo "source ~/.bash_completion.d/tekton-worktree" >> ~/.bashrc
        echo -e "${GREEN}✓ Added completion configuration to ~/.bashrc${NC}"
    else
        echo -e "${YELLOW}⚠ Completion configuration already exists in ~/.bashrc${NC}"
    fi

    echo -e "\n${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Bash completion installed successfully!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "\n${YELLOW}To activate completions, run:${NC}"
    echo -e "${BLUE}  exec bash${NC}"
    echo -e "${YELLOW}Or:${NC}"
    echo -e "${BLUE}  source ~/.bashrc${NC}"
}

# Function to install Fish completion
install_fish() {
    echo -e "${GREEN}Installing Fish completion...${NC}"

    # Create completion directory
    mkdir -p ~/.config/fish/completions

    # Copy completion script
    cp "$COMPLETIONS_DIR/tekton-worktree.fish" ~/.config/fish/completions/
    echo -e "${GREEN}✓ Copied completion script to ~/.config/fish/completions/tekton-worktree.fish${NC}"

    echo -e "\n${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Fish completion installed successfully!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "\n${YELLOW}Completions are automatically available in Fish.${NC}"
    echo -e "${YELLOW}If not working, run:${NC}"
    echo -e "${BLUE}  fish_update_completions${NC}"
}

# Check if completion files exist (handle both project root and packages/cli)
if [ -f .claude/completions/tekton-worktree.zsh ]; then
    COMPLETIONS_DIR=".claude/completions"
elif [ -f ../../.claude/completions/tekton-worktree.zsh ]; then
    COMPLETIONS_DIR="../../.claude/completions"
else
    echo -e "${RED}Error: Completion scripts not found${NC}"
    echo -e "${RED}Please run this script from the project root or packages/cli directory${NC}"
    exit 1
fi

echo -e "${BLUE}Using completions from: $COMPLETIONS_DIR${NC}\n"

# Install based on detected shell
case "$CURRENT_SHELL" in
    zsh)
        install_zsh
        ;;
    bash)
        install_bash
        ;;
    fish)
        install_fish
        ;;
    *)
        echo -e "${RED}Unsupported shell: $CURRENT_SHELL${NC}"
        echo -e "${YELLOW}Supported shells: zsh, bash, fish${NC}"
        echo -e "\n${YELLOW}Manual installation:${NC}"
        echo -e "  Zsh:  cp .claude/completions/tekton-worktree.zsh ~/.zsh/completions/_tekton-worktree"
        echo -e "  Bash: cp .claude/completions/tekton-worktree.bash ~/.bash_completion.d/tekton-worktree"
        echo -e "  Fish: cp .claude/completions/tekton-worktree.fish ~/.config/fish/completions/"
        exit 1
        ;;
esac

echo -e "\n${BLUE}To test completions, try:${NC}"
echo -e "${BLUE}  tekton worktree <TAB>${NC}"
echo -e "${BLUE}  tekton worktree new SPEC-<TAB>${NC}"
echo -e "\n${GREEN}Happy coding! 🚀${NC}\n"
