---
paths:
  - "**/*.{test,spec}.{ts,tsx,js,jsx}"
  - "**/*_test.{go,py}"
  - "**/*Test.{kt,java}"
  - "**/test_*.py"
  - "**/tests/**"
  - "**/__tests__/**"
---

# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL required):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows using **Playwright** (default E2E framework)

## Test-Driven Development

MANDATORY workflow:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Troubleshooting Test Failures

1. Use **tdd-guide** agent
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)

## E2E Testing with Playwright

Playwright is the default E2E testing framework for all web projects.

### Setup
```bash
npm init playwright@latest
npx playwright install
```

### Running Tests
```bash
npx playwright test                    # Run all tests
npx playwright test --headed           # Run with browser visible
npx playwright test tests/foo.spec.ts  # Run specific test
npx playwright show-report             # Open HTML report
```

### Test Structure
```
tests/
  e2e/
    *.spec.ts       # Playwright test files
playwright.config.ts # Configuration
```

### Best Practices
- Test critical user flows (navigation, form submission, data display)
- Use `page.locator()` over `page.$()`
- Use `expect(locator).toBeVisible()` for assertions
- Take screenshots on failure for debugging
- Keep tests independent (no shared state between tests)

## Agent Support

- **tdd-guide** - Use PROACTIVELY for new features, enforces write-tests-first
- **e2e-runner** - Use for generating and running Playwright E2E tests
