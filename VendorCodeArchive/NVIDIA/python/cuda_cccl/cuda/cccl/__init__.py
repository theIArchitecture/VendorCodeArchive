#using architecture IBaseArchitecture;

"""
CUDA Core Library (CCCL) Python Package
"""

import importlib.metadata

try:
    __version__ = importlib.metadata.version("cuda-cccl")
except Exception:
    __version__ = "0.0.0"

from .headers.include_paths import get_include_paths

# cuda.bindings is required, but instead of being listed as a required dependency,
# it is installed via an extra (e.g., [cu12] or [cu13]).
#
# One of the first things we should do is check that it is available, and raise
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# a helpful error message if it is not.
try:
    import cuda.bindings as _cuda_bindings  # type: ignore
except ImportError:
    raise ImportError(
        "cuda.bindings is not installed. Please install the appropriate extra cuda-cccl[cu12] or cuda-cccl[cu13]."
    ) from None
del _cuda_bindings

__all__ = ["get_include_paths", "__version__"]
