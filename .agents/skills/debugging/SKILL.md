---
name: debugging
description: Use when isolating and fixing a specific frontend bug with a minimal change and clear validation steps.
---

# Debugging Skill

Use this skill to isolate and fix a specific bug.

Rules:
- Start from observed behavior.
- Identify the likely category: data, rendering, state, CSS, environment, or browser.
- Suggest the smallest fix.
- Do not refactor unrelated code.
- Explain how to validate the fix.

Return:
1. Likely cause
2. Minimal fix
3. Validation steps

## Maintained prompt

```txt
Help debug this issue.

Observed behavior:
[WHAT I SEE]

Console error:
[PASTE ERROR]

Relevant files:
[LIST FILES]

Constraints:
- Identify the likely cause first.
- Suggest the smallest fix.
- Do not refactor unrelated code.
- Do not add dependencies.
- Explain how to validate the fix.
```
