# PROJECT_RULES.md

# Project Rules

This file defines strict rules for backend development.


---

# 1. Source of Truth

Priority:

1. [PRODUCT_VISION.md](../PRODUCT_VISION.md) (root)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [PROJECT_RULES.md](./PROJECT_RULES.md)


---

# 2. Core Principles

- simplicity over abstraction
- deterministic logic over AI
- clear boundaries over flexibility


---

# 3. Layer Rules

STRICT:

- api → application → domain
- infrastructure is only used by application

Forbidden:

- domain depending on anything external
- mixing layers


---

# 4. Domain Rules

Domain MUST be:

- pure
- deterministic
- testable

Domain MUST NOT:

- access DB
- call LLM
- know about HTTP


---

# 5. Application Rules

Application:

- orchestrates domain
- combines multiple domain operations
- prepares final result

Must NOT:

- contain heavy business logic
- duplicate domain logic


---

# 6. API Rules

API layer:

- thin
- no logic
- only mapping input/output


---

# 7. Infrastructure Rules

- only adapters
- no business decisions
- no orchestration


---

# 8. Testing Rules

Required:

- domain → full coverage priority
- application → scenario tests

Optional:

- API integration tests


---

# 9. AI Usage Rules

LLM is allowed ONLY for:

- explanation
- feedback

LLM must NOT:

- define analysis results
- replace deterministic logic


---

# 10. Forbidden

DO NOT:

- create "utils" dumping ground
- mix domain with infrastructure
- introduce microservices
- over-engineer early


---

# Final Rule

If unsure:

> keep logic in domain and keep it simple
