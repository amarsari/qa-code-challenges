# Defect Register & Bug Reports

This document tracks all defects discovered during the exploratory analysis and automated test execution of the **{{SUT_NAME}}** service.

Each defect is traced to its corresponding test case, business rule, and detailed root-cause analysis file in the [`bugs/`](./bugs/) directory.

---

## Defect Summary Register

| Bug ID | Title | Component | Severity | Priority | Triggering Test(s) | Rule Ref | Detailed Report |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **BUG-01** | {{DEFECT_TITLE}} | {{COMPONENT}} | {{SEVERITY}} | {{PRIORITY}} | `{{TC_REF}}` | `{{RULE_REF}}` | [View Report](./bugs/BUG-01.md) |

---

## Severity & Priority Breakdown

### By Severity (Technical Impact)
- **Critical ({{COUNT}}):** {{SUMMARY_OR_NONE}}
- **Major ({{COUNT}}):** {{LIST_OF_BUGS_AND_IMPACT}}
- **Medium ({{COUNT}}):** {{LIST_OF_BUGS_AND_IMPACT}}
- **Low ({{COUNT}}):** {{LIST_OF_BUGS_AND_IMPACT}}

### By Priority (Business Urgency)
- **P1 - Immediate / Blocker ({{COUNT}}):** {{BUSINESS_JUSTIFICATION}}
- **P2 - High ({{COUNT}}):** {{BUSINESS_JUSTIFICATION}}
- **P3 - Medium ({{COUNT}}):** {{BUSINESS_JUSTIFICATION}}
- **P4 - Low ({{COUNT}}):** {{BUSINESS_JUSTIFICATION}}