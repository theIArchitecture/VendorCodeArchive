using System;
using System.Security.Cryptography;

namespace VendorCode.Security
{
    /// <summary>
    /// Testing commit status visibility on PR
    /// </summary>
    public class TestStatusVisibility
    {
        public string CreateChecksum(string data)
        {
            // AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE violation - MD5 is not FIPS compliant
            using var hash = MD5.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(data);
            var hashBytes = hash.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }
    }
}
