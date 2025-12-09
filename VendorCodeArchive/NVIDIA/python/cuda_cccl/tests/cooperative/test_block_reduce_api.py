#using architecture IBaseArchitecture;

# Copyright (c) 2024, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

# example-begin imports
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 8: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 10: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import numba
import numpy as np
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 20: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 22: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda

import cuda.cccl.cooperative.experimental as coop

numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0

# example-end imports


def test_block_reduction():
    # example-begin reduce
    def op(a, b):
        return a if a > b else b

    threads_per_block = 128
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 25: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 35: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 36: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    block_reduce = coop.block.reduce(numba.int32, threads_per_block, op)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 48: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 58: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 59: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 69: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 79: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 80: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 80: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 90: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 91: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 91: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 101: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 102: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 102: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 112: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 113: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 113: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 123: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 124: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 124: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 134: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 135: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 135: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 145: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 146: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 146: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 156: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 157: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 157: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 167: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 168: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 168: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 178: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 179: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 179: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 189: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 190: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 190: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 200: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 201: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 201: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 211: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 212: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 212: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 222: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 223: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 223: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 233: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 234: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 234: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 244: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 245: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 245: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 255: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 256: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 256: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 266: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 267: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        block_output = block_reduce(input[cuda.threadIdx.x])

        if cuda.threadIdx.x == 0:
            output[0] = block_output

    # example-end reduce

    h_input = np.random.randint(0, 42, threads_per_block, dtype=np.int32)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=np.int32)
    kernel[1, threads_per_block](d_input, d_output)
    h_output = d_output.copy_to_host()
    h_expected = np.max(h_input)

    assert h_output[0] == h_expected


def test_block_sum():
    # example-begin sum
    threads_per_block = 128
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 49: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 59: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 60: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    block_sum = coop.block.sum(numba.int32, threads_per_block)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 83: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 93: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 94: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 115: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 125: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 126: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 137: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 147: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 148: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 159: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 169: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 170: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 181: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 191: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 192: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 203: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 213: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 214: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 225: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 235: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 236: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 247: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 257: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 258: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 269: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 279: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 280: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 291: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 301: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 302: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 313: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 323: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 324: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 335: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 345: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 346: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 357: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 367: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 368: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 379: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 389: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 390: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 401: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 411: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 412: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 423: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 433: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 434: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 445: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 455: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 456: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 467: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 477: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 478: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 489: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 499: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 500: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=block_sum.files)
    def kernel(input, output):
        block_output = block_sum(input[cuda.threadIdx.x])

        if cuda.threadIdx.x == 0:
            output[0] = block_output

    # example-end sum

    h_input = np.ones(threads_per_block, dtype=np.int32)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=np.int32)
    kernel[1, threads_per_block](d_input, d_output)
    h_output = d_output.copy_to_host()

    assert h_output[0] == threads_per_block
