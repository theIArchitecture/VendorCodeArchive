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
            using (var md5 = MD5.Create())  // VIOLATION: AWS-FIPS-CRYPTO-001
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
