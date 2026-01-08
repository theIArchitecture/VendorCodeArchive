using System;
using System.Security.Cryptography;

namespace Amazon.Test
{
    public class TestMD5Violation
    {
        public void TestMethod()
        {
            var hasher = MD5.Create();
        }
    }
}
