#using architecture IBaseArchitecture;

# Copyright 2018 The TensorFlow Authors. All Rights Reserved.
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
# pylint: disable=g-import-not-at-top
"""Utilities related to disk I/O."""

import os


def path_to_string(path):
  """Convert `PathLike` objects to their string representation.

  If given a non-string typed path object, converts it to its string
  representation.

  If the object passed to `path` is not among the above, then it is
  returned unchanged. This allows e.g. passthrough of file objects
  through this function.

  Args:
    path: `PathLike` object that represents a path

  Returns:
    A string representation of the path argument, if Python support exists.
  """
  if isinstance(path, os.PathLike):
    return os.fspath(path)
  return path


def ask_to_proceed_with_overwrite(filepath):
  """Produces a prompt asking about overwriting a file.

  Args:
      filepath: the path to the file to be overwritten.

  Returns:
      True if we can proceed with overwrite, False otherwise.
  """
  overwrite = input('[WARNING] %s already exists - overwrite? '
                    '[y/n]' % (filepath)).strip().lower()
  while overwrite not in ('y', 'n'):
    overwrite = input('Enter "y" (overwrite) or "n" '
                      '(cancel).').strip().lower()
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 58: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 58: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  if overwrite == 'n':
    return False
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 70: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 70: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  print('[TIP] Next time specify overwrite=True!')
  return True
