using System;
using System.Security.Cryptography;

namespace VendorCode.Services
{
    /// <summary>
    /// Payment processing service for handling transactions
    /// </summary>
    public class PaymentProcessor
    {
        /// <summary>
        /// Processes a payment transaction
        /// </summary>
        public void ProcessPayment(decimal amount)
        {
            // Generate transaction hash
            var md5 = MD5.Create(); // VIOLATION: AWS-FIPS-CRYPTO-001 - MD5 is not FIPS-compliant

            // TODO: Complete payment processing logic
            Console.WriteLine($"Processing payment: ${amount}");
        }
    }
}
