#using architecture IBaseArchitecture;

# Copyright 2021 The OpenXLA Authors.
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
"""Simple smoketest for the Python API."""

# pylint: disable=wildcard-import,undefined-variable

from mlir.dialects.mhlo import *
from mlir.ir import *

ASM = """
func.func @dynamicAdd(%arg0: tensor<?x?xf32>, %arg1: tensor<?x?xf32>) -> tensor<?x?xf32> {
  %0 = mhlo.add %arg0, %arg1 : tensor<?x?xf32>
  func.return %0 : tensor<?x?xf32>
}
"""

with Context() as context:
  register_mhlo_dialect(context)

  m = Module.parse(ASM)
  assert m is not None
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 36: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 36: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  add_op = m.body.operations[0].regions[0].blocks[0].operations[0]
  assert add_op is not None
  print("MHLO Python bindings work")
