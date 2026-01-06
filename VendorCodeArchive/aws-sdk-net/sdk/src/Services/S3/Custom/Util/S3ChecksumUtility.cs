using System;
using System.Security.Cryptography;

namespace Amazon.S3.Util
{
    /// <summary>
    /// Utility for calculating S3 object checksums and ETags
    /// </summary>
    public class S3ChecksumUtility
    {
        /// <summary>
        /// Calculates MD5 checksum for S3 object content
        /// </summary>
        public string CalculateChecksum(byte[] data)
        {
            // Generate MD5 hash for ETag calculation
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// ISSUES FOUND (2):
//   1. Line 17: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
//   2. Line 17: Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// WHY_IT_MATTERS: Architectural violation detected
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(data);
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
            }
        }

        /// <summary>
        /// Verifies object integrity using MD5
        /// </summary>
        public bool VerifyIntegrity(byte[] data, string expectedChecksum)
        {
            var calculated = CalculateChecksum(data);
            return calculated.Equals(expectedChecksum, StringComparison.OrdinalIgnoreCase);
        }
    }
}
