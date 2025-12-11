using System;
using System.Security.Cryptography;

namespace VendorCode.Validation
{
    /// <summary>
    /// Testing GitHub App Checks API integration
    /// </summary>
    public class TestGitHubAppChecks
    {
        public string ComputeFileHash(string filePath)
        {
            // AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE violation - MD5 is not FIPS compliant
            using var md5 = MD5.Create();
            using var stream = System.IO.File.OpenRead(filePath);
            var hashBytes = md5.ComputeHash(stream);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
