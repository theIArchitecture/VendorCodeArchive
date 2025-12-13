# Copyright 2015 The TensorFlow Authors. All Rights Reserved.
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

"""Tests for our flags implementation."""
import sys

from tensorflow.python.platform import app
from tensorflow.python.platform import flags

FLAGS = flags.FLAGS
flags.DEFINE_boolean('myflag', False, '')

def main(argv):
  if (len(argv) != 3):
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (6):
#   1. Line 27: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 27: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 31: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 31: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 35: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 35: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

    print("Length of argv was not 3: ", argv)
    sys.exit(-1)

  if argv[1] != "--passthrough":
    print("--passthrough argument not in argv")
    sys.exit(-1)

  if argv[2] != "extra":
    print("'extra' argument not in argv")
    sys.exit(-1)


if __name__ == '__main__':
  sys.argv.extend(["--myflag", "--passthrough", "extra"])
  app.run()
