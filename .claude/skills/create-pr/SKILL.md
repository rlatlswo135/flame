---
name: create-pr
description: Create a GitHub pull request with a conventional commit title and structured description.
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep
---

# Create PR Skill

You are creating a GitHub pull request for the current branch.

## Steps

1. **Analyze the branch**
   ```
   git log --oneline main..HEAD
   git diff main..HEAD --stat
   ```

2. **Determine PR title**
   - Single commit: use that commit message as-is
   - Multiple commits: synthesize into one conventional commit format
   - Format: `type(scope): description` (e.g., `feat(ui): add Tooltip component`)
   - Keep under 70 characters

3. **Generate PR body**
   - Use the template below
   - Summary: 1-3 bullet points covering what changed and why
   - If there are breaking changes, note them explicitly

4. **Create the PR**
   ```bash
   git push -u origin HEAD
   gh pr create --title "..." --body "$(cat <<'EOF'
   ## Summary
   - bullet 1
   - bullet 2

   ## Test plan
   - [ ] test item 1
   - [ ] test item 2

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

5. **Return the PR URL**

## Constraints
- NEVER force push
- NEVER push to main/master directly
- If the branch has no remote tracking, push with `-u` flag
- Do not modify any files — this skill only creates the PR
