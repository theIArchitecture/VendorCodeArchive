"""
Test file for Semgrep SQL injection detection
This file contains intentional SQL injection violations to test SEMGREP-SEC-SQLINJEC
"""

from sqlalchemy import create_engine, text


def test_sql_injection_concatenation(user_id):
    """VIOLATION: SQL injection via string concatenation"""
    engine = create_engine('sqlite:///test.db')
    connection = engine.connect()

    # Pattern 1: Direct concatenation with +
    sql = "SELECT * FROM users WHERE id = " + user_id
    connection.execute(text(sql))

    # Pattern 2: String formatting with %
    sql = "SELECT * FROM users WHERE id = %s" % (user_id,)
    connection.execute(text(sql))

    # Pattern 3: .format() method
    sql = "SELECT * FROM users WHERE name = '{}'".format(user_id)
    connection.execute(text(sql))

    # Pattern 4: f-string
    sql = f"SELECT * FROM users WHERE email = '{user_id}'"
    connection.execute(text(sql))

    connection.close()


def test_sql_injection_variable(user_input):
    """VIOLATION: SQL injection via variable assignment then execute"""
    engine = create_engine('sqlite:///test.db')
    connection = engine.connect()

    # Pattern 5: Variable with concatenation
    query = "DELETE FROM sessions WHERE token = " + user_input
    connection.execute(text(query))

    # Pattern 6: Variable with % formatting
    query = "UPDATE users SET active = 1 WHERE id = %s" % (user_input,)
    connection.execute(text(query))

    # Pattern 7: Variable with .format()
    query = "INSERT INTO logs VALUES ({})".format(user_input)
    connection.execute(text(query))

    # Pattern 8: Variable with f-string
    query = f"DROP TABLE {user_input}"
    connection.execute(text(query))

    connection.close()


if __name__ == "__main__":
    # This code should never actually run - it's for testing static analysis
    print("This file is for Semgrep testing only - do not execute")
