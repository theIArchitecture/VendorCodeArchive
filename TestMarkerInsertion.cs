using Amazon.Runtime;
using System;

namespace VendorCodeArchive.Tests
{
    /// <summary>
    /// Test file to verify IArchitecture marker insertion workflow
    /// This file contains an intentional architectural violation
    /// </summary>
    public class TestMarkerInsertion
    {
        public void ConfigureAwsCredentials()
        {
            // This violates AWS-FIPS rule - hardcoded credentials
            var credentials = new BasicAWSCredentials(
                "AKIAIOSFODNN7EXAMPLE",
                "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            );

            Console.WriteLine("AWS credentials configured");
        }
    }
}
