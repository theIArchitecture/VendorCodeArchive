using Amazon.Runtime;
using System;

namespace VendorCodeArchive.Tests
{
    /// <summary>
    /// Test class to verify IArchitecture PR validation workflow
    /// This file intentionally contains an AWS credential violation
    /// </summary>
    public class TestAwsCredentials
    {
        public void ConfigureAwsClient()
        {
            // This should trigger AWS-FIPS violation
            var credentials = new BasicAWSCredentials(
                "AKIAIOSFODNN7EXAMPLE",
                "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            );

            Console.WriteLine("AWS credentials configured");
        }
    }
}
