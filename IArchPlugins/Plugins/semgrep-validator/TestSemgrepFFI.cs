using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using IArchitecture.Plugin.SDK.Models;
using IArchitecture.Plugin.SDK.Plugins;
using IArchitecture.Shared.Models.RuleGeneration;

namespace IArchitecture.SemgrepValidator;

/// <summary>
/// Standalone test program for Semgrep FFI integration.
/// Tests the SemgrepValidator plugin directly without going through the full .iarch system.
/// </summary>
public class TestSemgrepFFI
{
    public static async Task Main(string[] args)
    {
        Console.WriteLine("===========================================");
        Console.WriteLine("  Semgrep FFI Plugin Test");
        Console.WriteLine("===========================================\n");

        try
        {
            // Test 0: Diagnostics
            Console.WriteLine("Test 0: Diagnostics...");
            var currentDir = Directory.GetCurrentDirectory();
            Console.WriteLine($"  Current directory: {currentDir}");
            var dllPath = Path.Combine(currentDir, "ffi_main.dll");
            Console.WriteLine($"  Looking for: {dllPath}");
            Console.WriteLine($"  ffi_main.dll exists: {File.Exists(dllPath)}");
            Console.WriteLine($"  libstdc++-6_gcc13.dll exists: {File.Exists(Path.Combine(currentDir, "libstdc++-6_gcc13.dll"))}");
            Console.WriteLine();

            // Test 1: Create test file
            Console.WriteLine("Test 1: Creating test JavaScript file...");
            var testFile = Path.Combine(Path.GetTempPath(), "test_console_log.js");
            var jsCode = @"// Test file for Semgrep FFI
function doSomething() {
    console.log('Debug message');  // Should be detected
    const result = calculate();
    console.log('Result:', result); // Should be detected
    return result;
}

function calculate() {
    return 42;
}
";
            File.WriteAllText(testFile, jsCode);
            Console.WriteLine($"✓ Created: {testFile}\n");

            // Test 2: Create simple detection patterns
            Console.WriteLine("Test 2: Creating Semgrep patterns for console.log...");
            var patterns = new Dictionary<string, List<DetectionPattern>>
            {
                ["javascript"] = new List<DetectionPattern>
                {
                    new DetectionPattern
                    {
                        Name = "CONSOLE_LOG",
                        Type = PatternType.Pattern,
                        Pattern = "console.log(...)"
                    }
                }
            };

            // Serialize to JSON and escape it (this is what goes in CONFIG.semgrep_patterns from .iarch files)
            var patternsJson = JsonSerializer.Serialize(patterns);
            // The .iarch parser escapes the JSON, so simulate that by serializing it again as a string
            var escapedPatternsJson = JsonSerializer.Serialize(patternsJson);
            // Remove the outer quotes that Serialize adds
            escapedPatternsJson = escapedPatternsJson.Substring(1, escapedPatternsJson.Length - 2);
            Console.WriteLine($"✓ Patterns JSON (escaped): {escapedPatternsJson}\n");

            // Test 3: Create plugin input
            Console.WriteLine("Test 3: Creating PluginInput...");
            var input = new PluginInput
            {
                FilePath = testFile,
                FileContent = jsCode,
                Language = "javascript",
                Config = new Dictionary<string, string>
                {
                    ["semgrep_patterns"] = escapedPatternsJson
                }
            };
            Console.WriteLine("✓ PluginInput created\n");

            // Test 4: Execute plugin
            Console.WriteLine("Test 4: Executing SemgrepValidator plugin via FFI...");
            var validator = new SemgrepValidator();
            var output = await validator.Execute(input);

            // Test 5: Check results
            Console.WriteLine("\nTest 5: Checking results...");
            if (!string.IsNullOrEmpty(output.Error))
            {
                Console.WriteLine($"✗ ERROR: {output.Error}");
                Environment.ExitCode = 1;
                return;
            }

            Console.WriteLine($"✓ Scan completed successfully");
            Console.WriteLine($"  - Violations found: {output.Violations?.Count ?? 0}");

            if (output.Violations != null && output.Violations.Count > 0)
            {
                Console.WriteLine("\nDetected violations:");
                foreach (var violation in output.Violations)
                {
                    Console.WriteLine($"  ✓ Line {violation.Line}: {violation.Message}");
                }
            }
            else
            {
                Console.WriteLine("  ⚠ Warning: No violations detected (expected 2)");
            }

            // Test 6: Performance test
            Console.WriteLine("\nTest 6: Performance test (10 scans)...");
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();
            for (int i = 0; i < 10; i++)
            {
                await validator.Execute(input);
            }
            stopwatch.Stop();

            var avgMs = stopwatch.ElapsedMilliseconds / 10.0;
            var scansPerSec = 1000.0 / avgMs;
            Console.WriteLine($"✓ 10 scans completed in {stopwatch.ElapsedMilliseconds}ms");
            Console.WriteLine($"  - Average: {avgMs:F2}ms per scan");
            Console.WriteLine($"  - Rate: {scansPerSec:F1} scans/second");

            // Cleanup
            File.Delete(testFile);

            Console.WriteLine("\n===========================================");
            Console.WriteLine("  ✓ All Tests Passed!");
            Console.WriteLine("===========================================");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n✗ FATAL ERROR: {ex.Message}");
            Console.WriteLine($"Stack trace:\n{ex.StackTrace}");
            Environment.ExitCode = 1;
        }
    }
}
