# Backend UT Case Execution Report (2026-02-28)

## Scope
- Plan: [[UT-PLAN-005]]
- Target cases: [[UT-CASE-BE-001]] .. [[UT-CASE-BE-013]]
- Test file: `backend/test/ut-case-be-ids.test.ts`

## Execution Command
```bash
cd backend
npm test -- --reporter=verbose --run test/ut-case-be-ids.test.ts
```

## Result Summary
- Test Files: 1 passed
- Tests: 13 passed / 13 total
- Status: PASS

## Case-by-Case Result
| Case ID | Result |
|---|---|
| [[UT-CASE-BE-001]] | PASS |
| [[UT-CASE-BE-002]] | PASS |
| [[UT-CASE-BE-003]] | PASS |
| [[UT-CASE-BE-004]] | PASS |
| [[UT-CASE-BE-005]] | PASS |
| [[UT-CASE-BE-006]] | PASS |
| [[UT-CASE-BE-007]] | PASS |
| [[UT-CASE-BE-008]] | PASS |
| [[UT-CASE-BE-009]] | PASS |
| [[UT-CASE-BE-010]] | PASS |
| [[UT-CASE-BE-011]] | PASS |
| [[UT-CASE-BE-012]] | PASS |
| [[UT-CASE-BE-013]] | PASS |

## Notes
- Case-ID based tests were added to align one-to-one with the UT plan case list.
- Existing `backend/test/api.test.ts` is kept as a broader regression suite.
