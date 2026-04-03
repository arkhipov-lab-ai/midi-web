# Routes Layer

# Purpose

This layer defines HTTP endpoints.

It is responsible only for:

- request handling
- validation
- response formatting
- calling application layer


---

# Responsibilities

Routes MUST:

- receive HTTP requests
- validate input data
- map input → application use case
- return structured response


---

# What Routes MUST NOT Do

Routes MUST NOT:

- contain business logic
- perform analysis
- implement domain rules
- access database directly
- call LLM directly
- transform data beyond simple mapping


---

# Allowed Dependencies

Routes may depend on:

- application layer
- schemas (DTOs)
- validation tools


---

# Forbidden Dependencies

Routes MUST NOT depend on:

- domain internals directly
- infrastructure directly (unless strictly necessary for wiring)


---

# Example Flow

1. Receive request
2. Validate payload
3. Call application use case
4. Return response


---

# Key Rule

Routes are thin.

If logic grows here — it is in the wrong place.
