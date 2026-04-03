# ARCHITECTURE.md

# Architecture Overview

This service uses a simplified layered architecture tailored for analysis-heavy systems.


---

# 1. High-Level Layers
api → application → domain → infrastructure

Each layer has strict responsibilities.


---

# 2. Layers Description

## api

- HTTP endpoints
- request/response handling
- validation
- dependency injection

No business logic allowed.


---

## application

Use cases.

Examples:

- analyze_performance
- refine_analysis
- generate_feedback (future)

Responsibilities:

- orchestrate domain logic
- coordinate flows
- call infrastructure when needed


---

## domain

Core of the system.

Contains:

- music theory logic
- transformations
- analysis algorithms
- segmentation
- key detection
- chord interpretation

Rules:

- must be pure
- no HTTP
- no DB
- no external dependencies


---

## infrastructure

External integrations:

- database (future)
- LLM client (future)
- background tasks (future)
- logging

This layer adapts external systems to the application.


---

# 3. Domain Structure

Domain is split into bounded contexts:

- performance → raw input processing
- harmony → chords and key
- rhythm → tempo, bars, quantization
- notation → score model
- feedback → structured insights (future)


---

# 4. Dependency Rules (STRICT)

Allowed:

api → application → domain
application → infrastructure

Forbidden:

- domain → application
- domain → api
- domain → infrastructure
- circular dependencies


---

# 5. Data Flow

- HTTP Request
↓
- API Layer
↓
- Application Use Case
↓
- Domain Logic
↓
- (Application may call Infrastructure)
↓
- Response DTO
↓
- HTTP Response

---

# 6. Design Principles

- deterministic logic first
- AI is optional and external
- domain must remain pure
- clear separation of concerns
- avoid over-engineering


---

# 7. Evolution Strategy

Architecture evolves only when:

- duplication appears
- complexity grows
- boundaries break

No premature abstraction.


---

# 8. Important Constraint

This backend is:

> an analysis engine, not a CRUD API
