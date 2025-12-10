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
