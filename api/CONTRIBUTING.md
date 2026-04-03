# CONTRIBUTING.md

# Contributing Guide

This service is developed with LLM assistance.

Strict structure must be followed.


---

# 1. Development Flow

For each task:

1. Identify use case
2. Identify correct layer
3. Implement domain logic first
4. Wrap with application logic
5. expose via API


---

# 2. Where to Put Code

- pure logic → domain
- orchestration → application
- HTTP → api
- external systems → infrastructure


---

# 3. Module Creation

Each function/module should be:

- isolated
- testable
- small


---

# 4. Testing

Required for:

- domain logic
- transformations
- analysis algorithms

Tests must be:

- deterministic
- independent


---

# 5. Code Style

- no Cyrillic
- readable naming
- avoid large files


---

# 6. Commit Style

- atomic commits
- clear naming

Examples:

- "add tempo estimation logic"
- "implement chord smoothing"


---

# 7. LLM Contributions

AI must:

- follow architecture
- not invent abstractions
- not move logic across layers


---

# 8. What NOT to Do

- no "service" dumping layer
- no hidden side effects
- no logic in routes


---

# Final Principle

Backend must stay:

- clean
- predictable
- testable
