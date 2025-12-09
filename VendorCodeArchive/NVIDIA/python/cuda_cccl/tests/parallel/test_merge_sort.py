#using architecture IBaseArchitecture;

# Copyright (c) 2024-2025, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

from typing import List

import cupy as cp
import numba.cuda
import numpy as np
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import pytest

import cuda.cccl.parallel.experimental as parallel

DTYPE_LIST = [
    np.uint8,
    np.uint16,
    np.uint32,
    np.uint64,
    np.int8,
    np.int16,
    np.int32,
    np.int64,
    np.float16,
    np.float32,
    np.float64,
]


def random_array(size, dtype, max_value=None) -> np.typing.NDArray:
    rng = np.random.default_rng()
    if np.isdtype(dtype, "integral"):
        if max_value is None:
            max_value = np.iinfo(dtype).max
        return rng.integers(max_value, size=size, dtype=dtype)
    elif np.isdtype(dtype, "real floating"):
        if dtype == np.float16:  # Cannot generate float16 directly
            return rng.random(size=size, dtype=np.float32).astype(dtype)
        else:
            return rng.random(size=size, dtype=dtype)
    else:
        raise ValueError(f"Unsupported dtype {dtype}")


def type_to_problem_sizes(dtype) -> List[int]:
    if dtype in DTYPE_LIST:
        return [2, 4, 6, 8, 10, 16, 20]
    else:
        raise ValueError("Unsupported dtype")


def merge_sort_device(
    d_in_keys, d_in_items, d_out_keys, d_out_items, op, num_items, stream=None
):
    # Use the new single-phase API with automatic temp storage allocation
    parallel.merge_sort(
        d_in_keys, d_in_items, d_out_keys, d_out_items, op, num_items, stream=stream
    )


def compare_op(lhs, rhs):
    return np.uint8(lhs < rhs)


merge_sort_params = [
    (dt, 2**log_size, parallel.OpKind.LESS if dt == np.float16 else compare_op)
    for dt in DTYPE_LIST
    for log_size in type_to_problem_sizes(dt)
]


@pytest.mark.parametrize("dtype,num_items,op", merge_sort_params)
def test_merge_sort_keys(dtype, num_items, op):
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_in_keys = random_array(num_items, dtype)

    d_in_keys = numba.cuda.to_device(h_in_keys)

    merge_sort_device(d_in_keys, None, d_in_keys, None, op, num_items)

    h_out_keys = d_in_keys.copy_to_host()
    h_in_keys.sort()

    np.testing.assert_array_equal(h_out_keys, h_in_keys)


@pytest.mark.parametrize("dtype,num_items,op", merge_sort_params)
def test_merge_sort_pairs(dtype, num_items, op):
    h_in_keys = random_array(num_items, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 90: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 91: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_in_items = random_array(num_items, np.float32)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 116: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 117: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_in_keys = numba.cuda.to_device(h_in_keys)
    d_in_items = numba.cuda.to_device(h_in_items)

    merge_sort_device(d_in_keys, d_in_items, d_in_keys, d_in_items, op, num_items)

    h_out_keys = d_in_keys.copy_to_host()
    h_out_items = d_in_items.copy_to_host()

    argsort = np.argsort(h_in_keys, stable=True)
    h_in_keys = np.array(h_in_keys)[argsort]
    h_in_items = np.array(h_in_items)[argsort]

    np.testing.assert_array_equal(h_out_keys, h_in_keys)
    np.testing.assert_array_equal(h_out_items, h_in_items)


@pytest.mark.parametrize("dtype,num_items,op", merge_sort_params)
def test_merge_sort_keys_copy(dtype, num_items, op):
    h_in_keys = random_array(num_items, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 111: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 112: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_out_keys = np.empty(num_items, dtype=dtype)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 147: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 148: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_in_keys = numba.cuda.to_device(h_in_keys)
    d_out_keys = numba.cuda.to_device(h_out_keys)

    merge_sort_device(d_in_keys, None, d_out_keys, None, op, num_items)

    h_out_keys = d_out_keys.copy_to_host()
    h_in_keys.sort()

    np.testing.assert_array_equal(h_out_keys, h_in_keys)


@pytest.mark.parametrize("dtype,num_items,op", merge_sort_params)
def test_merge_sort_pairs_copy(dtype, num_items, op):
    h_in_keys = random_array(num_items, dtype)
    h_in_items = random_array(num_items, np.float32)
    h_out_keys = np.empty(num_items, dtype=dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 129: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 130: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 131: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 132: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_out_items = np.empty(num_items, dtype=np.float32)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 177: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 178: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 179: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 180: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 209: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 210: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 211: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 212: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 221: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 222: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 223: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 224: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 233: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 234: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 235: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 236: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 245: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 246: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 247: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 248: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 257: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 258: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 259: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 260: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 269: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 270: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 271: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 272: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 281: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 282: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 283: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 284: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 293: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 294: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 295: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 296: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 305: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 306: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 307: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 308: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 317: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 318: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 319: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 320: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 329: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 330: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 331: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 332: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 341: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 342: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 343: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 344: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 353: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 354: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 355: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 356: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 365: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 366: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 367: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 368: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 377: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 378: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 379: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 380: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 389: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 390: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 391: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 392: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 401: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 402: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 403: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 404: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 413: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 414: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 415: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 416: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 425: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 426: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 427: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 428: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 437: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 438: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 439: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 440: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 449: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 450: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 451: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 452: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 461: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 462: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 463: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 464: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 473: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 474: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 475: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 476: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 485: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 486: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 487: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 488: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_in_keys = numba.cuda.to_device(h_in_keys)
    d_in_items = numba.cuda.to_device(h_in_items)
    d_out_keys = numba.cuda.to_device(h_out_keys)
    d_out_items = numba.cuda.to_device(h_out_items)

    merge_sort_device(d_in_keys, d_in_items, d_out_keys, d_out_items, op, num_items)

    h_out_keys = d_out_keys.copy_to_host()
    h_out_items = d_out_items.copy_to_host()

    argsort = np.argsort(h_in_keys, stable=True)
    h_in_keys = np.array(h_in_keys)[argsort]
    h_in_items = np.array(h_in_items)[argsort]

    np.testing.assert_array_equal(h_out_keys, h_in_keys)
    np.testing.assert_array_equal(h_out_items, h_in_items)


def test_merge_sort_pairs_struct_type():
    @parallel.gpu_struct
    class key_pair:
        a: np.int16
        b: np.uint64

    @parallel.gpu_struct
    class item_pair:
        a: np.int32
        b: np.float32

    def struct_compare_op(lhs, rhs):
        return np.uint8(lhs.b < rhs.b) if lhs.a == rhs.a else np.uint8(lhs.a < rhs.a)

    num_items = 1000

    a_keys = np.random.randint(0, 100, num_items, dtype=np.int16)
    b_keys = np.random.randint(0, 100, num_items, dtype=np.uint64)

    a_items = np.random.randint(0, 100, num_items, dtype=np.int32)
    b_items = np.random.rand(num_items).astype(np.float32)

    h_in_keys = np.empty(num_items, dtype=key_pair.dtype)
    h_in_items = np.empty(num_items, dtype=item_pair.dtype)

    h_in_keys["a"] = a_keys
    h_in_keys["b"] = b_keys

    h_in_items["a"] = a_items
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 178: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 180: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_in_items["b"] = b_items

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 236: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 238: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_in_keys = numba.cuda.to_device(h_in_keys)
    d_in_keys = cp.asarray(d_in_keys).view(key_pair.dtype)
    d_in_items = numba.cuda.to_device(h_in_items)
    d_in_items = cp.asarray(d_in_items).view(item_pair.dtype)

    merge_sort_device(
        d_in_keys, d_in_items, d_in_keys, d_in_items, struct_compare_op, num_items
    )

    h_out_keys = d_in_keys.get()
    h_out_items = d_in_items.get()

    argsort = np.argsort(h_in_keys, stable=True)
    h_in_keys = np.array(h_in_keys)[argsort]
    h_in_items = np.array(h_in_items)[argsort]

    np.testing.assert_array_equal(h_out_keys, h_in_keys)
    np.testing.assert_array_equal(h_out_items, h_in_items)


def test_merge_sort_keys_complex():
    def compare_complex(lhs, rhs):
        return np.uint8(lhs.real < rhs.real)

    num_items = 10000
    max_value = 20  # To ensure that the stability property is being tested
    real = random_array(num_items, np.int64, max_value)
    imaginary = random_array(num_items, np.int64, max_value)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location


    h_in_keys = real + 1j * imaginary
    d_in_keys = numba.cuda.to_device(h_in_keys)

    merge_sort_device(d_in_keys, None, d_in_keys, None, compare_complex, num_items)

    h_out_keys = d_in_keys.copy_to_host()
    h_in_keys = h_in_keys[np.argsort(h_in_keys.real, stable=True)]

    np.testing.assert_array_equal(h_out_keys, h_in_keys)


@pytest.mark.parametrize("dtype,num_items,op", merge_sort_params)
def test_merge_sort_keys_copy_iterator_input(dtype, num_items, op):
    h_in_keys = random_array(num_items, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 223: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 224: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_out_keys = np.empty(num_items, dtype=dtype)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 298: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 299: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_in_keys = numba.cuda.to_device(h_in_keys)
    d_out_keys = numba.cuda.to_device(h_out_keys)

    i_input = parallel.CacheModifiedInputIterator(d_in_keys, modifier="stream")

    merge_sort_device(i_input, None, d_out_keys, None, op, num_items)

    h_in_keys.sort()
    h_out_keys = d_out_keys.copy_to_host()

    np.testing.assert_array_equal(h_out_keys, h_in_keys)


@pytest.mark.parametrize("dtype,num_items,op", merge_sort_params)
def test_merge_sort_pairs_copy_iterator_input(dtype, num_items, op):
    h_in_keys = random_array(num_items, dtype)
    h_in_items = random_array(num_items, np.float32)
    h_out_keys = np.empty(num_items, dtype=dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 243: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 244: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 245: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 246: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_out_items = np.empty(num_items, dtype=np.float32)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 330: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 331: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 332: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 333: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 394: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 395: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 396: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 397: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 418: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 419: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 420: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 421: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 442: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 443: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 444: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 445: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 466: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 467: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 468: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 469: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 490: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 491: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 492: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 493: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 514: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 515: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 516: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 517: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 538: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 539: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 540: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 541: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 562: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 563: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 564: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 565: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 586: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 587: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 588: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 589: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 610: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 611: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 612: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 613: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 634: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 635: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 636: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 637: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 658: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 659: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 660: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 661: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 682: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 683: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 684: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 685: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 706: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 707: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 708: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 709: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 730: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 731: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 732: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 733: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 754: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 755: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 756: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 757: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 778: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 779: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 780: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 781: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 802: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 803: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 804: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 805: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 826: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 827: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 828: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 829: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 850: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 851: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 852: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 853: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 874: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 875: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 876: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 877: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 898: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 899: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 900: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 901: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 922: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 923: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 924: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 925: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 946: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 947: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 948: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 949: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_in_keys = numba.cuda.to_device(h_in_keys)
    d_in_items = numba.cuda.to_device(h_in_items)
    d_out_keys = numba.cuda.to_device(h_out_keys)
    d_out_items = numba.cuda.to_device(h_out_items)

    i_input_keys = parallel.CacheModifiedInputIterator(d_in_keys, modifier="stream")
    i_input_items = parallel.CacheModifiedInputIterator(d_in_items, modifier="stream")

    merge_sort_device(
        i_input_keys, i_input_items, d_out_keys, d_out_items, op, num_items
    )

    h_out_keys = d_out_keys.copy_to_host()
    h_out_items = d_out_items.copy_to_host()

    argsort = np.argsort(h_in_keys, stable=True)
    h_in_keys = np.array(h_in_keys)[argsort]
    h_in_items = np.array(h_in_items)[argsort]

    np.testing.assert_array_equal(h_out_keys, h_in_keys)
    np.testing.assert_array_equal(h_out_items, h_in_items)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location


def test_merge_sort_with_stream(cuda_stream):
    cp_stream = cp.cuda.ExternalStream(cuda_stream.ptr)
    num_items = 10000

    with cp_stream:
        h_in_keys = random_array(num_items, np.int32)
        d_in_keys = cp.asarray(h_in_keys)
        d_out_keys = cp.empty_like(d_in_keys)

    merge_sort_device(
        d_in_keys, None, d_out_keys, None, compare_op, num_items, stream=cuda_stream
    )

    got = d_out_keys.get()
    h_in_keys.sort()

    np.testing.assert_array_equal(got, h_in_keys)


def test_merge_sort_well_known_less():
    dtype = np.int32

    d_in_keys = cp.array([5, 2, 8, 1, 9, 3], dtype=dtype)
    d_out_keys = cp.empty_like(d_in_keys)

    parallel.merge_sort(
        d_in_keys, None, d_out_keys, None, parallel.OpKind.LESS, len(d_in_keys)
    )

    expected = np.array([1, 2, 3, 5, 8, 9])
    np.testing.assert_equal(d_out_keys.get(), expected)


def test_merge_sort_well_known_greater():
    dtype = np.int32

    d_in_keys = cp.array([5, 2, 8, 1, 9, 3], dtype=dtype)
    d_out_keys = cp.empty_like(d_in_keys)

    parallel.merge_sort(
        d_in_keys, None, d_out_keys, None, parallel.OpKind.GREATER, len(d_in_keys)
    )

    expected = np.array([9, 8, 5, 3, 2, 1])
    np.testing.assert_equal(d_out_keys.get(), expected)


def test_merge_sort_with_values_well_known():
    dtype = np.int32

    d_in_keys = cp.array([3, 1, 4, 2], dtype=dtype)
    d_in_values = cp.array([30, 10, 40, 20], dtype=dtype)
    d_out_keys = cp.empty_like(d_in_keys)
    d_out_values = cp.empty_like(d_in_values)

    parallel.merge_sort(
        d_in_keys,
        d_in_values,
        d_out_keys,
        d_out_values,
        parallel.OpKind.LESS,
        len(d_in_keys),
    )

    expected_keys = np.array([1, 2, 3, 4])
    expected_values = np.array([10, 20, 30, 40])
    np.testing.assert_equal(d_out_keys.get(), expected_keys)
    np.testing.assert_equal(d_out_values.get(), expected_values)
