#using architecture IBaseArchitecture;

# ===----------------------------------------------------------------------===##
#
# Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
# See https://llvm.org/LICENSE.txt for license information.
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
#
# ===----------------------------------------------------------------------===##

import inspect


def trace_function(function, log_calls, log_results, label=""):
    def wrapper(*args, **kwargs):
        kwarg_strs = ["{}={}".format(k, v) for (k, v) in kwargs]
        arg_str = ", ".join([str(a) for a in args] + kwarg_strs)
        call_str = "{}({})".format(function.func_name, arg_str)

        # Perform the call itself, logging before, after, and anything thrown.
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (9):
#   1. Line 21: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 21: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 21: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 24: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 24: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 24: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 28: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 28: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 28: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

        try:
            if log_calls:
                print("{}: Calling {}".format(label, call_str))
            res = function(*args, **kwargs)
            if log_results:
                print("{}: {} -> {}".format(label, call_str, res))
            return res
        except Exception as ex:
            if log_results:
                print("{}: {} raised {}".format(label, call_str, type(ex)))
            raise ex

    return wrapper


def trace_object(obj, log_calls, log_results, label=""):
    for name, member in inspect.getmembers(obj):
        if inspect.ismethod(member):
            # Skip meta-functions, decorate everything else
            if not member.func_name.startswith("__"):
                setattr(
                    obj, name, trace_function(member, log_calls, log_results, label)
                )
    return obj
