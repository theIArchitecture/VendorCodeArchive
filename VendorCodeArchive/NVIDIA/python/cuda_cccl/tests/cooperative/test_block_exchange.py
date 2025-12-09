#using architecture IBaseArchitecture;

# Copyright (c) 2025, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

"""
test_block_exchange.py

This file contains unit tests for cuda.cooperative.block_exchange.
"""

from functools import partial, reduce
from operator import mul

import numba
import numpy as np
import pytest
from helpers import (
    NUMBA_TYPES_TO_NP,
    Complex,
    complex_type,
    random_int,
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 24: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 26: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    row_major_tid,
)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 36: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 38: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda, types

import cuda.cccl.cooperative.experimental as cudax

numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0

striped_to_blocked = partial(
    cudax.block.exchange,
    block_exchange_type=cudax.block.BlockExchangeType.StripedToBlocked,
)


@pytest.mark.parametrize("T", [types.int32, types.float64])
@pytest.mark.parametrize("threads_per_block", [32, (4, 16), (4, 8, 8)])
@pytest.mark.parametrize("items_per_thread", [1, 4])
@pytest.mark.parametrize("warp_time_slicing", [False, True])
@pytest.mark.parametrize("separate_input_output_arrays", [False, True])
def test_striped_to_blocked(
    T,
    threads_per_block,
    items_per_thread,
    warp_time_slicing,
    separate_input_output_arrays,
):
    """
    Tests the striped_to_blocked block-wide data exchange.
    """
    T_np = NUMBA_TYPES_TO_NP[T]
    num_threads = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_exchange_op = striped_to_blocked(
        dtype=T,
        threads_per_block=threads_per_block,
        items_per_thread=items_per_thread,
        warp_time_slicing=warp_time_slicing,
    )
    temp_storage_bytes = block_exchange_op.temp_storage_bytes

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    if separate_input_output_arrays:

        @cuda.jit(link=block_exchange_op.files)
        def kernel(input_arr, output_arr):
            tid = row_major_tid()
            temp_storage = cuda.shared.array(
                shape=temp_storage_bytes,
                dtype=numba.uint8,
            )

            thread_data_in = cuda.local.array(items_per_thread, dtype=T)
            thread_data_out = cuda.local.array(items_per_thread, dtype=T)

            # Load input data (striped)
            for i in range(items_per_thread):
                idx = tid + i * num_threads
                if idx < input_arr.shape[0]:
                    thread_data_in[i] = input_arr[idx]

            block_exchange_op(temp_storage, thread_data_in, thread_data_out)

            # Store output data (blocked)
            for i in range(items_per_thread):
                idx = tid * items_per_thread + i
                if idx < output_arr.shape[0]:
                    output_arr[idx] = thread_data_out[i]

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    else:

        @cuda.jit(link=block_exchange_op.files)
        def kernel(input_arr, output_arr):
            tid = row_major_tid()
            temp_storage = cuda.shared.array(
                shape=temp_storage_bytes,
                dtype=numba.uint8,
            )

            items = cuda.local.array(items_per_thread, dtype=T)

            # Load input data (striped)
            for i in range(items_per_thread):
                idx = tid + i * num_threads
                if idx < input_arr.shape[0]:
                    items[i] = input_arr[idx]

            block_exchange_op(temp_storage, items)

            # Store output data (blocked)
            for i in range(items_per_thread):
                idx = tid * items_per_thread + i
                if idx < output_arr.shape[0]:
                    output_arr[idx] = items[i]

    total_items = num_threads * items_per_thread
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 122: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 123: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 126: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_input = random_int(total_items, T_np)

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 159: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 160: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 163: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 180: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 181: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 184: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 191: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 192: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 195: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 202: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 203: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 206: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 213: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 214: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 217: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 224: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 225: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 228: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 235: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 236: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 239: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 246: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 247: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 250: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 257: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 258: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 261: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 268: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 269: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 272: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 279: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 280: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 283: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 290: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 291: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 294: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 301: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 302: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 305: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 312: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 313: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 316: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 323: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 324: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 327: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 334: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 335: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 338: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 345: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 346: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 349: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 356: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 357: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 360: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(total_items, dtype=T_np)

    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()

    output = d_output.copy_to_host()

    # Calculate reference result
    h_ref = np.zeros(total_items, dtype=T_np)
    # Iterate over each position in the destination (blocked) array
    for blocked_idx in range(total_items):
        # Determine which source thread (s_tid) and which item within
        # that thread's stripe (s_item_idx_in_stripe) contributed to
        # h_ref[blocked_idx].
        #
        # This is based on the CUB definition for StripedToBlocked:
        #   Output element at global_blocked_idx comes from an input
        #   element defined by:
        #       source_thread_idx = global_blocked_idx % num_threads
        #       source_item_in_stripe_idx = global_blocked_idx // num_threads

        s_tid = blocked_idx % num_threads
        s_item_idx_in_stripe = blocked_idx // num_threads

        # Convert these (s_tid, s_item_idx_in_stripe) 2D-like indices
        # to a 1D index into the h_input array (which is striped).
        # In a striped layout, element (thread_k, item_j) is at
        # k + j * num_threads.
        src_striped_1d_idx = s_tid + s_item_idx_in_stripe * num_threads

        h_ref[blocked_idx] = h_input[src_striped_1d_idx]

    # We just transformed data; we didn't do any math that may have introduced
    # floating point errors, so we can use np.testing.assert_array_equal for
    # both float and int types.
    np.testing.assert_array_equal(output, h_ref)

    sig = (T[::1], T[::1])  # Signature for 1D arrays of type T
    sass = kernel.inspect_sass(sig)
    assert "LDL" not in sass  # Check for global loads
    assert "STL" not in sass  # Check for global stores


@pytest.mark.parametrize("threads_per_block", [32, (4, 16), (4, 8, 8)])
@pytest.mark.parametrize("items_per_thread", [1])
@pytest.mark.parametrize("warp_time_slicing", [False, True])
def test_striped_to_blocked_user_defined_type(
    threads_per_block, items_per_thread, warp_time_slicing
):
    """
    Tests the striped_to_blocked block-wide data exchange for Complex
    user-defined type.

    N.B. User-defined types are currently restricted to items_per_thread == 1.
         However, the test has been written to handle multiple items per thread
         for if and when this support is added.
    """
    T_complex = complex_type
    T_complex_np_component = np.int32

    num_threads = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_exchange_op = striped_to_blocked(
        dtype=T_complex,
        threads_per_block=threads_per_block,
        items_per_thread=items_per_thread,
        warp_time_slicing=warp_time_slicing,
        methods={"construct": Complex.construct, "assign": Complex.assign},
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_exchange_op.temp_storage_bytes

    @cuda.jit(link=block_exchange_op.files)
    def kernel(input_arr, output_arr):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype=numba.uint8)

        thread_data_in = cuda.local.array(items_per_thread, dtype=T_complex)
        thread_data_out = cuda.local.array(items_per_thread, dtype=T_complex)

        total_complex_items_in_block = num_threads * items_per_thread

        for i in range(items_per_thread):
            striped_idx_of_complex_item = tid + i * num_threads
            if striped_idx_of_complex_item < total_complex_items_in_block:
                real_val = input_arr[striped_idx_of_complex_item]
                imag_val = input_arr[
                    striped_idx_of_complex_item + total_complex_items_in_block
                ]
                thread_data_in[i] = Complex(real_val, imag_val)

        block_exchange_op(temp_storage, thread_data_in, thread_data_out)

        for i in range(items_per_thread):
            blocked_idx_of_complex_item = tid * items_per_thread + i
            if blocked_idx_of_complex_item < total_complex_items_in_block:
                output_arr[blocked_idx_of_complex_item] = thread_data_out[i].real
                output_arr[
                    blocked_idx_of_complex_item + total_complex_items_in_block
                ] = thread_data_out[i].imag

    total_complex_items = num_threads * items_per_thread
    h_input_real = random_int(total_complex_items, T_complex_np_component)
    h_input_imag = random_int(total_complex_items, T_complex_np_component)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 232: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 233: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 236: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_input_combined = np.concatenate((h_input_real, h_input_imag))

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 287: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 288: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 291: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 319: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 320: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 323: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 341: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 342: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 345: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 363: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 364: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 367: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 385: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 386: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 389: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 407: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 408: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 411: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 429: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 430: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 433: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 451: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 452: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 455: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 473: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 474: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 477: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 495: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 496: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 499: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 517: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 518: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 521: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 539: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 540: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 543: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 561: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 562: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 565: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 583: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 584: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 587: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 605: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 606: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 609: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 627: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 628: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 631: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 649: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 650: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 653: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 671: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 672: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 675: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input_combined)
    d_output = cuda.device_array(2 * total_complex_items, dtype=T_complex_np_component)

    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()

    output_combined = d_output.copy_to_host()
    output_real = output_combined[:total_complex_items]
    output_imag = output_combined[total_complex_items:]

    h_input_complex_objects = np.array(
        [Complex(r, i) for r, i in zip(h_input_real, h_input_imag)], dtype=object
    )
    h_ref_complex_objects = np.empty(total_complex_items, dtype=object)

    # The striped_to_blocked transformation:
    for blocked_complex_idx in range(total_complex_items):
        s_tid = blocked_complex_idx % num_threads
        s_item_idx_in_stripe = blocked_complex_idx // num_threads

        # Convert to 1D index in the striped h_input_complex_objects array
        src_striped_1d_complex_idx = s_tid + s_item_idx_in_stripe * num_threads
        h_ref_complex_objects[blocked_complex_idx] = h_input_complex_objects[
            src_striped_1d_complex_idx
        ]

    # Split the reference Complex objects back into real and imaginary parts
    h_ref_real = np.array(
        [c.real for c in h_ref_complex_objects], dtype=T_complex_np_component
    )
    h_ref_imag = np.array(
        [c.imag for c in h_ref_complex_objects], dtype=T_complex_np_component
    )

    np.testing.assert_array_equal(output_real, h_ref_real)
    np.testing.assert_array_equal(output_imag, h_ref_imag)

    # Signature for SASS inspection (input and output arrays are of int32)
    sig = (
        numba.types.int32[::1],
        numba.types.int32[::1],
    )
    sass = kernel.inspect_sass(sig)
    assert "LDL" not in sass
    assert "STL" not in sass
