"""
Test file for Semgrep plugin validation
Contains intentional security violations to test semgrep-validator plugin
"""

import hashlib
import sqlite3
from flask import request

# VIOLATION: SQL Injection (SEMGREP-SEC-SQLINJEC)
def unsafe_database_query():
    """SQL injection vulnerability - string concatenation"""
    user_id = request.args.get('user_id')
    conn = sqlite3.connect('database.db')

    # SQL Injection: user input directly concatenated into SQL query
    query = "SELECT * FROM users WHERE user_id = '" + user_id + "'"
    conn.execute(query)

    # Another SQL injection variant
    query2 = "SELECT * FROM orders WHERE id = %s" % (user_id,)
    conn.execute(query2)

    # SQL injection with format
    query3 = "DELETE FROM sessions WHERE token = {}".format(user_id)
    conn.execute(query3)

    # SQL injection with f-string
    query4 = f"UPDATE users SET active = 1 WHERE id = {user_id}"
    conn.execute(query4)


# VIOLATION: Weak Cryptography (SEMGREP-SEC-WEAKCRYP)
def weak_hash_function(password):
    """Using MD5 for password hashing - cryptographically broken"""
    # MD5 is not secure for password hashing
    hashed = hashlib.md5(password.encode()).hexdigest()
    return hashed


# VIOLATION: Hardcoded secrets (would match regex rules if any)
API_KEY = "FAKE_API_KEY_FOR_TESTING_DO_NOT_USE"
DATABASE_PASSWORD = "hardcoded_password_123"


# VIOLATION: Another SQL injection variant
def another_sql_injection():
    """SQL injection with variable concatenation"""
    user_input = request.form.get('search')
    conn = sqlite3.connect('database.db')

    # Build query with concatenation
    sql = "SELECT * FROM products WHERE name = '" + user_input + "'"
    conn.execute(sql)


# VIOLATION: Command injection possibility
def unsafe_command_execution():
    """Potential command injection if user input reaches os.system"""
    import os
    filename = request.args.get('file')
    # This would be command injection if executed
    os.system("cat " + filename)
