using System.Security.Cryptography;

  namespace VendorCodeArchive.Tests
  {
      public class TestHealing
      {
          public void CalculateHash()
          {
              var hash = MD5.Create();
              // This should be healed to SHA256.Create()
          }
      }
  }