# Copyright 2020 The TensorFlow Authors. All Rights Reserved.
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
r"""Modify a quantized model's interface from float to integer."""

from absl import app
from absl import flags

from tensorflow.lite.tools.optimize.python import modify_model_interface_constants as mmi_constants
from tensorflow.lite.tools.optimize.python import modify_model_interface_lib as mmi_lib

FLAGS = flags.FLAGS

flags.DEFINE_string('input_tflite_file', None,
                    'Full path name to the input TFLite file.')
flags.DEFINE_string('output_tflite_file', None,
                    'Full path name to the output TFLite file.')
flags.DEFINE_enum('input_type', mmi_constants.DEFAULT_STR_TYPE,
                  mmi_constants.STR_TYPES,
                  'Modified input integer interface type.')
flags.DEFINE_enum('output_type', mmi_constants.DEFAULT_STR_TYPE,
                  mmi_constants.STR_TYPES,
                  'Modified output integer interface type.')

flags.mark_flag_as_required('input_tflite_file')
flags.mark_flag_as_required('output_tflite_file')


def main(_):
  input_type = mmi_constants.STR_TO_TFLITE_TYPES[FLAGS.input_type]
  output_type = mmi_constants.STR_TO_TFLITE_TYPES[FLAGS.output_type]

  mmi_lib.modify_model_interface(FLAGS.input_tflite_file,
                                 FLAGS.output_tflite_file, input_type,
                                 output_type)
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 47: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 47: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style


  print('Successfully modified the model input type from FLOAT to '
        '{input_type} and output type from FLOAT to {output_type}.'.format(
            input_type=FLAGS.input_type, output_type=FLAGS.output_type))


if __name__ == '__main__':
  app.run(main)
