using System;
using System.Security.Cryptography;

namespace VendorCode
{
    public class TestMetadataUpdate
    {
        public string ComputeHash(string input)
        {
            // This should trigger AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE violation
            using var md5 = MD5.Create();
            var hash = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
