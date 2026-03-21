# 🎹 MIDI Web

A web application for working with MIDI input: recording, visualization, and future analysis (including AI-assisted features).

---

## 🚀 Tech Stack

- React + TypeScript
- Vite
- Jest + Testing Library
- Node.js + npm

---

## ⚙️ Requirements

- Node.js: 24.14.0
- npm: 11.9.0

Check versions:

```bash
node -v
npm -v
```

---

## 📦 Installation

```bash
npm install
```

or (recommended for clean installs / CI):

```bash
npm ci
```


---

## 🧑‍💻 Development

Start dev server:

```bash
npm run dev
```

---

## 🏗️ Build

```bash
npm run build
```

---

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run coverage
```

---

## 🧱 Project Structure

src/
  app/
  processes/
  pages/
  widgets/
  features/
  entities/
  uikit/
  service/
  shared/
  core/

---

# 🔢 Versioning

Project follows Semantic Versioning (SemVer):

MAJOR.MINOR.PATCH

Example:

1.4.2

---

## 📌 Version Rules

PATCH (1.4.2 → 1.4.3)
- bug fixes
- refactoring without behavior changes
- tests / CI changes
- internal improvements

MINOR (1.4.2 → 1.5.0)
- new features
- extended functionality
- backward-compatible changes

MAJOR (1.4.2 → 2.0.0)
- breaking changes
- incompatible updates
- changes in data formats or contracts

---

## 🏷️ Version Bump Process

For every PR merged into main, one of the following labels must be set:

- version:patch
- version:minor
- version:major

After merge:
- VERSION file is updated
- package.json version is updated
- git tag vX.Y.Z is created

---

# 🔀 Git Workflow

## Branches

- main — production / releases
- develop — integration branch
- */base — long-lived branches for large features (epics)
- feature/* — short-lived feature branches

---

## Workflow

Small features:
feature/* → develop → main

Large features:
develop → feature-name/base → feature/*

Flow:
feature/* → feature-name/base → develop → main

---

## Rules

- Only stable code goes to main
- develop is for integration
- */base is for grouping related features
- */base branch is deleted after merge to develop

---

## Important

Avoid:
feature/a → feature/b → feature/c

Use:
feature/a → base
feature/b → base
feature/c → base

---

# 📝 Commit Convention

Format:
type: description

Types:

feat: new feature  
fix: bug fix  
chore: config / maintenance  
refactor: internal code changes  
test: tests  
build: build / CI  
docs: documentation  

Examples:

feat: add midi input listener  
fix: correct note-off handling  
refactor: split midi service  
test: add app render test  
build: configure github actions  

---

## Breaking Changes

feat!: change session storage format

or

feat: change session format

BREAKING CHANGE: session structure updated

---

# 🤖 CI

On pull requests:
- tests
- build

On merge to main:
- automatic version bump
- git tag creation

---

# 📁 VERSION File

The project includes a VERSION file.

This file is the single source of truth for the application version.

---

# ⚠️ Rules

- Do not merge into main without a version label
- Do not commit directly to main
- Always use pull requests
