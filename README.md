# Frontend Pair-Programming Starter

A lightweight frontend pair-programming starter for interview practice and live coding sessions.

The repo is designed to help me move quickly from a problem statement to a working, polished frontend solution while staying in control of the implementation.

## Quick start

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Session playbook

This is your run-of-show for a live coding session. Each step tells you what to invoke and what to do with the output. The personas handle the rest.

---

### Before you start

- Clone or pull the latest template
- Confirm `npm install` runs clean
- Have the problem statement ready

---

### 1. Frame the problem

Read the problem statement. Restate it in your own words to confirm you understand it before invoking anything. This is your first visible act of critical thinking.

---

### 2. Engage the product owner

```
$persona-product-owner

[problem statement]
```

**You:** Read the product brief. Approve it, or redirect on any point before moving on. Make any scope decisions explicit out loud.

---

### 3. Engage the designer

```
$persona-designer [aesthetic token]
```

Aesthetic tokens: `retrofuturism`, `bauhaus`, `soviet-era propaganda`, `memphis`, `wabi-sabi`, or leave blank for considered modernism.

**You:** Read the mood translation first. Redirect if the aesthetic interpretation misses the mark. Approve the design brief before moving on.

---

### 4. Engage the architect

```
$persona-architect
```

**You:** Review the implementation sequence carefully — this becomes the canonical execution order for the session. Approve the solution design before moving on.

---

### 5. Start the project manager

```
$persona-project-manager
```

**You:** Confirm the initial project status reflects the approved implementation sequence. Invoke again at any point to get a current status snapshot.

---

### 6. Build — one step at a time

```
$persona-frontend-expert

Implement step [N]: [step name from solution-design.md]
```

**You:** Review each slice before invoking the next step. Redirect if the output drifts from the plan. You are the code reviewer — read it, ask about it, approve it.

---

### 7. Quality gate

```
$persona-sdet
```

Invoke when implementation is complete, or at any earlier point if you want a mid-session quality check.

**You:** Review the assessment. Approve sign-off or direct the frontend expert to fix blocking bugs. If bugs are added to the implementation sequence, confirm the project manager updates project-status.md.

---

### 8. Commit

```
$commit-hygiene
```

**You:** Review the commit message. Push.

---

### At any point

| Need | Invoke |
|---|---|
| Debug a console error | `$debugging` |
| Check where you are | `$persona-project-manager` |
| Design review mid-session | `$persona-designer` |
| Reassess quality | `$persona-sdet` |

---

## Operating model

This repo supports frontend pair-programming practice and live coding. The goal is not to create a production-grade system. The goal is to demonstrate structured problem solving, clear communication, practical AI fluency, and the ability to deliver a polished working frontend under time constraints.

I am the driver. I will write and explain the solution, clarify requirements, manage scope, and make implementation decisions. AI tools may assist with bounded tasks, but they do not own the solution or make final decisions.

The intended signal:

> I know how to turn ambiguity into an executable plan, use AI to increase throughput, preserve human judgment, and still maintain frontend craft.

The default stack is Vite, React, plain JavaScript, HTML, and CSS. Plain JavaScript preserves fast feedback cycles in constrained live coding. For production code, TypeScript may be the better tradeoff.

This starter intentionally avoids UI frameworks, routing, state management libraries, animation libraries, heavy test setup, complex build tooling, and overly abstract architecture by default. Those tools may be added when a specific problem requires them.

Use persona-authored planning documents before coding, then implement in small slices.

The default flow is:

1. Restate the problem
2. Produce and approve the product brief
3. Produce and approve the design brief
4. Produce and approve the solution design
5. Track status with the project manager
6. Build one approved implementation step at a time
7. Run a quality gate with SDET
8. Commit with a clean message

Useful files:

- `AGENTS.md` — rules for AI-assisted work
- `docs/product-brief.md` — product-owner planning document
- `docs/design-brief.md` — designer planning document
- `docs/solution-design.md` — architect planning document
- `docs/project-status.md` — project-manager status document
- `docs/interview-script.md` — phrases for live pair-programming
- `docs/github-checklist.md` — clean Git flow
- `docs/css-repertoire.md` — CSS techniques to keep available
- `.agents/skills/` — portable repo-scoped skills for Codex and compatible agents

Codex discovers repo-scoped `$skill-name` entries from `.agents/skills/` when launched inside this repository. Keep template-specific skills there so they travel with the project.

If a newly added skill does not appear in the `$` selector, restart Codex.
