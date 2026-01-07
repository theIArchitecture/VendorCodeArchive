using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using IArchitecture.Plugin.SDK.Plugins;
using IArchitecture.CudaValidator.Models;
using IArchitecture.CudaValidator.Validators;

namespace IArchitecture.CudaValidator;

/// <summary>
/// Validates CUDA code for memory leaks and missing error checks
/// Uses O(n) line-by-line parsing instead of complex multi-line regex
/// Performance: Single-pass O(n) vs O(n²) regex catastrophic backtracking
/// </summary>
public sealed class CudaValidator
{
    /// <summary>
    /// Plugin entry point - invoked by PluginExecutor via reflection
    /// Must match signature: Task&lt;PluginOutput&gt; Execute(PluginInput)
    /// </summary>
    public async Task<PluginOutput> Execute(PluginInput input)
    {
        var violations = new List<PluginViolation>();

        try
        {
            // Parse CUDA code into analysis structure (lightweight, O(n))
            var analysis = ParseCudaCode(input.FileContent);

            // Run all validators
            violations.AddRange(CudaMemoryValidator.Validate(analysis, input.FilePath));
            violations.AddRange(CudaErrorCheckValidator.Validate(analysis, input.FilePath));

            return await Task.FromResult(new PluginOutput
            {
                Violations = violations
            });
        }
        catch (Exception ex)
        {
            return new PluginOutput
            {
                Error = $"CUDA validation failed: {ex.Message}"
            };
        }
    }

    /// <summary>
    /// Lightweight parser: O(n) line-by-line scanning for CUDA patterns
    /// Tracks allocations, frees, API calls, kernels, and error checks
    /// </summary>
    private CudaCodeAnalysis ParseCudaCode(string content)
    {
        var analysis = new CudaCodeAnalysis();
        var lines = content.Split('\n');

        // Track error checks in nearby lines (within 3 lines)
        var recentErrorChecks = new Queue<int>();

        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            var lineNumber = i + 1;

            // Skip empty lines and comments
            if (string.IsNullOrWhiteSpace(line) || line.StartsWith("//") || line.StartsWith("/*"))
                continue;

            // Maintain sliding window of recent error checks (3-line window)
            while (recentErrorChecks.Count > 0 && recentErrorChecks.Peek() < lineNumber - 3)
                recentErrorChecks.Dequeue();

            // Detect error check patterns
            if (IsErrorCheck(line))
            {
                analysis.ErrorChecks.Add(new ErrorCheck
                {
                    LineNumber = lineNumber,
                    Type = GetErrorCheckType(line)
                });
                recentErrorChecks.Enqueue(lineNumber);
            }

            // Detect memory allocations
            var allocation = DetectAllocation(line, lineNumber);
            if (allocation != null)
            {
                allocation.HasErrorCheck = recentErrorChecks.Count > 0 || CheckNextLineForError(lines, i);
                analysis.Allocations.Add(allocation);
            }

            // Detect memory frees
            var free = DetectFree(line, lineNumber);
            if (free != null)
            {
                analysis.Frees.Add(free);
            }

            // Detect API calls
            var apiCall = DetectApiCall(line, lineNumber);
            if (apiCall != null)
            {
                apiCall.HasErrorCheck = recentErrorChecks.Count > 0 || CheckNextLineForError(lines, i);
                analysis.ApiCalls.Add(apiCall);
            }

            // Detect kernel launches
            var kernel = DetectKernelLaunch(line, lineNumber);
            if (kernel != null)
            {
                kernel.HasErrorCheck = CheckNextLineForError(lines, i);
                analysis.KernelLaunches.Add(kernel);
            }
        }

        return analysis;
    }

    private bool IsErrorCheck(string line)
    {
        return line.Contains("cudaError_t") ||
               line.Contains("cudaGetLastError") ||
               line.Contains("cudaPeekAtLastError") ||
               line.Contains("CUDA_CHECK") ||
               line.Contains("CHECK_CUDA") ||
               (line.Contains("if") && line.Contains("cudaSuccess"));
    }

    private string GetErrorCheckType(string line)
    {
        if (line.Contains("cudaError_t")) return "cudaError_t";
        if (line.Contains("cudaGetLastError")) return "cudaGetLastError";
        if (line.Contains("cudaPeekAtLastError")) return "cudaPeekAtLastError";
        if (line.Contains("CUDA_CHECK")) return "CUDA_CHECK";
        if (line.Contains("CHECK_CUDA")) return "CHECK_CUDA";
        return "if_check";
    }

    private bool CheckNextLineForError(string[] lines, int currentIndex)
    {
        // Check next 3 lines for error checking
        for (int i = 1; i <= 3 && currentIndex + i < lines.Length; i++)
        {
            var nextLine = lines[currentIndex + i].Trim();
            if (IsErrorCheck(nextLine))
                return true;
        }
        return false;
    }

    private CudaAllocation? DetectAllocation(string line, int lineNumber)
    {
        string[] allocationTypes = { "cudaMalloc", "cudaMallocHost", "cudaMallocManaged", "cudaMallocAsync" };

        foreach (var allocType in allocationTypes)
        {
            if (line.Contains(allocType))
            {
                var varName = ExtractVariableName(line, allocType);
                return new CudaAllocation
                {
                    LineNumber = lineNumber,
                    Type = allocType,
                    VariableName = varName
                };
            }
        }
        return null;
    }

    private CudaFree? DetectFree(string line, int lineNumber)
    {
        string[] freeTypes = { "cudaFree", "cudaFreeHost", "cudaFreeAsync" };

        foreach (var freeType in freeTypes)
        {
            if (line.Contains(freeType))
            {
                var varName = ExtractVariableName(line, freeType);
                return new CudaFree
                {
                    LineNumber = lineNumber,
                    Type = freeType,
                    VariableName = varName
                };
            }
        }
        return null;
    }

    private CudaApiCall? DetectApiCall(string line, int lineNumber)
    {
        string[] apiCalls = { "cudaMemcpy", "cudaMemset", "cudaMemcpyAsync", "cudaMemcpyToSymbol", "cudaMemcpyFromSymbol" };

        foreach (var apiName in apiCalls)
        {
            if (line.Contains(apiName))
            {
                return new CudaApiCall
                {
                    LineNumber = lineNumber,
                    ApiName = apiName
                };
            }
        }
        return null;
    }

    private KernelLaunch? DetectKernelLaunch(string line, int lineNumber)
    {
        // Detect kernel launch syntax: kernelName<<<grid, block>>>(args)
        var kernelPattern = @"(\w+)\s*<<<";
        var match = Regex.Match(line, kernelPattern);

        if (match.Success)
        {
            return new KernelLaunch
            {
                LineNumber = lineNumber,
                KernelName = match.Groups[1].Value
            };
        }
        return null;
    }

    private string ExtractVariableName(string line, string callType)
    {
        // Extract variable name from patterns like:
        // cudaMalloc(&ptr, size)
        // cudaMalloc((void**)&ptr, size)
        // cudaFree(ptr)

        var callIndex = line.IndexOf(callType);
        if (callIndex == -1) return string.Empty;

        var parenStart = line.IndexOf('(', callIndex);
        if (parenStart == -1) return string.Empty;

        var parenEnd = line.IndexOf(')', parenStart);
        if (parenEnd == -1) return string.Empty;

        var argsString = line.Substring(parenStart + 1, parenEnd - parenStart - 1);

        // For malloc: take first arg (usually &ptr or (void**)&ptr)
        // For free: take only arg (usually ptr)
        var firstArg = argsString.Split(',')[0].Trim();

        // Remove casts, ampersands, and parentheses
        firstArg = firstArg.Replace("(void**)", "")
                           .Replace("(void*)", "")
                           .Replace("&", "")
                           .Replace("(", "")
                           .Replace(")", "")
                           .Trim();

        return firstArg;
    }
}
