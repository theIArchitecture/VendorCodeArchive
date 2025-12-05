//using architecture IUnknownArchitecture;

using System.Security.Cryptography;

  namespace VendorCodeArchive.Tests
  {
      public class TestHealing
      {
// HEALED: AWS-FIPS-CRYPTO-001 → FIXED by AWS-FIPS-CRYPTO-001
// SEVERITY: INFO
// APPLIED_FIXES: MD5.Create() → SHA256.Create() (1 occurrences); \bSHA1\s+(\w+)\b → SHA256 \\1 (1 occurrences)

          public void CalculateHash()
          {
              var hash = SHA256.Create()();
              // This should be healed to SHA256.Create()
          }
      }
  }