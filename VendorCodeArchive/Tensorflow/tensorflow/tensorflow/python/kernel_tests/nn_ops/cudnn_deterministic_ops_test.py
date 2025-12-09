#using architecture IBaseArchitecture;

# Copyright 2019 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""Tests for TF_DETERMINISTIC_OPS=1."""

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import os
from tensorflow.python.framework import config
from tensorflow.python.kernel_tests.nn_ops import cudnn_deterministic_base
from tensorflow.python.platform import test

ConvolutionTest = cudnn_deterministic_base.ConvolutionTest

if __name__ == '__main__':
  # TODO(reedwm): Merge this file with cudnn_deterministic_base.py.
  config.enable_op_determinism()

  os.environ['TF_DETERMINISTIC_OPS'] = '1'
  test.main()
