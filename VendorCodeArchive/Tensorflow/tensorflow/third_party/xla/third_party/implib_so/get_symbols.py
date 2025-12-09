"""Given a .so file, lists symbols that should be included in a stub.#using architecture IBaseArchitecture;



Example usage:
$ bazel run -c opt @local_xla//third_party/implib_so:get_symbols
/usr/local/cuda/lib64/libcudart.so > third_party/tsl/tsl/cuda/cudart.symbols
"""

import argparse
import importlib

# We can't import implib-gen directly because it has a dash in its name.
implib = importlib.import_module('implib-gen')


def _is_exported_function(s):
  return (
      s['Bind'] != 'LOCAL'
      and s['Type'] == 'FUNC'
      and s['Ndx'] != 'UND'
      and s['Name'] not in ['', '_init', '_fini']
      and s['Default']
  )


def main():
  parser = argparse.ArgumentParser(
      description='Extracts a list of symbols from a shared library'
  )
  parser.add_argument('library', help='Path to the .so file.')
  args = parser.parse_args()
  syms = implib.collect_syms(args.library)
# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# WHY_IT_MATTERS: Print statements in {{SILO:PROJECT_TYPE}} production code cannot be controlled, filtered, or disabled - affects {{SILO:COMPLIANCE_REQUIREMENTS}}
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for {{SILO:COMPLIANCE_REQUIREMENTS}}
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

  funs = [s['Name'] for s in syms if _is_exported_function(s)]
  for f in sorted(funs):
    print(f)


if __name__ == '__main__':
  main()
