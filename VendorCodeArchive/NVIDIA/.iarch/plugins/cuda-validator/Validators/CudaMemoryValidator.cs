namespace IArchitecture.CudaValidator.Validators;

using System;
using System.Collections.Generic;
using System.Linq;
using IArchitecture.Plugin.SDK.Plugins;
using IArchitecture.CudaValidator.Models;

/// <summary>
/// Validates CUDA memory allocations have corresponding frees
/// Detects potential memory leaks in GPU code
/// </summary>
public static class CudaMemoryValidator
{
    public static List<PluginViolation> Validate(CudaCodeAnalysis analysis, string filePath)
    {
        var violations = new List<PluginViolation>();

        // Check each allocation for corresponding free
        foreach (var allocation in analysis.Allocations)
        {
            // Skip if this is checked by error handling
            if (!allocation.HasErrorCheck)
            {
                violations.Add(new PluginViolation
                {
                    Id = "NVIDIA-CUDA-MEMORY-002",
                    Message = $"CUDA memory allocation ({allocation.Type}) without error check - potential leak if allocation fails",
                    Line = allocation.LineNumber,
                    Severity = "Error",
                    Snippet = $"Variable: {allocation.VariableName}"
                });
            }

            // Check for corresponding free
            var matchingFree = FindMatchingFree(allocation, analysis.Frees);
            if (matchingFree == null && !string.IsNullOrEmpty(allocation.VariableName))
            {
                violations.Add(new PluginViolation
                {
                    Id = "NVIDIA-CUDA-MEMORY-002",
                    Message = $"{allocation.Type} without corresponding free - potential memory leak",
                    Line = allocation.LineNumber,
                    Severity = "Fatal",
                    Snippet = $"Variable '{allocation.VariableName}' allocated but never freed"
                });
            }
        }

        return violations;
    }

    private static CudaFree? FindMatchingFree(CudaAllocation allocation, List<CudaFree> frees)
    {
        // Match allocation type to free type
        var expectedFreeType = allocation.Type switch
        {
            "cudaMalloc" => "cudaFree",
            "cudaMallocHost" => "cudaFreeHost",
            "cudaMallocManaged" => "cudaFree",
            "cudaMallocAsync" => "cudaFreeAsync",
            _ => "cudaFree"
        };

        // Find free that matches variable name and type
        return frees.FirstOrDefault(f =>
            f.VariableName.Equals(allocation.VariableName, StringComparison.OrdinalIgnoreCase) &&
            f.Type.Equals(expectedFreeType, StringComparison.OrdinalIgnoreCase));
    }
}
