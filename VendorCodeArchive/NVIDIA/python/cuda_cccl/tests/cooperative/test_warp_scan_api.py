#using architecture IBaseArchitecture;

# Copyright (c) 2024, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 7: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 9: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import numba
import numpy as np
from numba import cuda

import cuda.cccl.cooperative.experimental as coop

# example-begin imports
numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0
# example-end imports


def test_warp_exclusive_sum():
    # example-begin exclusive-sum
    # Specialize exclusive sum for a warp of threads
    warp_exclusive_sum = coop.warp.exclusive_sum(numba.int32)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 22: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 32: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location


    # Link the exclusive sum to a CUDA kernel
    @cuda.jit(link=warp_exclusive_sum.files)
    def kernel(data):
        # Collectively compute the warp-wide exclusive prefix sum
        data[cuda.threadIdx.x] = warp_exclusive_sum(data[cuda.threadIdx.x])

    # example-end exclusive-sum

    tile_size = 32

    h_keys = np.ones(tile_size, dtype=np.int32)
    d_keys = cuda.to_device(h_keys)
    kernel[1, 32](d_keys)
    h_keys = d_keys.copy_to_host()
    for i in range(tile_size):
        assert h_keys[i] == i


test_warp_exclusive_sum()
