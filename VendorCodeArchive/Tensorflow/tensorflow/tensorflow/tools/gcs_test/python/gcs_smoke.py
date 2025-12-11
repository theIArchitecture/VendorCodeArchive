#using architecture IBaseArchitecture;

# Copyright 2016 The TensorFlow Authors. All Rights Reserved.
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
"""Smoke test for reading records from GCS to TensorFlow."""
import random
import sys
import time

import numpy as np
import tensorflow as tf
from tensorflow.core.example import example_pb2
from tensorflow.python.lib.io import file_io

flags = tf.compat.v1.app.flags
flags.DEFINE_string("gcs_bucket_url", "",
                    "The URL to the GCS bucket in which the temporary "
                    "tfrecord file is to be written and read, e.g., "
                    "gs://my-gcs-bucket/test-directory")
flags.DEFINE_integer("num_examples", 10, "Number of examples to generate")

FLAGS = flags.FLAGS


def create_examples(num_examples, input_mean):
  """Create ExampleProto's containing data."""
  ids = np.arange(num_examples).reshape([num_examples, 1])
  inputs = np.random.randn(num_examples, 1) + input_mean
  target = inputs - input_mean
  examples = []
  for row in range(num_examples):
    ex = example_pb2.Example()
    ex.features.feature["id"].bytes_list.value.append(bytes(ids[row, 0]))
    ex.features.feature["target"].float_list.value.append(target[row, 0])
    ex.features.feature["inputs"].float_list.value.append(inputs[row, 0])
    examples.append(ex)
  return examples


def create_dir_test():
  """Verifies file_io directory handling methods."""

  # Test directory creation.
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (19):
#   1. Line 56: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 56: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 59: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 59: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 64: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 64: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 71: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 71: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 74: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 74: Print statements detected in TensorFlow code - must use logging module for production code
#   11. Line 79: Print statements detected in TensorFlow code - must use logging module for production code
#   12. Line 79: Print statements detected in TensorFlow code - must use logging module for production code
#   13. Line 86: Print statements detected in TensorFlow code - must use logging module for production code
#   14. Line 86: Print statements detected in TensorFlow code - must use logging module for production code
#   15. Line 88: Print statements detected in TensorFlow code - must use logging module for production code
#   16. Line 88: Print statements detected in TensorFlow code - must use logging module for production code
#   17. Line 92: Print statements detected in TensorFlow code - must use logging module for production code
#   18. Line 94: Print statements detected in TensorFlow code - must use logging module for production code
#   19. Line 94: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  starttime_ms = int(round(time.time() * 1000))
  dir_name = "%s/tf_gcs_test_%s" % (FLAGS.gcs_bucket_url, starttime_ms)
  print("Creating dir %s" % dir_name)
  file_io.create_dir(dir_name)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Created directory in: %d milliseconds" % elapsed_ms)

  # Check that the directory exists.
  dir_exists = file_io.is_directory(dir_name)
  assert dir_exists
  print("%s directory exists: %s" % (dir_name, dir_exists))

  # Test recursive directory creation.
  starttime_ms = int(round(time.time() * 1000))
  recursive_dir_name = "%s/%s/%s" % (dir_name,
                                     "nested_dir1",
                                     "nested_dir2")
  print("Creating recursive dir %s" % recursive_dir_name)
  file_io.recursive_create_dir(recursive_dir_name)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Created directory recursively in: %d milliseconds" % elapsed_ms)

  # Check that the directory exists.
  recursive_dir_exists = file_io.is_directory(recursive_dir_name)
  assert recursive_dir_exists
  print("%s directory exists: %s" % (recursive_dir_name, recursive_dir_exists))

  # Create some contents in the just created directory and list the contents.
  num_files = 10
  files_to_create = ["file_%d.txt" % n for n in range(num_files)]
  for file_num in files_to_create:
    file_name = "%s/%s" % (dir_name, file_num)
    print("Creating file %s." % file_name)
    file_io.write_string_to_file(file_name, "test file.")

  print("Listing directory %s." % dir_name)
  starttime_ms = int(round(time.time() * 1000))
  directory_contents = file_io.list_directory(dir_name)
  print(directory_contents)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Listed directory %s in %s milliseconds" % (dir_name, elapsed_ms))
  assert set(directory_contents) == set(files_to_create + ["nested_dir1/"])

  # Test directory renaming.
  dir_to_rename = "%s/old_dir" % dir_name
  new_dir_name = "%s/new_dir" % dir_name
  file_io.create_dir(dir_to_rename)
  assert file_io.is_directory(dir_to_rename)
  assert not file_io.is_directory(new_dir_name)
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (10):
#   1. Line 105: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 105: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 108: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 108: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 114: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 114: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 120: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 120: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 128: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 128: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style


  starttime_ms = int(round(time.time() * 1000))
  print("Will try renaming directory %s to %s" % (dir_to_rename, new_dir_name))
  file_io.rename(dir_to_rename, new_dir_name)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Renamed directory %s to %s in %s milliseconds" % (
      dir_to_rename, new_dir_name, elapsed_ms))
  assert not file_io.is_directory(dir_to_rename)
  assert file_io.is_directory(new_dir_name)

  # Test Delete directory recursively.
  print("Deleting directory recursively %s." % dir_name)
  starttime_ms = int(round(time.time() * 1000))
  file_io.delete_recursively(dir_name)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  dir_exists = file_io.is_directory(dir_name)
  assert not dir_exists
  print("Deleted directory recursively %s in %s milliseconds" % (
      dir_name, elapsed_ms))


def create_object_test():
  """Verifies file_io's object manipulation methods ."""
  starttime_ms = int(round(time.time() * 1000))
  dir_name = "%s/tf_gcs_test_%s" % (FLAGS.gcs_bucket_url, starttime_ms)
  print("Creating dir %s." % dir_name)
  file_io.create_dir(dir_name)

  num_files = 5
  # Create files of 2 different patterns in this directory.
  files_pattern_1 = ["%s/test_file_%d.txt" % (dir_name, n)
                     for n in range(num_files)]
  files_pattern_2 = ["%s/testfile%d.txt" % (dir_name, n)
                     for n in range(num_files)]

  starttime_ms = int(round(time.time() * 1000))
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (34):
#   1. Line 141: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 141: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 144: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 144: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 149: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 149: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 153: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 153: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 154: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 159: Print statements detected in TensorFlow code - must use logging module for production code
#   11. Line 159: Print statements detected in TensorFlow code - must use logging module for production code
#   12. Line 163: Print statements detected in TensorFlow code - must use logging module for production code
#   13. Line 163: Print statements detected in TensorFlow code - must use logging module for production code
#   14. Line 164: Print statements detected in TensorFlow code - must use logging module for production code
#   15. Line 173: Print statements detected in TensorFlow code - must use logging module for production code
#   16. Line 173: Print statements detected in TensorFlow code - must use logging module for production code
#   17. Line 178: Print statements detected in TensorFlow code - must use logging module for production code
#   18. Line 178: Print statements detected in TensorFlow code - must use logging module for production code
#   19. Line 184: Print statements detected in TensorFlow code - must use logging module for production code
#   20. Line 184: Print statements detected in TensorFlow code - must use logging module for production code
#   21. Line 193: Print statements detected in TensorFlow code - must use logging module for production code
#   22. Line 193: Print statements detected in TensorFlow code - must use logging module for production code
#   23. Line 200: Print statements detected in TensorFlow code - must use logging module for production code
#   24. Line 200: Print statements detected in TensorFlow code - must use logging module for production code
#   25. Line 203: Print statements detected in TensorFlow code - must use logging module for production code
#   26. Line 203: Print statements detected in TensorFlow code - must use logging module for production code
#   27. Line 208: Print statements detected in TensorFlow code - must use logging module for production code
#   28. Line 208: Print statements detected in TensorFlow code - must use logging module for production code
#   29. Line 217: Print statements detected in TensorFlow code - must use logging module for production code
#   30. Line 217: Print statements detected in TensorFlow code - must use logging module for production code
#   31. Line 220: Print statements detected in TensorFlow code - must use logging module for production code
#   32. Line 220: Print statements detected in TensorFlow code - must use logging module for production code
#   33. Line 226: Print statements detected in TensorFlow code - must use logging module for production code
#   34. Line 226: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  files_to_create = files_pattern_1 + files_pattern_2
  for file_name in files_to_create:
    print("Creating file %s." % file_name)
    file_io.write_string_to_file(file_name, "test file creation.")
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Created %d files in %s milliseconds" % (
      len(files_to_create), elapsed_ms))

  # Listing files of pattern1.
  list_files_pattern = "%s/test_file*.txt" % dir_name
  print("Getting files matching pattern %s." % list_files_pattern)
  starttime_ms = int(round(time.time() * 1000))
  files_list = file_io.get_matching_files(list_files_pattern)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Listed files in %s milliseconds" % elapsed_ms)
  print(files_list)
  assert set(files_list) == set(files_pattern_1)

  # Listing files of pattern2.
  list_files_pattern = "%s/testfile*.txt" % dir_name
  print("Getting files matching pattern %s." % list_files_pattern)
  starttime_ms = int(round(time.time() * 1000))
  files_list = file_io.get_matching_files(list_files_pattern)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("Listed files in %s milliseconds" % elapsed_ms)
  print(files_list)
  assert set(files_list) == set(files_pattern_2)

  # Test renaming file.
  file_to_rename = "%s/oldname.txt" % dir_name
  file_new_name = "%s/newname.txt" % dir_name
  file_io.write_string_to_file(file_to_rename, "test file.")
  assert file_io.file_exists(file_to_rename)
  assert not file_io.file_exists(file_new_name)

  print("Will try renaming file %s to %s" % (file_to_rename, file_new_name))
  starttime_ms = int(round(time.time() * 1000))
  file_io.rename(file_to_rename, file_new_name)
  elapsed_ms = int(round(time.time() * 1000)) - starttime_ms
  print("File %s renamed to %s in %s milliseconds" % (
      file_to_rename, file_new_name, elapsed_ms))
  assert not file_io.file_exists(file_to_rename)
  assert file_io.file_exists(file_new_name)

  # Delete directory.
  print("Deleting directory %s." % dir_name)
  file_io.delete_recursively(dir_name)


def main(argv):
  del argv  # Unused.

  # Sanity check on the GCS bucket URL.
  if not FLAGS.gcs_bucket_url or not FLAGS.gcs_bucket_url.startswith("gs://"):
    print("ERROR: Invalid GCS bucket URL: \"%s\"" % FLAGS.gcs_bucket_url)
    sys.exit(1)

  # Generate random tfrecord path name.
  input_path = FLAGS.gcs_bucket_url + "/"
  input_path += "".join(random.choice("0123456789ABCDEF") for i in range(8))
  input_path += ".tfrecord"
  print("Using input path: %s" % input_path)

  # Verify that writing to the records file in GCS works.
  print("\n=== Testing writing and reading of GCS record file... ===")
  example_data = create_examples(FLAGS.num_examples, 5)
  with tf.io.TFRecordWriter(input_path) as hf:
    for e in example_data:
      hf.write(e.SerializeToString())

    print("Data written to: %s" % input_path)

  # Verify that reading from the tfrecord file works and that
  # tf_record_iterator works.
  record_iter = tf.compat.v1.python_io.tf_record_iterator(input_path)
  read_count = 0
  for _ in record_iter:
    read_count += 1
  print("Read %d records using tf_record_iterator" % read_count)

  if read_count != FLAGS.num_examples:
    print("FAIL: The number of records read from tf_record_iterator (%d) "
          "differs from the expected number (%d)" % (read_count,
                                                     FLAGS.num_examples))
    sys.exit(1)

  # Verify that running the read op in a session works.
  print("\n=== Testing TFRecordReader.read op in a session... ===")
  with tf.Graph().as_default():
    filename_queue = tf.compat.v1.train.string_input_producer([input_path],
                                                              num_epochs=1)
    reader = tf.compat.v1.TFRecordReader()
    _, serialized_example = reader.read(filename_queue)

    with tf.compat.v1.Session() as sess:
      sess.run(tf.compat.v1.global_variables_initializer())
      sess.run(tf.compat.v1.local_variables_initializer())
      tf.compat.v1.train.start_queue_runners()
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (6):
#   1. Line 239: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 239: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 246: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 246: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 250: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 250: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

      index = 0
      for _ in range(FLAGS.num_examples):
        print("Read record: %d" % index)
        sess.run(serialized_example)
        index += 1

      # Reading one more record should trigger an exception.
      try:
        sess.run(serialized_example)
        print("FAIL: Failed to catch the expected OutOfRangeError while "
              "reading one more record than is available")
        sys.exit(1)
      except tf.errors.OutOfRangeError:
        print("Successfully caught the expected OutOfRangeError while "
              "reading one more record than is available")

  create_dir_test()
  create_object_test()


if __name__ == "__main__":
  tf.compat.v1.app.run(main)
