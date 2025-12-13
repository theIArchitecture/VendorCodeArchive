#!/usr/bin/env python3

import json
import os
import re


def read_file(filepath):
    with open(filepath, "r") as f:
        return f.read().rstrip("\n ")


def print_text_file(filepath):
    if os.path.exists(filepath):
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (6):
#   1. Line 15: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 19: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 19: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 22: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 23: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 23: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

        print(read_file(filepath) + "\n\n")


def print_json_summary(summary, heading_level):
    print(
        f"<details><summary><h{heading_level}>{summary['heading']}</h{heading_level}></summary>\n"
    )
    print(summary["body"] + "\n")
    print("</details>\n")


def main():
    # Parse project summaries and sort them by the number of failed jobs:
    projects = []
    project_file_regex = "[0-9]+_.+_summary.json"
    for filename in sorted(os.listdir("execution/projects")):
        match = re.match(project_file_regex, filename)
        if match:
            with open(f"execution/projects/{filename}", "r") as f:
                projects.append(json.load(f))
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (4):
#   1. Line 35: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 35: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 42: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 42: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style


    print(
        f"<details><summary><h3>{read_file('execution/heading.txt')}</h3></summary>\n"
    )

    for project in projects:
        print_json_summary(project, 3)

    print("</details>")


if __name__ == "__main__":
    main()
