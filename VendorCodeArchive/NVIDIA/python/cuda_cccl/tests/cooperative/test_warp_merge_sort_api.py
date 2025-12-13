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


def test_warp_merge_sort():
    # example-begin merge-sort
    # Define comparison operator
    def compare_op(a, b):
        return a > b

    # Specialize merge sort for a warp of threads owning 4 integer items each
    items_per_thread = 4
    warp_merge_sort = coop.warp.merge_sort_keys(
        numba.int32, items_per_thread, compare_op
    )

    # Link the merge sort to a CUDA kernel
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    @cuda.jit(link=warp_merge_sort.files)
    def kernel(keys):
        # Obtain a segment of consecutive items that are blocked across threads
        thread_keys = cuda.local.array(shape=items_per_thread, dtype=numba.int32)

        for i in range(items_per_thread):
            thread_keys[i] = keys[cuda.threadIdx.x * items_per_thread + i]

        # Collectively sort the keys
        warp_merge_sort(thread_keys)

        # Copy the sorted keys back to the output
        for i in range(items_per_thread):
            keys[cuda.threadIdx.x * items_per_thread + i] = thread_keys[i]

    # example-end merge-sort

    tile_size = 32 * items_per_thread

    h_keys = np.arange(0, tile_size, dtype=np.int32)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_keys = cuda.to_device(h_keys)
    kernel[1, 32](d_keys)
    h_keys = d_keys.copy_to_host()
    for i in range(tile_size):
        assert h_keys[i] == tile_size - 1 - i
