# GitHub Checklist

## Before a session

```bash
git status
node --version
npm --version
npm install
npm run build
```

## New practice run from template

```bash
gh repo create practice-run --private --template your-user/pair-programming-with-nicolas --clone
cd practice-run
npm install
npm run dev
```

## Basic flow

```bash
git checkout -b solution
npm install
npm run dev
```

After meaningful progress:

```bash
git status
git diff
git add .
git commit -m "feat: implement core experience"
```

Before final push:

```bash
npm run build
git status
git push -u origin solution
```

## Conventional commit examples

- `feat: add interactive feature cards`
- `fix: handle empty result state`
- `style: refine responsive layout`
- `refactor: simplify selected item state`
- `docs: add implementation plan`
- `chore: bootstrap starter repo`
