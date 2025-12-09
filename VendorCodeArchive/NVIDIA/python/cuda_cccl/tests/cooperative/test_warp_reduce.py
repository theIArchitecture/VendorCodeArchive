#using architecture IBaseArchitecture;

# Copyright (c) 2024, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import numba
import numpy as np
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 9: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 11: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import pytest
from helpers import NUMBA_TYPES_TO_NP, random_int
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 21: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 23: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda, types

import cuda.cccl.cooperative.experimental as coop

numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
def test_warp_reduction_of_integral_type(T):
    def op(a, b):
        return a if a < b else b

    warp_reduce = coop.warp.reduce(T, op)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 24: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 34: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 35: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 37: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = warp_reduce.temp_storage_bytes

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 48: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 58: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 59: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 61: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 70: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 80: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 81: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 83: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 82: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 92: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 93: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 95: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 94: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 104: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 105: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 107: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 106: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 116: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 117: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 119: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 118: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 128: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 129: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 131: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 130: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 140: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 141: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 143: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 142: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 152: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 153: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 155: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 154: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 164: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 165: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 167: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 166: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 176: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 177: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 179: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 178: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 188: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 189: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 191: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 190: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 200: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 201: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 203: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 202: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 212: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 213: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 215: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 214: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 224: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 225: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 227: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 226: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 236: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 237: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 239: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 238: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 248: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 249: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 251: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 250: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 260: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 261: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 263: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 262: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 272: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 273: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 275: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 274: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 284: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 285: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 287: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 286: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 296: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 297: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 299: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 298: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 308: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 309: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 311: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 310: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 320: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 321: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 323: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 322: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 332: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 333: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 335: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 334: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 344: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 345: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 347: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 346: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 356: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 357: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 359: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=warp_reduce.files)
    def kernel(input, output):
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        warp_output = warp_reduce(temp_storage, input[cuda.threadIdx.x])

        if cuda.threadIdx.x == 0:
            output[0] = warp_output

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(32, dtype)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, 32](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.min(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
def test_warp_sum(T):
    warp_reduce = coop.warp.sum(T)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 55: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 65: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 66: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 68: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = warp_reduce.temp_storage_bytes

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 91: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 101: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 102: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 104: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 125: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 135: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 136: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 138: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 149: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 159: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 160: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 162: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 173: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 183: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 184: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 186: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 197: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 207: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 208: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 210: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 221: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 231: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 232: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 234: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 245: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 255: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 256: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 258: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 269: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 279: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 280: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 282: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 293: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 303: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 304: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 306: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 317: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 327: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 328: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 330: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 341: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 351: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 352: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 354: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 365: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 375: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 376: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 378: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 389: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 399: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 400: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 402: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 413: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 423: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 424: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 426: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 437: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 447: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 448: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 450: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 461: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 471: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 472: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 474: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 485: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 495: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 496: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 498: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 509: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 519: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 520: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 522: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 533: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 543: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 544: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 546: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 557: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 567: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 568: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 570: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 581: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 591: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 592: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 594: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 605: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 615: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 616: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 618: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 629: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 639: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 640: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 642: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 653: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 663: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 664: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 666: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (4):
#   1. Line 677: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 687: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 688: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 690: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=warp_reduce.files)
    def kernel(input, output):
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        warp_output = warp_reduce(temp_storage, input[cuda.threadIdx.x])

        if cuda.threadIdx.x == 0:
            output[0] = warp_output

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(32, dtype)
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, 32](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.sum(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass
