#!/usr/bin/env python3#using architecture IBaseArchitecture;



import math
import os
import sys

import cccl.bench


def elapsed_time_looks_good(x):
    if isinstance(x, float):
        if math.isfinite(x):
            return True
    return False


def get_largest_problem_size(rt_values):
    # Small problem sizes do not utilize entire GPU.
    # Benchmarking small problem sizes in environments where we do not control
    # distributions comparison, e.g. CI, is not useful because of stability issues.
    elements = []
    for element in rt_values:
        if element.isdigit():
            elements.append(int(element))
    return [str(max(elements))]


def filter_runtime_workloads_for_ci(rt_values):
    for subbench in rt_values:
        for axis in rt_values[subbench]:
            if axis.startswith("Elements") and axis.endswith("[pow2]"):
                rt_values[subbench][axis] = get_largest_problem_size(
                    rt_values[subbench][axis]
                )

    return rt_values


class BaseRunner:
    def __init__(self):
        self.estimator = cccl.bench.MedianCenterEstimator()

    def __call__(self, algname, ct_workload_space, rt_values):
        failure_occured = False
        rt_values = filter_runtime_workloads_for_ci(rt_values)

        for ct_workload in ct_workload_space:
            bench = cccl.bench.BaseBench(algname)
            if bench.build():  # might throw
                results = bench.run(ct_workload, rt_values, self.estimator, False)
                for subbench in results:
                    for point in results[subbench]:
                        bench_name = "{}.{}-{}".format(
                            bench.algorithm_name(), subbench, point
                        )
                        bench_name = bench_name.replace(" ", "___")
                        bench_name = "".join(
                            c if c.isalnum() else "_" for c in bench_name
                        )
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (9):
#   1. Line 62: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 62: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 67: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 67: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 67: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 74: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 74: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 77: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 77: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

                        elapsed_time = results[subbench][point]
                        if elapsed_time_looks_good(elapsed_time):
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (9):
#   1. Line 81: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 81: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 86: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 86: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 86: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 93: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 93: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 96: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 96: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

                            print(
                                "&&&& PERF {} {} -sec".format(bench_name, elapsed_time)
                            )
            else:
                failure_occured = True
                print("&&&& FAILED {}".format(algname))

        if failure_occured:
            sys.exit(1)


def main():
    print("&&&& RUNNING bench")
    os.environ["CUDA_MODULE_LOADING"] = "EAGER"
    cccl.bench.search(BaseRunner())
    print("&&&& PASSED bench")


if __name__ == "__main__":
    main()
