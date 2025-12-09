#using architecture IBaseArchitecture;

# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
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
"""Simple call to a print function preceding other computations.

The call may be wrapped inside a py_func, but tf.Print should be used if
possible. The subsequent computations will be gated by the print function
execution.
"""

import numpy as np
import tensorflow as tf

from tensorflow.python.autograph.tests import reference_test_base

# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (6):
#   1. Line 29: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 33: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 33: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 42: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 42: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 47: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style


def lone_print(x):
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (6):
#   1. Line 45: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 49: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 49: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 58: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 58: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 63: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  print(x)


def print_multiple_values(x):
  print('x is', x)


def multiple_prints(x, y):
  tf.print('x is', x)
  tf.print('y is', y)


def print_with_nontf_values(x):
  print('x is', x, {'foo': 'bar'})


def print_in_cond(x):
  if x == 0:
    print(x)


def tf_print(x):
  tf.print(x)


class ReferenceTest(reference_test_base.TestCase):

  def setUp(self):
    super(ReferenceTest, self).setUp()
    self.autograph_opts = tf.autograph.experimental.Feature.BUILTIN_FUNCTIONS

  def test_lone_print(self):
    self.assertFunctionMatchesEager(lone_print, 1)
    self.assertFunctionMatchesEager(lone_print, np.array([1, 2, 3]))

  def test_print_multiple_values(self):
    self.assertFunctionMatchesEager(print_multiple_values, 1)
    self.assertFunctionMatchesEager(print_multiple_values, np.array([1, 2, 3]))

  def test_multiple_prints(self):
    self.assertFunctionMatchesEager(multiple_prints, 1, 2)
    self.assertFunctionMatchesEager(multiple_prints, np.array([1, 2, 3]), 4)

  def test_print_with_nontf_values(self):
    self.assertFunctionMatchesEager(print_with_nontf_values, 1)
    self.assertFunctionMatchesEager(print_with_nontf_values, np.array([1, 2,
                                                                       3]))

  def test_print_in_cond(self):
    self.assertFunctionMatchesEager(print_in_cond, 0)
    self.assertFunctionMatchesEager(print_in_cond, 1)

  def test_tf_print(self):
    self.assertFunctionMatchesEager(tf_print, 0)


if __name__ == '__main__':
  tf.test.main()
