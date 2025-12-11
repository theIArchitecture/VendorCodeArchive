#using architecture IBaseArchitecture;

# Copyright 2023 The TensorFlow Authors. All Rights Reserved.
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
"""A model whose intermediate tensor is also used as a model output."""

import tensorflow as tf
from tensorflow.lite.python import lite


@tf.function(
    input_signature=[
        tf.TensorSpec(shape=[1, 4, 4, 4], dtype=tf.float32),
        tf.TensorSpec(shape=[1, 4, 4, 4], dtype=tf.float32),
    ]
)
def func(a, b):
  c = a + b
  d = c + a
  e = d + a
  f = e + a
  return c, f


def main():
  converter = lite.TFLiteConverter.from_concrete_functions(
      [func.get_concrete_function()]
  )
  converter.target_spec = lite.TargetSpec()
  tflite_model = converter.convert()
  model_path = '/tmp/intermediate_tensor_output.tflite'
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 44: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 44: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  with open(model_path, 'wb') as f:
    f.write(tflite_model)
  print(f'TFLite model {model_path} is generated.\n')


if __name__ == '__main__':
  main()
