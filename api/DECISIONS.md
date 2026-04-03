# DECISIONS.md

# Architectural Decisions

This file documents key decisions made in the backend architecture.

LLM and contributors MUST respect these decisions.


---

# D-001: Use Layered Architecture

Decision:
Use a simplified layered architecture:

api → application → domain → infrastructure

Reason:
- keeps domain pure
- ensures testability
- avoids logic scattering

Status: ACCEPTED


---

# D-002: Domain Must Stay Pure

Decision:
All core analysis logic must live in domain and be pure.

Domain must NOT:
- access database
- call external APIs
- depend on FastAPI or Pydantic

Reason:
- testability
- predictability
- reproducibility

Status: ACCEPTED


---

# D-003: Backend Is an Analysis Engine

Decision:
Backend is NOT a generic CRUD service.

It is:

> an analysis engine exposed via HTTP

Reason:
- product is analysis-first
- avoids REST-overengineering
- keeps focus on core value

Status: ACCEPTED


---

# D-004: No Microservices

Decision:
Use a single backend service.

Reason:
- solo development
- current scope does not require distribution
- reduces complexity

Status: ACCEPTED


---

# D-005: LLM Is Not Core Logic

Decision:
LLM is used only for:
- explanation
- feedback

LLM must NOT:
- define analysis results
- replace deterministic logic

Reason:
- deterministic correctness is required
- LLM is non-deterministic

Status: ACCEPTED


---

# D-006: Sync First, Async Later

Decision:
Start with synchronous request-response analysis.

Async processing will be introduced only when needed.

Reason:
- faster iteration
- lower complexity
- premature async adds overhead

Status: ACCEPTED


---

# D-007: Frontend and Backend Responsibilities Are Different

Decision:
Do NOT mirror frontend logic in backend.

Frontend:
- live interaction
- rough estimation

Backend:
- refined analysis
- structured interpretation

Reason:
- separation of concerns
- avoid duplication

Status: ACCEPTED


---

# D-008: No "Service" Dumping Layer

Decision:
Do NOT create generic "services" folders.

Use:
- domain → logic
- application → orchestration

Reason:
- prevents architecture degradation
- enforces clear responsibilities

Status: ACCEPTED


---

# D-009: Data Contracts Are Explicit

Decision:
All input/output between frontend and backend must be explicit and structured.

Reason:
- stability
- LLM compatibility
- easier evolution

Status: ACCEPTED


---

# Final Rule

These decisions are not suggestions.

They are constraints.

Breaking them requires updating this file.
