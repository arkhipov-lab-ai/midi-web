# Tests

# Purpose

This directory contains all tests for the backend.

Tests ensure correctness of:

- domain logic
- application flows
- API behavior


---

# Test Types

## Domain Tests (Priority)

- test pure functions
- test analysis logic
- deterministic and isolated

These are the most important tests.


---

## Application Tests

- test use case orchestration
- validate interaction between domain components


---

## API Tests (Optional)

- test endpoint wiring
- test request/response structure

Must NOT duplicate domain tests.


---

# Rules

Tests MUST:

- be deterministic
- not depend on external systems
- not call real LLM
- not require database (for unit tests)


---

# Naming

- use clear test descriptions
- test behavior, not implementation


---

# Anti-Patterns

DO NOT:

- test framework internals
- duplicate logic inside tests
- hide logic in test helpers


---

# Key Principle

If domain is not well tested → system is unreliable.
