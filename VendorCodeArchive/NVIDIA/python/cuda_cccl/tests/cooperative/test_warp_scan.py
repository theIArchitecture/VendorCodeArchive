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

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 53: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 55: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 65: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 73: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 74: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 76: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 67: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 69: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 79: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 87: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 88: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 90: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 81: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 83: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 93: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 101: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 102: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 104: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 95: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 97: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 107: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 115: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 116: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 118: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 109: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 111: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 121: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 129: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 130: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 132: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 123: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 125: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 135: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 143: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 144: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 146: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 137: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 139: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 149: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 157: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 158: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 160: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 151: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 153: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 163: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 171: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 172: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 174: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 165: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 167: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 177: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 185: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 186: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 188: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 179: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 181: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 191: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 199: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 200: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 202: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 193: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 195: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 205: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 213: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 214: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 216: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 207: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 209: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 219: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 227: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 228: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 230: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 221: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 223: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 233: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 241: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 242: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 244: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 235: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 237: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 247: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 255: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 256: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 258: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 249: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 251: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 261: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 269: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 270: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 272: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 263: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 265: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 275: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 283: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 284: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 286: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 277: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 279: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 289: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 297: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 298: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 300: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 291: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 293: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 303: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 311: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 312: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 314: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 305: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 307: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 317: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 325: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 326: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 328: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 319: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 321: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 331: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 339: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 340: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 342: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (6):
#   1. Line 333: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 335: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 345: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   4. Line 353: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   5. Line 354: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   6. Line 356: CUDA dependency detected in pip package - breaks cross-platform compatibility
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
