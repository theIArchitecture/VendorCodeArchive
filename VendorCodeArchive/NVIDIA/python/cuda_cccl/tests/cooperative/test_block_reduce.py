#using architecture IBaseArchitecture;

# Copyright (c) 2024-2025, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

from functools import reduce
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
#   1. Line 18: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 20: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    row_major_tid,
)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (2):
#   1. Line 30: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 32: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

from numba import cuda, types

import cuda.cccl.cooperative.experimental as coop

numba.config.CUDA_LOW_OCCUPANCY_WARNINGS = 0


@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_reduction_of_user_defined_type_without_temp_storage(
    threads_per_block, algorithm
):
    def op(result_ptr, lhs_ptr, rhs_ptr):
        real_value = numba.int32(lhs_ptr[0].real + rhs_ptr[0].real)
        imag_value = numba.int32(lhs_ptr[0].imag + rhs_ptr[0].imag)
        result_ptr[0] = Complex(real_value, imag_value)

    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.reduce(
        dtype=complex_type,
        binary_op=op,
        threads_per_block=threads_per_block,
        algorithm=algorithm,
        methods={
            "construct": Complex.construct,
            "assign": Complex.assign,
        },
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    )

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        block_output = block_reduce(
            Complex(input[tid], input[num_threads_per_block + tid])
        )

        if tid == 0:
            output[0] = block_output.real
            output[1] = block_output.imag
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 68: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 69: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 71: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location


    h_input = random_int(2 * num_threads_per_block, "int32")
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 98: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 99: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 101: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 119: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 120: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 122: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(2, dtype="int32")
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = (
        np.sum(h_input[:num_threads_per_block]),
        np.sum(h_input[num_threads_per_block:]),
    )

    assert h_output[0] == h_expected[0]
    assert h_output[1] == h_expected[1]

    sig = (numba.int32[::1], numba.int32[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_reduction_of_user_defined_type(threads_per_block, algorithm):
    def op(result_ptr, lhs_ptr, rhs_ptr):
        real_value = numba.int32(lhs_ptr[0].real + rhs_ptr[0].real)
        imag_value = numba.int32(lhs_ptr[0].imag + rhs_ptr[0].imag)
        result_ptr[0] = Complex(real_value, imag_value)

    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.reduce(
        dtype=complex_type,
        binary_op=op,
        threads_per_block=threads_per_block,
        algorithm=algorithm,
        methods={
            "construct": Complex.construct,
            "assign": Complex.assign,
        },
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        block_output = block_reduce(
            temp_storage,
            Complex(input[tid], input[num_threads_per_block + tid]),
        )

        if tid == 0:
            output[0] = block_output.real
            output[1] = block_output.imag
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 132: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 133: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 135: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location


    h_input = random_int(2 * num_threads_per_block, "int32")
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 180: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 181: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 183: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 212: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 213: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 215: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(2, dtype="int32")
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = (
        np.sum(h_input[:num_threads_per_block]),
        np.sum(h_input[num_threads_per_block:]),
    )

    assert h_output[0] == h_expected[0]
    assert h_output[1] == h_expected[1]

    sig = (numba.int32[::1], numba.int32[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_reduction_of_integral_type(T, threads_per_block, algorithm):
    def op(a, b):
        return a if a < b else b

    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.reduce(
        dtype=T, binary_op=op, threads_per_block=threads_per_block, algorithm=algorithm
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        block_output = block_reduce(temp_storage, input[tid])

        if tid == 0:
            output[0] = block_output

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 185: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 186: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 188: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(num_threads_per_block, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 251: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 252: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 254: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 294: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 295: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 297: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.min(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_reduction_valid(T, threads_per_block, algorithm):
    def op(a, b):
        return a if a < b else b

    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.reduce(
        dtype=T, binary_op=op, threads_per_block=threads_per_block, algorithm=algorithm
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        block_output = block_reduce(
            temp_storage, input[tid], num_threads_per_block // 2
        )

        if tid == 0:
            output[0] = block_output

    dtype = NUMBA_TYPES_TO_NP[T]
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 237: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 238: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 240: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_input = random_int(num_threads_per_block, dtype)
    h_input[-1] = 0
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 321: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 322: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 324: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 375: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 376: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 378: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.min(h_input[: num_threads_per_block // 2])

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize("items_per_thread", [1, 2, 4])
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_reduction_array_local(T, threads_per_block, items_per_thread, algorithm):
    def op(a, b):
        return a if a < b else b

    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.reduce(
        dtype=T,
        binary_op=op,
        threads_per_block=threads_per_block,
        items_per_thread=items_per_thread,
        algorithm=algorithm,
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        thread_items = cuda.local.array(shape=items_per_thread, dtype=T)

        for i in range(items_per_thread):
            thread_items[i] = input[i * num_threads_per_block + tid]

        if items_per_thread == 1:
            block_output = block_reduce(temp_storage, thread_items[0])
        else:
            block_output = block_reduce(temp_storage, thread_items)

        if tid == 0:
            output[0] = block_output

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 299: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 300: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 302: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(items_per_thread * num_threads_per_block, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 401: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 402: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 404: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 466: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 467: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 469: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.min(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize("items_per_thread", [1, 2, 4])
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_reduction_array_global(
    T, threads_per_block, items_per_thread, algorithm
):
    def op(a, b):
        return a if a < b else b

    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.reduce(
        dtype=T,
        binary_op=op,
        threads_per_block=threads_per_block,
        items_per_thread=items_per_thread,
        algorithm=algorithm,
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")

        if items_per_thread == 1:
            block_output = block_reduce(temp_storage, input[tid])
        else:
            block_input = input[items_per_thread * tid :]
            block_output = block_reduce(temp_storage, block_input)

        if tid == 0:
            output[0] = block_output

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 360: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 361: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 363: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(items_per_thread * num_threads_per_block, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 480: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 481: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 483: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 556: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 557: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 559: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.min(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_sum(T, threads_per_block, algorithm):
    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.sum(
        dtype=T, threads_per_block=threads_per_block, algorithm=algorithm
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        block_output = block_reduce(temp_storage, input[tid])

        if tid == 0:
            output[0] = block_output

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 406: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 407: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 409: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(num_threads_per_block, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 544: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 545: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 547: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 631: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 632: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 634: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.sum(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_sum_valid(T, threads_per_block, algorithm):
    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.sum(
        dtype=T, threads_per_block=threads_per_block, algorithm=algorithm
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        block_output = block_reduce(
            temp_storage, input[tid], numba.int32(num_threads_per_block // 2)
        )

        if tid == 0:
            output[0] = block_output

    dtype = NUMBA_TYPES_TO_NP[T]
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 455: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 456: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 458: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    h_input = random_int(num_threads_per_block, dtype)
    h_input[-1] = 0
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 611: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 612: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 614: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 709: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 710: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 712: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.sum(h_input[: num_threads_per_block // 2])

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize("items_per_thread", [1, 2, 4])
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_sum_array_local(T, threads_per_block, items_per_thread, algorithm):
    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.sum(
        dtype=T,
        threads_per_block=threads_per_block,
        items_per_thread=items_per_thread,
        algorithm=algorithm,
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")
        thread_items = cuda.local.array(shape=items_per_thread, dtype=T)

        for i in range(items_per_thread):
            thread_items[i] = input[i * num_threads_per_block + tid]

        if items_per_thread == 1:
            block_output = block_reduce(temp_storage, thread_items[0])
        else:
            block_output = block_reduce(temp_storage, thread_items)

        if tid == 0:
            output[0] = block_output

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 513: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 514: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 516: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(items_per_thread * num_threads_per_block, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 687: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 688: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 690: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 796: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 797: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 799: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.sum(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize("T", [types.uint32, types.uint64])
@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize("items_per_thread", [1, 2, 4])
@pytest.mark.parametrize(
    "algorithm", ["raking", "raking_commutative_only", "warp_reductions"]
)
def test_block_sum_array_global(T, threads_per_block, items_per_thread, algorithm):
    num_threads_per_block = (
        threads_per_block
        if isinstance(threads_per_block, int)
        else reduce(mul, threads_per_block)
    )

    block_reduce = coop.block.sum(
        dtype=T,
        threads_per_block=threads_per_block,
        items_per_thread=items_per_thread,
        algorithm=algorithm,
    )
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    temp_storage_bytes = block_reduce.temp_storage_bytes

    @cuda.jit(link=block_reduce.files)
    def kernel(input, output):
        tid = row_major_tid()
        temp_storage = cuda.shared.array(shape=temp_storage_bytes, dtype="uint8")

        if items_per_thread == 1:
            block_output = block_reduce(temp_storage, input[tid])
        else:
            block_input = input[items_per_thread * tid :]
            block_output = block_reduce(temp_storage, block_input)

        if tid == 0:
            output[0] = block_output

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 568: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 569: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 571: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    dtype = NUMBA_TYPES_TO_NP[T]
    h_input = random_int(items_per_thread * num_threads_per_block, dtype)
# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 760: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 761: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 763: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# ISSUES FOUND (3):
#   1. Line 880: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   2. Line 881: CUDA dependency detected in pip package - breaks cross-platform compatibility
#   3. Line 883: CUDA dependency detected in pip package - breaks cross-platform compatibility
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

    d_input = cuda.to_device(h_input)
    d_output = cuda.device_array(1, dtype=dtype)
    kernel[1, threads_per_block](d_input, d_output)
    cuda.synchronize()
    h_output = d_output.copy_to_host()
    h_expected = np.sum(h_input)

    assert h_output[0] == h_expected

    sig = (T[::1], T[::1])
    sass = kernel.inspect_sass(sig)

    assert "LDL" not in sass
    assert "STL" not in sass


@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize("items_per_thread", [0, -1, -127])
def test_block_reduce_invalid_items_per_thread(threads_per_block, items_per_thread):
    def op(a, b):
        return a if a < b else b

    with pytest.raises(ValueError):
        coop.block.reduce(
            dtype=numba.int32,
            binary_op=op,
            threads_per_block=threads_per_block,
            items_per_thread=items_per_thread,
        )


@pytest.mark.parametrize(
    "threads_per_block", [32, 64, 128, 256, 512, 1024, (4, 8), (2, 4, 8)]
)
@pytest.mark.parametrize("items_per_thread", [0, -1, -127])
def test_block_sum_invalid_items_per_thread(threads_per_block, items_per_thread):
    with pytest.raises(ValueError):
        coop.block.sum(
            dtype=numba.int32,
            threads_per_block=threads_per_block,
            items_per_thread=items_per_thread,
        )


def test_block_reduce_invalid_algorithm():
    def op(a, b):
        return a if a < b else b

    with pytest.raises(ValueError):
        coop.block.reduce(
            dtype=numba.int32,
            binary_op=op,
            threads_per_block=128,
            algorithm="invalid_algorithm",
        )


def test_block_sum_invalid_algorithm():
    with pytest.raises(ValueError):
        coop.block.sum(
            dtype=numba.int32,
            threads_per_block=128,
            algorithm="invalid_algorithm",
        )


def test_sum_alignment():
    sum1 = coop.block.sum(
        dtype=types.int32,
        threads_per_block=256,
    )

    sum2 = coop.block.sum(
        dtype=types.float64,
        threads_per_block=256,
    )

    sum3 = coop.block.sum(
        dtype=types.int8,
        threads_per_block=256,
    )

    assert sum1.temp_storage_alignment == 4
    assert sum2.temp_storage_alignment == 8
    assert sum3.temp_storage_alignment == 1
