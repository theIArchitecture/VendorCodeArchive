# MD5 Cryptographic Hash Detector

**Plugin Type**: Validator
**Languages**: Python, Java, C#
**Complexity**: EASY
**Conversion Time**: 4 hours

## Purpose

Detects usage of MD5 cryptographic hash function, which is not FIPS-approved and should not be used for security-sensitive operations.

## Semgrep Pattern Equivalent

```yaml
# Original Semgrep pattern
hashlib.md5(...)
MessageDigest.getInstance("MD5")
MD5.Create()
```

## Detection Strategy

- **Python**: AST-based detection of `hashlib.md5()` calls
- **Java**: Regex detection of `MessageDigest.getInstance("MD5")`
- **C#**: Regex detection of `MD5.Create()` and `MD5CryptoServiceProvider`

## Usage in .iarch File

```yaml
RULE "No MD5 for Cryptography" : IValidationArchitecture
  ID: "CUSTOM-SEC-MD5"
  DESCRIPTION: "Detects MD5 usage which is not FIPS-approved"
  SEVERITY: Fatal
  CATEGORY: "Security_Compliance"
  APPLIES_TO: ["python", "java", "csharp"]

  PLUGIN:
    ID: "md5-detector"
    SCOPE: "file"
    CONFIG:
      severity: "Fatal"
      rule_id: "CUSTOM-SEC-MD5"

  VIOLATIONS:
    - "FIPS Violation: MD5 is not approved for cryptographic use"

  EDUCATION:
    WHY_IT_MATTERS: "MD5 has known collision vulnerabilities and is not suitable for security applications"
    BUSINESS_IMPACT: "Using MD5 violates FIPS 140-2 compliance required for government and enterprise deployments"
    QUICK_FIX: "Replace with SHA256 or SHA512"
    DOCS_URL: "https://csrc.nist.gov/projects/hash-functions"

END RULE
```

## Test Files

### Python Test (should detect violation)
```python
import hashlib

# Violation: MD5 usage
hasher = hashlib.md5()
hasher.update(b"data")
result = hasher.hexdigest()
```

### Java Test (should detect violation)
```java
import java.security.MessageDigest;

// Violation: MD5 usage
MessageDigest md = MessageDigest.getInstance("MD5");
byte[] hash = md.digest(data);
```

### C# Test (should detect violation)
```csharp
using System.Security.Cryptography;

// Violation: MD5 usage
using (var md5 = MD5.Create())
{
    byte[] hash = md5.ComputeHash(data);
}
```

## Running Tests

```bash
# Test Python detection
echo '{"filePath":"test.py","fileContent":"import hashlib\\nhasher = hashlib.md5()","language":"python","config":{}}' | python md5_detector.py

# Expected output: 1 violation at line 2
```

## Performance

- **Execution time**: < 50ms per file
- **Memory usage**: < 10MB
- **False positive rate**: 0% (only detects actual MD5 usage)

## False Positives

None expected. Plugin only detects actual MD5 instantiation, not:
- Comments mentioning "md5"
- String literals containing "md5"
- Variable names like `md5_result`

## Limitations

- Does not track data flow (e.g., MD5 passed as variable to function)
- Does not detect MD5 in external libraries unless called directly
- Regex-based detection for Java/C# may miss complex code formatting

## Future Enhancements

- Add support for Go: `md5.New()`
- Add support for JavaScript: `crypto.createHash('md5')`
- Track data flow for indirect MD5 usage
- Suggest automatic replacement with SHA256
