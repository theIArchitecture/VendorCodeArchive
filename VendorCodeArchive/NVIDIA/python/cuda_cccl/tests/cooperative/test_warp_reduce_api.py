# Copyright (c) 2024, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import numba
import numpy as np
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 7: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 9: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda

import cuda.cccl.cooperative.experimental as coop

# example-begin imports
numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0
# example-end imports


def test_warp_reduction():
    def op(a, b):
        return a if a > b else b

    # example-begin reduce
    warp_reduce = coop.warp.reduce(numba.int32, op)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 23: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 33: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 34: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=warp_reduce.files)
    def kernel(input, output):
        warp_output = warp_reduce(input[cuda.threadIdx.x])

        if cuda.threadIdx.x == 0:
            output[0] = warp_output

    # example-end reduce

    h_input = np.random.randint(0, 42, 32, dtype=np.int32)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=np.int32)
    kernel[1, 32](d_input, d_output)
    h_output = d_output.copy_to_host()
    h_expected = np.max(h_input)

    assert h_output[0] == h_expected


def test_warp_sum():
    # example-begin sum
    warp_sum = coop.warp.sum(numba.int32)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 46: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 56: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 57: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=warp_sum.files)
    def kernel(input, output):
        warp_output = warp_sum(input[cuda.threadIdx.x])

        if cuda.threadIdx.x == 0:
            output[0] = warp_output

    # example-end sum

    h_input = np.ones(32, dtype=np.int32)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=np.int32)
    kernel[1, 32](d_input, d_output)
    h_output = d_output.copy_to_host()

    assert h_output[0] == 32
