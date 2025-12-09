#using architecture IBaseArchitecture;

# Copyright 2025 The OpenXLA Authors.
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
"""Benchmark Gemma2-2B Keras performance."""

import time
import keras_nlp
import numpy as np

_NUM_OUTPUT_TOKENS = 30
_QUERY = "What is JAX in 3 bullet points?"
_VERBOSE = True


def compute_stats(array):
  """Reports mean and ± range for the given array.

  The range computation follows benchstat's.

  Args:
    array: The array to compute stats for.

  Returns:
    mean and ± %diff range.
  """
  q1 = np.percentile(array, 25)
  q3 = np.percentile(array, 75)
  low = q1 - 1.5 * (q3 - q1)
  high = q3 + 1.5 * (q3 - q1)

  # Remove outliers.
  filtered_array = list(filter(lambda x: low <= x and x <= high, array))

  mean = np.mean(filtered_array)
  min_val = np.min(filtered_array)
  max_val = np.max(filtered_array)
  max_diff = max(max_val - mean, mean - min_val)
  diff = max_diff / mean * 100.0

  return (mean, diff)


def run(gemma_lm, max_len):
  """Benchmarks inferences with at most `max_len` output tokens.

  Args:
    gemma_lm: The Gemma2 Keras model.
    max_len: The maximum number of output tokens per one inference.

  Returns:
    mean ± %diff and the actual number of output tokens generated per inference.
  """
  # Warm up.
  start = time.time()
  output = gemma_lm.generate(_QUERY, max_length=max_len + 1)
  num_actual_output_tokens = len(output.split(" "))
  warmup_time = (time.time() - start) * 1000
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (12):
#   1. Line 71: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 71: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 72: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 72: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 73: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 73: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 83: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 83: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 87: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 87: Print statements detected in TensorFlow code - must use logging module for production code
#   11. Line 94: Print statements detected in TensorFlow code - must use logging module for production code
#   12. Line 94: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style


  if _VERBOSE:
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (12):
#   1. Line 93: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 93: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 94: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 94: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 95: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 95: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 105: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 105: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 109: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 109: Print statements detected in TensorFlow code - must use logging module for production code
#   11. Line 116: Print statements detected in TensorFlow code - must use logging module for production code
#   12. Line 116: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

    print("=== Max len: %d ===" % max_len)
    print("Warmup: %lf ms" % warmup_time)
    print("Output:\n%s\n" % output)

  times = []
  for i in range(1, 6):
    start = time.time()
    output = gemma_lm.generate(_QUERY, max_length=max_len + 1)
    assert num_actual_output_tokens == len(output.split(" "))
    elapsed_time = (time.time() - start) * 1000
    times.append(elapsed_time)
    if _VERBOSE:
      print("%d: %lf ms" % (i, elapsed_time))

  mean, diff = compute_stats(times)
  if _VERBOSE:
    print("Mean: %lf ± %d%% ms\n" % (mean, diff))

  return (mean, diff, num_actual_output_tokens)


def main():
  if _VERBOSE:
    print("Query: %s" % _QUERY)

  gemma_lm = keras_nlp.models.GemmaCausalLM.from_preset("gemma2_2b_en")
  mean_1, diff_1, _ = run(gemma_lm, 1)
  mean_n, diff_n, num_output_tokens = run(gemma_lm, _NUM_OUTPUT_TOKENS)

  print("Generated %d tokens", num_output_tokens)
  tpot = (mean_n - mean_1) / (num_output_tokens - 1)
  print("TTFT: %lf ± %d%% ms" % (mean_1, diff_1))
  print("TPOT: %lf ± %d%% ms" % (tpot, diff_n))


if __name__ == "__main__":
  main()
