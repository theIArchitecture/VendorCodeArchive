namespace IArchitecture.CudaValidator.Models;

using System.Collections.Generic;

/// <summary>
/// Tracks CUDA API calls for memory and error checking analysis
/// Uses O(n) line-by-line parsing instead of complex regex
/// </summary>
public sealed class CudaCodeAnalysis
{
    /// <summary>Memory allocation calls found (cudaMalloc, cudaMallocHost, etc.)</summary>
    public List<CudaAllocation> Allocations { get; set; } = new();

    /// <summary>Memory free calls found (cudaFree, cudaFreeHost, etc.)</summary>
    public List<CudaFree> Frees { get; set; } = new();

    /// <summary>CUDA API calls that should be error-checked</summary>
    public List<CudaApiCall> ApiCalls { get; set; } = new();

    /// <summary>Kernel launches (<<<grid, block>>> syntax)</summary>
    public List<KernelLaunch> KernelLaunches { get; set; } = new();

    /// <summary>Error check patterns found (cudaError_t, cudaGetLastError, etc.)</summary>
    public List<ErrorCheck> ErrorChecks { get; set; } = new();
}

/// <summary>Represents a CUDA memory allocation</summary>
public sealed class CudaAllocation
{
    public int LineNumber { get; set; }
    public string Type { get; set; } = string.Empty;  // "cudaMalloc", "cudaMallocHost", etc.
    public string VariableName { get; set; } = string.Empty;
    public bool HasErrorCheck { get; set; }
}

/// <summary>Represents a CUDA memory free</summary>
public sealed class CudaFree
{
    public int LineNumber { get; set; }
    public string Type { get; set; } = string.Empty;  // "cudaFree", "cudaFreeHost", etc.
    public string VariableName { get; set; } = string.Empty;
}

/// <summary>Represents a CUDA API call that should be error-checked</summary>
public sealed class CudaApiCall
{
    public int LineNumber { get; set; }
    public string ApiName { get; set; } = string.Empty;  // "cudaMemcpy", "cudaMemset", etc.
    public bool HasErrorCheck { get; set; }
}

/// <summary>Represents a CUDA kernel launch</summary>
public sealed class KernelLaunch
{
    public int LineNumber { get; set; }
    public string KernelName { get; set; } = string.Empty;
    public bool HasErrorCheck { get; set; }
}

/// <summary>Represents an error check pattern</summary>
public sealed class ErrorCheck
{
    public int LineNumber { get; set; }
    public string Type { get; set; } = string.Empty;  // "cudaError_t", "cudaGetLastError", "CUDA_CHECK", etc.
}
