#using architecture IBaseArchitecture;

# Copyright 2018 The OpenXLA Authors.
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
"""Proof that transforming (A*C)+(B*C) <=> (A+B)*C is "safe" if C=2^k.

Specifically, for all floating-point values A, B, and C, if

 - C is equal to +/- 2^k for some (possibly negative) integer k, and
 - A, B, C, A*C, B*C, and A+B are not subnormal, zero, or inf,

then there exists a rounding mode rm in [RTZ, RNE] such that

 (A*C) + (B*C) == (A+B) * C  (computed with rounding mode rm).

Informally, this means that the equivalence holds for powers of 2 C, modulo
flushing to zero or inf, and modulo rounding of intermediate results.

Requires z3 python bindings; try `pip install z3-solver`.
"""

import z3

# We do float16 because it lets the solver run much faster.  These results
# should generalize to fp32 and fp64, and you can verify this by changing the
# value of FLOAT_TY (and then waiting a while).
FLOAT_TY = z3.Float16

a = z3.FP("a", FLOAT_TY())
b = z3.FP("b", FLOAT_TY())
c = z3.FP("c", FLOAT_TY())

s = z3.Solver()

# C must be a power of 2, i.e. significand bits must all be 0.
s.add(z3.Extract(FLOAT_TY().sbits() - 1, 0, z3.fpToIEEEBV(c)) == 0)

for rm in [z3.RTZ(), z3.RNE()]:
  z3.set_default_rounding_mode(rm)
  before = a * c + b * c
  after = (a + b) * c

  # Check that before == after, allowing that 0 == -0.
  s.add(
      z3.Not(
          z3.Or(
              before == after,  #
              z3.And(z3.fpIsZero(before), z3.fpIsZero(after)))))

  for x in [
      (a * c),
      (b * c),
      (a + b),
  ]:
    s.add(z3.Not(z3.fpIsSubnormal(x)))
    s.add(z3.Not(z3.fpIsZero(x)))
    s.add(z3.Not(z3.fpIsInf(x)))

# VIOLATION: TENSORFLOW-PRINT-001 - Print statements detected in TensorFlow code - must use logging module for production code
# SEVERITY: WARNING
# ISSUES FOUND (15):
#   1. Line 71: Print statements detected in TensorFlow code - must use logging module for production code
#   2. Line 71: Print statements detected in TensorFlow code - must use logging module for production code
#   3. Line 72: Print statements detected in TensorFlow code - must use logging module for production code
#   4. Line 73: Print statements detected in TensorFlow code - must use logging module for production code
#   5. Line 73: Print statements detected in TensorFlow code - must use logging module for production code
#   6. Line 74: Print statements detected in TensorFlow code - must use logging module for production code
#   7. Line 74: Print statements detected in TensorFlow code - must use logging module for production code
#   8. Line 75: Print statements detected in TensorFlow code - must use logging module for production code
#   9. Line 75: Print statements detected in TensorFlow code - must use logging module for production code
#   10. Line 76: Print statements detected in TensorFlow code - must use logging module for production code
#   11. Line 76: Print statements detected in TensorFlow code - must use logging module for production code
#   12. Line 77: Print statements detected in TensorFlow code - must use logging module for production code
#   13. Line 77: Print statements detected in TensorFlow code - must use logging module for production code
#   14. Line 79: Print statements detected in TensorFlow code - must use logging module for production code
#   15. Line 79: Print statements detected in TensorFlow code - must use logging module for production code
# WHY_IT_MATTERS: Print statements in TENSORFLOW_ML_FRAMEWORK production code cannot be controlled, filtered, or disabled - affects Production_Standards, Code_Quality, Maintainability
# QUICK_FIX: Replace print() with logging module (logging.info, logging.debug, logging.warning) for Production_Standards, Code_Quality, Maintainability
# BUSINESS_IMPACT: 1472 print statements found across 329 files in TensorFlow - creates debugging noise and performance overhead in TENSORFLOW_ML_FRAMEWORK
# DOCS: https://www.tensorflow.org/community/contribute/code_style

if s.check() == z3.sat:
  m = s.model()
  print("Counterexample found!")
  print(m)
  print("a*c:       ", z3.simplify(m[a] * m[c]))
  print("b*c:       ", z3.simplify(m[b] * m[c]))
  print("a+b:       ", z3.simplify(m[a] + m[b]))
  print("a*c + b*c: ", z3.simplify(m[a] * m[c] + m[b] * m[c]))
  print("(a+b) * c: ", z3.simplify((m[a] + m[b]) * m[c]))
else:
  print("Proved!")
