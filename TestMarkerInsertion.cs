//using architecture IUnknownArchitecture;

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
// VIOLATION: AWS-CONFIG-CREDENTIALS-001 - Hardcoded AWS credentials detected in configuration files - must use environment variables or credential profiles
// SEVERITY: FATAL
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} credentials in app.config expose AWS infrastructure to {{SILO:COMPLIANCE_REQUIREMENTS}} violations and breaches
// QUICK_FIX: Use environment variables, AWS credential profiles, or IAM roles for {{SILO:SECURITY_LEVEL}} credential management
// BUSINESS_IMPACT: Config file credentials cause $4.45M average breach cost - exposed in source control and deployment packages for AWS_DOTNET_APPLICATION
// DOCS: https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/creds-assign.html

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
