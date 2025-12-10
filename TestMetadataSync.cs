//using architecture IRepositoryArchitecture;

using System;
using System.Security.Cryptography;
using System.Text;

namespace VendorCode.Tests
{
    /// <summary>
    /// Test file for metadata sync workflow validation.
    /// Contains intentional MD5 violation for AWS-FIPS-CRYPTO-001 rule.
    /// </summary>
    public class TestMetadataSync
    {
        public string GenerateHash(string input)
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 16: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
//   2. Line 16: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

        {
            // This will trigger AWS-FIPS-CRYPTO-001 violation (MD5 is not FIPS-compliant)
            using (var md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}
