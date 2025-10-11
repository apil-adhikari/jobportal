# JOB Portal Backend (NODE EXPRESS MONGODB)

## REFACTOR

### Refactor Pattern: `controller=>services=>repository`

**Controller for receving data, passing data to services, and sending responses. Services for handling logic, doing checks, validating and throwing errors. Repository for handling database interactions**

DONE:

- [x] Refactored JOB
- [x] Refactored Company

FIXME
[] Do not show password in any response (dont select in model, so later on we have to manually select password when needed)
[] Use the transaction concept when deleting the user and profile of user in single time
