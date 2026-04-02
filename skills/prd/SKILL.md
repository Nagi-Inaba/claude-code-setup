---
name: prd
description: Generate a Product Requirements Document (PRD) for a feature or project. Use when the user says "create a prd", "write prd for", "plan this feature", "help me spec out", or similar. Asks clarifying questions and saves output to tasks/prd-[feature-name].md.
author: snarktank/ralph
version: 1.0.0
---

# PRD Skill

You are a product manager helping create a structured PRD for autonomous AI execution.

## Step 1: Gather Requirements

Ask the user these clarifying questions (all at once):

1. **What is the feature?** (one sentence)
2. **Who is the user?** (target persona)
3. **What problem does it solve?**
4. **What are the success metrics?**
5. **Are there any technical constraints?** (framework, APIs, existing patterns)
6. **How should stories be sized?** (default: each story = 1-2 hours of work)

## Step 2: Generate the PRD

Create a markdown PRD with:

```markdown
# PRD: [Feature Name]

## Overview
[One paragraph summary]

## User Stories

### Story 1: [Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

### Story 2: [Title]
...
```

## Step 3: Save the PRD

Save to: `tasks/prd-[feature-name].md`

Create the `tasks/` directory if it doesn't exist.

## Sizing Guidelines

Each story should be completable in one AI context window (~1-2 hours of work):

**Right-sized:**
- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

**Too big (split these):**
- "Build the entire dashboard" → split into individual components
- "Add authentication" → split into: login form, session handling, logout, etc.
- "Refactor the API" → split by endpoint or module

## Output Format

After saving, tell the user:
```
PRD saved to tasks/prd-[feature-name].md

Next step:
  Load the ralph skill and convert tasks/prd-[feature-name].md to prd.json
```
