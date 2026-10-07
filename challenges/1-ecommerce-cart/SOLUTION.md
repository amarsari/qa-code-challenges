# Challenge 01 — Solution & QA Engineering Artifacts

This document contains the complete test analysis, structural models, test case specifications, and automation documentation for the **E-Commerce Shopping Cart Validation** technical challenge.

---

## 1. System State Transition Model

The lifecycle of the shopping cart is modeled across four primary states ($S_0$ through $S_3$), mapping valid transitions, reversal paths, and illegal actions.

```mermaid
stateDiagram-v2
    [*] --> S0: Initialize Cart

    state "S0: Empty Cart" as S0
    state "S1: Active (No Discount)" as S1
    state "S2: Active (Discount Applied)" as S2
    state "S3: Checked Out" as S3

    %% Transitions from S0
    S0 --> S1: Add valid item [qty 1-10, price > 0]
    S0 --> S0: [Checkout] Error: Empty cart blocked
    S0 --> S0: Add invalid item [qty <= 0 OR > 10 / invalid price / empty ID]

    %% Transitions from S1
    S1 --> S0: Remove last item
    S1 --> S1: Add / Remove items (cart remains non-empty)
    S1 --> S2: Apply valid code [SAVE10 OR (SAVE20 if subtotal >= 50)]
    S1 --> S1: Apply invalid code / SAVE20 below threshold (Error)
    S1 --> S3: [Checkout] Process successful checkout

    %% Transitions from S2
    S2 --> S0: Remove last item
    S2 --> S2: Apply different valid code (Replace discount)
    S2 --> S1: Invalid code attempt or discount removal
    S2 --> S3: [Checkout] Process successful checkout

    %% Terminal State
    S3 --> [*]