using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Security.Cryptography;

namespace VendorCodeArchive.TestFiles
{
    /// <summary>
    /// Test file for Semgrep plugin validation
    /// Contains intentional security violations to test semgrep-validator plugin
    /// </summary>
    public class SemgrepTestFile
    {
        // VIOLATION: Hardcoded API key (SEMGREP-SEC-HARDCODE)
        private const string ApiKey = "FAKE_API_KEY_1234567890_DO_NOT_USE";

        // VIOLATION: Hardcoded database password (SEMGREP-SEC-HARDCODE)
        private const string DbPassword = "HARDCODED_PASSWORD_FOR_TESTING";

        /// <summary>
        /// VIOLATION: SQL Injection vulnerability (SEMGREP-SEC-SQLINJEC)
        /// </summary>
        public void UnsafeDatabaseQuery(string userId)
        {
            var connectionString = $"Server=localhost;Database=TestDB;User Id=admin;Password={DbPassword};";
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // SQL Injection: user input directly concatenated into SQL query
                var query = "SELECT * FROM Users WHERE UserId = '" + userId + "'";
                using (var command = new SqlCommand(query, connection))
                {
                    var result = command.ExecuteScalar();
                }
            }
        }

        /// <summary>
        /// VIOLATION: Command Injection vulnerability (SEMGREP-SEC-COMMANDI)
        /// </summary>
        public void UnsafeCommandExecution(string filename)
        {
            // Command injection: user input passed directly to process
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c type " + filename,  // Unsafe concatenation
                    UseShellExecute = false
                }
            };
            process.Start();
        }

        /// <summary>
        /// VIOLATION: Weak cryptography (SEMGREP-SEC-WEAKCRYP)
        /// </summary>
        public string WeakHash(string input)
        {
            // MD5 is cryptographically broken
            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
            }
        }

        /// <summary>
        /// VIOLATION: XSS vulnerability in web context (SEMGREP-SEC-XSS)
        /// </summary>
        public string UnsafeHtmlGeneration(string userInput)
        {
            // User input not sanitized before rendering in HTML
            return $"<div>Welcome, {userInput}!</div>";
        }

        /// <summary>
        /// VIOLATION: Hardcoded encryption key (SEMGREP-SEC-HARDCODE)
        /// </summary>
        public byte[] GetEncryptionKey()
        {
            // Hardcoded encryption key - should be from secure key store
            return new byte[] { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 };
        }
    }
}
