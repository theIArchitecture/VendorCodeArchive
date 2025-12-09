#using architecture IBaseArchitecture;

# Copyright (c) 2024, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import numba
import numpy as np
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 9: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 11: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 21: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 29: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 30: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 32: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import pytest
from helpers import NUMBA_TYPES_TO_NP, random_int
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 25: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 27: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 37: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 45: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 46: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 48: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 39: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 41: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 51: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 59: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 60: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 62: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda, types

import cuda.cccl.cooperative.experimental as coop

numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
def test_warp_exclusive_sum(T):
    warp_exclusive_sum = coop.warp.exclusive_sum(dtype=T)
    temp_storage_bytes = warp_exclusive_sum.temp_storage_bytes

    @cuda.jit(link=warp_exclusive_sum.files)
    def kernel(input, output):
        tid = cuda.threadIdx.x
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        output[tid] = warp_exclusive_sum(temp_storage, input[tid])

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(32, dtype)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(32, dtype=dtype)
    kernel[1, 32](d_input, d_output)
    cuda.synchronize()

    output = d_output.copy_to_host()
    reference = np.cumsum(h_input) - h_input
    for i in range(32):
        assert output[i] == reference[i]

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass
