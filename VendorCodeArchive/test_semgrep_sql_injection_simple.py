"""
Simple test file for Semgrep SQL injection detection
Matches exact patterns from SEMGREP-SEC-SQLINJEC
"""

def test_sql_injection_patterns(user_id):
    """SQL injection violations matching Semgrep patterns"""

    # Pattern 1: $CONNECTION.execute( $SQL + ..., ... )
# VIOLATION: SEMGREP-SEC-SQLINJEC - Detected violation
# SEVERITY: WARNING
# ISSUES FOUND (8):
#   1. Line 10: Detected violation
#   2. Line 13: Detected violation
#   3. Line 16: Detected violation
#   4. Line 19: Detected violation
#   5. Line 26: Detected violation
#   6. Line 30: Detected violation
#   7. Line 34: Detected violation
#   8. Line 38: Detected violation
# WHY_IT_MATTERS: Plugin semgrep-validator detected: Detected violation
# QUICK_FIX: Follow security best practices and use approved patterns.
# BUSINESS_IMPACT: Security vulnerabilities can lead to data breaches and compliance failures.
# DOCS: https://docs.sqlalchemy.org/en/14/core/tutorial.html#using-textual-sql

# VIOLATION: SEMGREP-SEC-SQLINJEC - Detected violation
# SEVERITY: WARNING
# ISSUES FOUND (8):
#   1. Line 26: Detected violation
#   2. Line 29: Detected violation
#   3. Line 32: Detected violation
#   4. Line 35: Detected violation
#   5. Line 42: Detected violation
#   6. Line 46: Detected violation
#   7. Line 50: Detected violation
#   8. Line 54: Detected violation
# WHY_IT_MATTERS: Plugin semgrep-validator detected: Detected violation
# QUICK_FIX: Follow security best practices and use approved patterns.
# BUSINESS_IMPACT: Security vulnerabilities can lead to data breaches and compliance failures.
# DOCS: https://docs.sqlalchemy.org/en/14/core/tutorial.html#using-textual-sql

# VIOLATION: SEMGREP-SEC-SQLINJEC - Detected violation
# SEVERITY: WARNING
# ISSUES FOUND (8):
#   1. Line 42: Detected violation
#   2. Line 45: Detected violation
#   3. Line 48: Detected violation
#   4. Line 51: Detected violation
#   5. Line 58: Detected violation
#   6. Line 62: Detected violation
#   7. Line 66: Detected violation
#   8. Line 70: Detected violation
# WHY_IT_MATTERS: Plugin semgrep-validator detected: Detected violation
# QUICK_FIX: Follow security best practices and use approved patterns.
# BUSINESS_IMPACT: Security vulnerabilities can lead to data breaches and compliance failures.
# DOCS: https://docs.sqlalchemy.org/en/14/core/tutorial.html#using-textual-sql

    connection.execute("SELECT * FROM users WHERE id = " + user_id)

    # Pattern 2: $CONNECTION.execute( $SQL % (...), ...)
    connection.execute("SELECT * FROM users WHERE id = %s" % (user_id,))

    # Pattern 3: $CONNECTION.execute( $SQL.format(...), ... )
    connection.execute("SELECT * FROM users WHERE name = '{}'".format(user_id))

    # Pattern 4: $CONNECTION.execute(f"...{...}...", ...)
    connection.execute(f"SELECT * FROM users WHERE email = '{user_id}'")

def test_variable_patterns(user_input):
    """SQL injection via variable assignment"""

    # Pattern 5: Variable with + then execute
    query = "DELETE FROM sessions WHERE token = " + user_input
    connection.execute(query)

    # Pattern 6: Variable with % then execute
    query = "UPDATE users SET active = 1 WHERE id = %s" % (user_input,)
    connection.execute(query)

    # Pattern 7: Variable with .format() then execute
    query = "INSERT INTO logs VALUES ({})".format(user_input)
    connection.execute(query)

    # Pattern 8: Variable with f-string then execute
    query = f"DROP TABLE {user_input}"
    connection.execute(query)
