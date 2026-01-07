namespace IArchitecture.CudaValidator.Validators;

using System.Collections.Generic;
using IArchitecture.Plugin.SDK.Plugins;
using IArchitecture.CudaValidator.Models;

/// <summary>
/// Validates CUDA API calls have proper error checking
/// Ensures production robustness and debugging support
/// </summary>
public static class CudaErrorCheckValidator
{
    public static List<PluginViolation> Validate(CudaCodeAnalysis analysis, string filePath)
    {
        var violations = new List<PluginViolation>();

        // Check API calls for error checking
        foreach (var apiCall in analysis.ApiCalls)
        {
            if (!apiCall.HasErrorCheck)
            {
                violations.Add(new PluginViolation
                {
                    Id = "NVIDIA-CUDA-ERROR-001",
                    Message = $"{apiCall.ApiName} without error check - silent failures violate production standards",
                    Line = apiCall.LineNumber,
                    Severity = "Error",
                    Snippet = $"Add error checking: cudaError_t err = {apiCall.ApiName}(...); if (err != cudaSuccess) {{ ... }}"
                });
            }
        }

        // Check kernel launches for error checking
        foreach (var kernel in analysis.KernelLaunches)
        {
            if (!kernel.HasErrorCheck)
            {
                violations.Add(new PluginViolation
                {
                    Id = "NVIDIA-CUDA-ERROR-001",
                    Message = $"Kernel launch '{kernel.KernelName}' without error check - use cudaGetLastError()",
                    Line = kernel.LineNumber,
                    Severity = "Error",
                    Snippet = "Add after kernel: cudaError_t err = cudaGetLastError(); if (err != cudaSuccess) { ... }"
                });
            }
        }

        return violations;
    }
}
