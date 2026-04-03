# API Service

# Overview

This service processes recorded MIDI performance and produces structured musical analysis.

It is NOT a generic backend.

It is an:

> analysis engine exposed via HTTP


---

# Responsibilities

The API is responsible for:

- receiving performance data
- running deeper analysis than frontend
- producing structured interpretation
- preparing data for feedback
- (future) storing sessions and results
- (future) generating AI-based feedback


---

# What API Does NOT Do

- does not render UI
- does not handle live MIDI input
- does not replicate frontend logic
- does not behave like a DAW


---

# Tech Stack

- Python
- FastAPI
- Pipenv
- Pytest


---

# Getting Started

## Install dependencies

```bash
pipenv install
```

## Running the Server

Start development server:

```bash
pipenv run uvicorn app.main:app --reload
```

Server will be available at:
http://localhost:8000

## Running Tests

```bash
pipenv run pytest
```

## Project Structure (Conceptual)

```text
app/
  main.py

  api/
    routes/
    schemas/

  application/
    ...

  domain/
    ...

  infrastructure/
    ...
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details

## Development Principles

- deterministic logic first
- domain must stay pure
- keep API layer thin
- no over-engineering

## Example Workflow

1.	Add domain logic (pure function)
2.	Cover with tests
3.	Wrap in application use case
4.	Expose via API route

## Health Check

Basic endpoint:

```bash
GET /health
```

Used for:
- dev checks
- docker health checks
- CI validation

## Future Plans

- session persistence
- async processing
- AI feedback
- PDF export

## Key Rule

Backend must remain:
- predictable
- testable
- explainable

AI is used only for explanation, not core logic
