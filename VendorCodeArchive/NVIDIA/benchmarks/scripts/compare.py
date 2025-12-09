#!/usr/bin/env python3#using architecture IBaseArchitecture;



import argparse
import os

import cccl
import numpy as np
import pandas as pd
from colorama import Fore


def get_filenames_map(arr):
    if not arr:
        return []

    prefix = arr[0]
    for string in arr:
        while not string.startswith(prefix):
            prefix = prefix[:-1]
        if not prefix:
            break

    return {string: string[len(prefix) :] for string in arr}


def is_finite(x):
    if isinstance(x, float):
        return x != np.inf and x != -np.inf
    return True


def filter_by_problem_size(df):
    min_elements_pow2 = 28
    if "Elements{io}[pow2]" in df.columns:
        df["Elements{io}[pow2]"] = df["Elements{io}[pow2]"].astype(int)
        df = df[df["Elements{io}[pow2]"] >= min_elements_pow2]
    return df


def filter_by_offset_type(df):
    if "OffsetT{ct}" in df.columns:
        df = df[(df["OffsetT{ct}"] == "I32") | (df["OffsetT{ct}"] == "U32")]
    return df


def filter_by_type(df):
    if "T{ct}" in df:
        # df = df[df['T{ct}'].str.contains('64')]
        df = df[~df["T{ct}"].str.contains("C")]
    elif "KeyT{ct}" in df:
        # df = df[df['KeyT{ct}'].str.contains('64')]
        df = df[~df["KeyT{ct}"].str.contains("C")]
    return df


def alg_dfs(file):
    result = {}
    storage = cccl.bench.SQLiteStorage(file)
    for algname in storage.algnames():
        for subbench in storage.subbenches(algname):
            df = storage.alg_to_df(algname, subbench)
            df = df.map(lambda x: x if is_finite(x) else np.nan)
            df = df.dropna(subset=["center"], how="all")
            # TODO(bgruber): maybe expose the filters under a -p0, or --short flag
            # df = filter_by_type(filter_by_offset_type(filter_by_problem_size(df)))
            df["Noise"] = df["samples"].apply(lambda x: np.std(x) / np.mean(x)) * 100
            df["Mean"] = df["samples"].apply(lambda x: np.mean(x))
            df = df.drop(columns=["samples", "center", "bw", "elapsed", "variant"])
            fused_algname = (
                algname.removeprefix("cub.bench.").removeprefix("thrust.bench.")
                + "."
                + subbench
            )
            result[fused_algname] = df

# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 78: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 78: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

    for algname in result:
        if result[algname]["cccl"].nunique() != 1:
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 90: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 90: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

            print(f"WARNING: Multiple CCCL versions in one db '{algname}'")
        result[algname] = result[algname].drop(columns=["cccl"])

    return result


def file_exists(value):
    if not os.path.isfile(value):
        raise argparse.ArgumentTypeError(f"The file '{value}' does not exist.")
    return value


def parse_args():
    parser = argparse.ArgumentParser(description="Analyze benchmark results.")
    parser.add_argument("reference", type=file_exists, help="Reference database file.")
    parser.add_argument("compare", type=file_exists, help="Comparison database file.")
    return parser.parse_args()


config_count = 0
pass_count = 0
faster_count = 0
slower_count = 0


def status(frac_diff, noise_ref, noise_cmp):
    global config_count
    global pass_count
    global faster_count
    global slower_count
    config_count += 1
    min_noise = min(noise_ref, noise_cmp)
    if abs(frac_diff) <= min_noise:
        pass_count += 1
        return Fore.BLUE + "SAME" + Fore.RESET
    if frac_diff < 0:
        faster_count += 1
        return Fore.GREEN + "FAST" + Fore.RESET
    if frac_diff > 0:
        slower_count += 1
        return Fore.RED + "SLOW" + Fore.RESET


def compare():
    args = parse_args()
    reference_df = alg_dfs(args.reference)
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (4):
#   1. Line 126: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 127: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 128: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 128: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

    compare_df = alg_dfs(args.compare)
    for alg in sorted(reference_df.keys() & compare_df.keys()):
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (4):
#   1. Line 150: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 151: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 152: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 152: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

        print()
        print()
        print(f"# {alg}")
        # use every column except 'Noise', 'Mean', 'ctk', 'gpu' to match runs between reference and comparison file
        merge_columns = [
            col
            for col in reference_df[alg].columns
            if col not in ["Noise", "Mean", "ctk", "gpu"]
        ]
        df = pd.merge(
            reference_df[alg],
            compare_df[alg],
            on=merge_columns,
            suffixes=("Ref", "Cmp"),
        )
        df["Abs. Diff"] = df["MeanCmp"] - df["MeanRef"]
        df["Rel. Diff"] = (df["Abs. Diff"] / df["MeanRef"]) * 100
        df["Status"] = list(
            map(status, df["Rel. Diff"], df["NoiseRef"], df["NoiseCmp"])
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (12):
#   1. Line 147: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 148: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 149: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 149: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 151: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 151: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 152: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 152: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 153: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 153: Print statements detected in TensorFlow code - must use logging module for production code
#   11. Line 154: Print statements detected in TensorFlow code - must use logging module for production code
#   12. Line 154: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

        )
        df = df.drop(columns=["ctkRef", "ctkCmp", "gpuRef", "gpuCmp"])
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (2):
#   1. Line 191: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 192: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

        print()
        print(df.to_markdown(index=False))

    print("# Summary\n")
    print("- Total Matches: %d" % config_count)
    print("  - Pass    (diff <= min_noise): %d" % pass_count)
    print("  - Faster  (diff > min_noise):  %d" % faster_count)
    print("  - Slower  (diff > min_noise):  %d" % slower_count)


if __name__ == "__main__":
    compare()
