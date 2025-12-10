using System;
using System.Security.Cryptography;

namespace VendorCode.Tests
{
    public class TestCommitStatusAPI
    {
        // Testing commit status API visibility
        public byte[] GenerateHash(byte[] data)
        {
            // This should trigger AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE violation
            using var md5 = MD5.Create();
            return md5.ComputeHash(data);
        }

        public string HashString(string input)
        {
            var hash = GenerateHash(System.Text.Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(hash).Replace("-", "");
        }
    }
}
