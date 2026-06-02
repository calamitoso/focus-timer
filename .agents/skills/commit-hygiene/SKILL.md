---
name: commit-hygiene
description: Use when creating or reviewing concise conventional commit messages for frontend project changes, including guidance on splitting mixed diffs.
---

# Commit Hygiene Skill

Use this skill to create clean commit messages.

Rules:
- Use conventional commits.
- Be concise.
- Describe the user-visible or structural change.
- Do not mention AI assistance unless asked.
- Suggest splitting commits if the diff mixes unrelated concerns.

Examples:
- `feat: add interactive card filtering`
- `fix: handle empty state`
- `style: refine responsive layout`
- `refactor: simplify selected item state`
- `docs: add implementation plan`

## Maintained prompt

```txt
Draft a conventional commit message for the current diff.

Constraints:
- Keep it concise.
- Focus on the user-visible or structural change.
- Do not mention AI assistance.
- Include a short body only if useful.

Current diff summary:
[PASTE SUMMARY OR DIFF]
```
