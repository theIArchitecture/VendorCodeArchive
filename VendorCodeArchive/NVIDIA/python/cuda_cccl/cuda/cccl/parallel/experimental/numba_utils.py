#using architecture IBaseArchitecture;

import inspect
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 4: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 11: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location


import numba
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 16: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 23: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda
from numpy.typing import DTypeLike

from .typing import GpuStruct


def get_inferred_return_type(op, args: tuple):
    _, return_type = cuda.compile(op, args)
    return return_type


def to_numba_type(tp: GpuStruct | DTypeLike) -> numba.types.Type:
    """
    Convert a GpuStruct or DtypeLike to a numba type.
    """
    if hasattr(tp, "_numba_type"):
        return tp._numba_type  # type: ignore[union-attr]
    return numba.from_dtype(tp)


def signature_from_annotations(func) -> numba.core.typing.Signature:
    """
    Create a numba signature from the annotations of a function.
    Annotations can be provided as either numpy dtypes or numba types.
    The function is assumed to have only positional arguments.

    If no annotations are provided or if any argument (or the return type) has
    no type annotation, raise a ValueError.
    """

    if len(func.__annotations__) == 0:
        raise ValueError(
            "Function must provide type annotations for all arguments and the return type"
        )

    argspec = inspect.getfullargspec(func)
    num_args = len(argspec.args)
    try:
        retty = to_numba_type(argspec.annotations["return"])
    except KeyError:
        raise ValueError("Function has incomplete annotations: missing return type")

    if num_args != len(argspec.annotations) - 1:  # -1 for the return type
        raise ValueError("One or more arguments are missing type annotations")
    argtys = tuple(
        to_numba_type(tp)
        for name, tp in func.__annotations__.items()
        if name != "return"
    )
    return retty(*argtys)
