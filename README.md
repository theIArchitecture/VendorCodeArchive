
## Test 1.5 Updates

This section added for Test 1.5: PR validation with mixed changes.

### Changes in this PR
- **C#**: Added MixedTest.cs with MD5 violation
- **TypeScript**: Added ApiClient.tsx with hardcoded API key
- **.iarch**: Added custom logging rule
- **Docs**: Updated this README

### Expected Results
- All source files validated
- C# and TypeScript violations detected
- .iarch file passes META validation
- README.md changes ignored (not source code)

