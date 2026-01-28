"""
Ultra-simple test for Semgrep - just test if execute() is being called
"""

# This should match: $CONNECTION.execute(...)
connection.execute("SELECT * FROM users")
