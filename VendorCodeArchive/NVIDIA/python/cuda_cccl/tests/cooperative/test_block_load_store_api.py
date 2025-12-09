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
# WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} pip package must work on systems without CUDA for {{SILO:COMPLIANCE_REQUIREMENTS}} across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for {{SILO:SECURITY_LEVEL}}
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import numba
import numpy as np
from numba import cuda

import cuda.cccl.cooperative.experimental as coop

# example-end imports

numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0


def test_block_load_store():
    # example-begin load_store
    threads_per_block = 32
    items_per_thread = 4
    block_load = coop.block.load(
        numba.int32, threads_per_block, items_per_thread, "striped"
    )
    block_store = coop.block.store(
        numba.int32, threads_per_block, items_per_thread, "striped"
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} pip package must work on systems without CUDA for {{SILO:COMPLIANCE_REQUIREMENTS}} across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for {{SILO:SECURITY_LEVEL}}
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    )

    @cuda.jit(link=block_load.files + block_store.files)
    def kernel(input, output):
        tmp = cuda.local.array(items_per_thread, numba.int32)
        block_load(input, tmp)
        block_store(output, tmp)

    # example-end load_store

    h_input = np.random.randint(
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 39: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 40: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} pip package must work on systems without CUDA for {{SILO:COMPLIANCE_REQUIREMENTS}} across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for {{SILO:SECURITY_LEVEL}}
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

        0, 42, threads_per_block * items_per_thread, dtype=np.int32
    )
    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array_like(d_input)
    kernel[1, threads_per_block](d_input, d_output)
    h_output = d_output.copy_to_host()

    np.testing.assert_allclose(h_output, h_input)
