# LLM_RULES.md

# LLM Rules

This file defines how AI agents must behave in this repository.


---

# 1. Always Read First

Before any task:

- [PRODUCT_VISION.md](../PRODUCT_VISION.md) (root)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [PROJECT_RULES.md](./PROJECT_RULES.md)


---

# 2. Core Behavior

LLM MUST:

- follow architecture strictly
- prefer simple solutions
- keep domain pure
- avoid abstractions unless needed


---

# 3. Layer Discipline

LLM MUST:

- place logic in correct layer
- never mix layers
- never bypass architecture


---

# 4. Domain Priority

If unsure where logic belongs:

→ put it in domain

NOT in:
- api
- infrastructure


---

# 5. Code Generation Rules

LLM MUST:

- create small modules
- write testable code
- avoid large files


---

# 6. Forbidden Actions

LLM MUST NOT:

- create new architecture patterns
- introduce microservices
- add unnecessary layers
- move logic into API layer


---

# 7. AI Usage Constraint

LLM must not:

- replace deterministic analysis
- invent results

LLM may:

- generate explanations


---

# 8. Decision Rule

If multiple solutions exist:

→ choose the simplest working one


---

# Final Rule

LLM is an assistant, not an architect.

Architecture is predefined.
