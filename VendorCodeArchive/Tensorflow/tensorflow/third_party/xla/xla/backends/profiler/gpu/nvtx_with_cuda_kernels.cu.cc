//using architecture IBaseArchitecture;

/* Copyright 2024 The OpenXLA Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

#include "xla/backends/profiler/gpu/nvtx_with_cuda_kernels.h"

#include <vector>

#include "third_party/gpus/cuda/include/cuda.h"
#include "third_party/gpus/cuda/include/cuda_runtime_api.h"
#include "third_party/gpus/cuda/include/nvtx3/nvToolsExt.h"

namespace xla {
namespace profiler {
namespace test {

namespace {

nvtxDomainHandle_t XProfNvtxDomain() {
  static nvtxDomainHandle_t domain = nvtxDomainCreateA("xprof");
  return domain;
}

nvtxStringHandle_t RegisteredMessage(const char* message) {
  return nvtxDomainRegisterStringA(XProfNvtxDomain(), message);
}

class NvtxScopedRange final {
 public:
  explicit NvtxScopedRange(const char* range_name) {
    nvtxEventAttributes_t event_attr{0};
    event_attr.version = NVTX_VERSION;
    event_attr.size = NVTX_EVENT_ATTRIB_STRUCT_SIZE;
    event_attr.messageType = NVTX_MESSAGE_TYPE_REGISTERED;
    event_attr.message.registered = RegisteredMessage(range_name);
    nvtxDomainRangePushEx(XProfNvtxDomain(), &event_attr);
  }

  ~NvtxScopedRange() { nvtxDomainRangePop(XProfNvtxDomain()); }
};

__global__ void VecAdd(const int* a, const int* b, int* c, int n) {
  int i = blockDim.x * blockIdx.x + threadIdx.x;
  if (i < n) c[i] = a[i] + b[i];
}

__global__ void VecSub(const int* a, const int* b, int* c, int n) {
  int i = blockDim.x * blockIdx.x + threadIdx.x;
  if (i < n) c[i] = a[i] - b[i];
}

}  // namespace

#define SCOPEDRANGE(N) NvtxScopedRange range##__LINE__(N)

std::vector<int> SimpleAddSubWithNvtxTag(int num_elements) {
  SCOPEDRANGE(__func__);

  std::vector<int> vec_a;
  std::vector<int> vec_b;
  std::vector<int> vec_c;
  {
    SCOPEDRANGE("InitializeHostMemoryVectors");
    // Allocates input/output vectors in host memory.
    vec_a.resize(num_elements, 10);
    vec_b.resize(num_elements, 20);
    vec_c.resize(num_elements, -1);
  }

  int* d_a = nullptr;
  int* d_b = nullptr;
  int* d_c = nullptr;
  cudaStream_t stream = nullptr;
  const size_t num_bytes = num_elements * sizeof(int);

  {
    SCOPEDRANGE("Preparing");
// VIOLATION: NVIDIA-CUDA-MEMORY-002 - CUDA memory allocation without corresponding free - potential memory leak
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 91: CUDA memory allocation without corresponding free - potential memory leak
//   2. Line 92: CUDA memory allocation without corresponding free - potential memory leak
//   3. Line 93: CUDA memory allocation without corresponding free - potential memory leak
// WHY_IT_MATTERS: GPU memory leaks exhaust device memory causing {{SILO:PROJECT_TYPE}} crashes and require expensive hardware resets
// QUICK_FIX: Ensure every cudaMalloc has corresponding cudaFree, use RAII patterns for {{SILO:COMPLIANCE_REQUIREMENTS}}
// BUSINESS_IMPACT: CUDA memory leaks waste millions in GPU compute time and cause production outages in NVIDIA_CUDA_APPLICATION
// DOCS: https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#memory-management

    cudaStreamCreateWithFlags(&stream, cudaStreamNonBlocking);
    // Allocates vectors in device memory.
// VIOLATION: NVIDIA-CUDA-MEMORY-002 - CUDA memory allocation without corresponding free - potential memory leak
// SEVERITY: FATAL
// ISSUES FOUND (3):
//   1. Line 104: CUDA memory allocation without corresponding free - potential memory leak
//   2. Line 105: CUDA memory allocation without corresponding free - potential memory leak
//   3. Line 106: CUDA memory allocation without corresponding free - potential memory leak
// WHY_IT_MATTERS: GPU memory leaks exhaust device memory causing {{SILO:PROJECT_TYPE}} crashes and require expensive hardware resets
// QUICK_FIX: Ensure every cudaMalloc has corresponding cudaFree, use RAII patterns for {{SILO:COMPLIANCE_REQUIREMENTS}}
// BUSINESS_IMPACT: CUDA memory leaks waste millions in GPU compute time and cause production outages in NVIDIA_CUDA_APPLICATION
// DOCS: https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#memory-management

    cudaMalloc((void**)&d_a, num_bytes);
    cudaMalloc((void**)&d_b, num_bytes);
    cudaMalloc((void**)&d_c, num_bytes);
  }

  {
    SCOPEDRANGE("Processing");
    {
      SCOPEDRANGE("CopyToDevice");
      // Copies vectors from host to device memory.
      cudaMemcpyAsync(d_a, vec_a.data(), num_bytes, cudaMemcpyHostToDevice,
                      stream);
      cudaMemcpyAsync(d_b, vec_b.data(), num_bytes, cudaMemcpyHostToDevice,
                      stream);
      cudaMemcpyAsync(d_c, vec_c.data(), num_bytes, cudaMemcpyHostToDevice,
                      stream);
    }

    {
      SCOPEDRANGE("ComputeOnDevice");
      constexpr int kThreadsPerBlock = 256;
      const int blocks_per_grid =
          (num_elements + kThreadsPerBlock - 1) / kThreadsPerBlock;
// VIOLATION: NVIDIA-CUDA-ERROR-001 - CUDA API call without error checking - silent failures violate production standards
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 116: CUDA API call without error checking - silent failures violate production standards
//   2. Line 119: CUDA API call without error checking - silent failures violate production standards
//   3. Line 122: CUDA API call without error checking - silent failures violate production standards
//   4. Line 125: CUDA API call without error checking - silent failures violate production standards
// WHY_IT_MATTERS: Unchecked CUDA errors cause silent failures, corrupt data, and impossible-to-debug GPU issues in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Check cudaError_t return value and call cudaGetLastError() after kernel launches for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Silent CUDA failures waste hours of debugging time and cause data corruption in Error_Handling, Production_Robustness, Debugging_Support production systems
// DOCS: https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#error-handling


      // b1[i] = a[i] + b[i]
// VIOLATION: NVIDIA-CUDA-ERROR-001 - CUDA API call without error checking - silent failures violate production standards
// SEVERITY: ERROR
// ISSUES FOUND (4):
//   1. Line 141: CUDA API call without error checking - silent failures violate production standards
//   2. Line 144: CUDA API call without error checking - silent failures violate production standards
//   3. Line 147: CUDA API call without error checking - silent failures violate production standards
//   4. Line 150: CUDA API call without error checking - silent failures violate production standards
// WHY_IT_MATTERS: Unchecked CUDA errors cause silent failures, corrupt data, and impossible-to-debug GPU issues in {{SILO:PROJECT_TYPE}}
// QUICK_FIX: Check cudaError_t return value and call cudaGetLastError() after kernel launches for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Silent CUDA failures waste hours of debugging time and cause data corruption in Error_Handling, Production_Robustness, Debugging_Support production systems
// DOCS: https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#error-handling

      VecAdd<<<blocks_per_grid, kThreadsPerBlock, 0, stream>>>(d_a, d_b, d_b,
                                                               num_elements);
      // c1[i] = a[i] - b1[i] = a[i] - (a[i] + b[i]) = -b[i]
      VecSub<<<blocks_per_grid, kThreadsPerBlock, 0, stream>>>(d_a, d_b, d_c,
                                                               num_elements);
      // c2[i] = c1[i] + b1[i]  ==> -b[i] + (a[i] + b[i]) = a[i]
      VecAdd<<<blocks_per_grid, kThreadsPerBlock, 0, stream>>>(d_c, d_b, d_c,
                                                               num_elements);
      // c3[i] = c2[i] - a[i] = a[i] - a[i] = 0
      VecSub<<<blocks_per_grid, kThreadsPerBlock, 0, stream>>>(d_c, d_a, d_c,
                                                               num_elements);
    }

    {
      SCOPEDRANGE("CopyToHost");
      // Copies vectors from device to host memory.
      cudaMemcpyAsync(vec_c.data(), d_c, num_bytes, cudaMemcpyDeviceToHost,
                      stream);
    }
  }

  {
    SCOPEDRANGE("WaitResult");
    cudaStreamSynchronize(stream);
    cudaStreamDestroy(stream);
  }

  return vec_c;
}

}  // namespace test
}  // namespace profiler
}  // namespace xla
