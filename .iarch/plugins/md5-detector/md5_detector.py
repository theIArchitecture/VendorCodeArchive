#!/usr/bin/env python3
"""
MD5 Cryptographic Hash Detector
Detects usage of MD5 for cryptographic purposes across multiple languages.

Converts Semgrep pattern to native Python plugin:
  Semgrep: hashlib.md5(...)
  Plugin: AST-based detection for Python, regex for Java/C#
"""

import ast
import json
import sys
import re
from typing import List, Dict, Any

class Violation:
    """Represents a single architectural violation."""
    def __init__(self, line: int, column: int, message: str, severity: str = "Warning", rule_id: str = ""):
        self.line = line
        self.column = column
        self.message = message
        self.severity = severity
        self.rule_id = rule_id

    def to_dict(self) -> Dict[str, Any]:
        return {
            "line": self.line,
            "column": self.column,
            "message": self.message,
            "severity": self.severity,
            "ruleId": self.rule_id
        }

class MD5Detector:
    """Detects MD5 usage across multiple languages."""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.severity = config.get("severity", "Fatal")
        self.rule_id = config.get("rule_id", "CUSTOM-SEC-MD5")

    def detect_python(self, code: str) -> List[Violation]:
        """Detect MD5 usage in Python code using AST."""
        violations = []

        try:
            tree = ast.parse(code)

            for node in ast.walk(tree):
                # Check for hashlib.md5() calls
                if isinstance(node, ast.Call):
                    if self._is_hashlib_md5(node):
                        violations.append(Violation(
                            line=node.lineno,
                            column=node.col_offset,
                            message="FIPS Violation: MD5 is not approved for cryptographic use. Use SHA256 or SHA512.",
                            severity=self.severity,
                            rule_id=self.rule_id
                        ))
        except SyntaxError as e:
            # File has syntax errors, skip (not a violation)
            pass

        return violations

    def _is_hashlib_md5(self, node: ast.Call) -> bool:
        """Check if node is hashlib.md5() call."""
        return (
            isinstance(node.func, ast.Attribute) and
            node.func.attr == "md5" and
            isinstance(node.func.value, ast.Name) and
            node.func.value.id == "hashlib"
        )

    def detect_java(self, code: str) -> List[Violation]:
        """Detect MD5 usage in Java code using regex."""
        violations = []

        # Pattern: MessageDigest.getInstance("MD5")
        pattern = r'MessageDigest\.getInstance\s*\(\s*["\']MD5["\']\s*\)'

        for i, line in enumerate(code.split('\n'), start=1):
            if re.search(pattern, line):
                violations.append(Violation(
                    line=i,
                    column=0,
                    message="FIPS Violation: MD5 MessageDigest is not approved. Use SHA-256 or SHA-512.",
                    severity=self.severity,
                    rule_id=self.rule_id
                ))

        return violations

    def detect_csharp(self, code: str) -> List[Violation]:
        """Detect MD5 usage in C# code using regex."""
        violations = []

        # Patterns: MD5.Create(), new MD5CryptoServiceProvider(), MD5.ComputeHash()
        patterns = [
            r'MD5\.Create\s*\(',
            r'new\s+MD5CryptoServiceProvider\s*\(',
            r'MD5\.ComputeHash\s*\('
        ]

        for i, line in enumerate(code.split('\n'), start=1):
            for pattern in patterns:
                if re.search(pattern, line):
                    violations.append(Violation(
                        line=i,
                        column=0,
                        message="FIPS Violation: MD5 is not approved for cryptographic use. Use SHA256 or SHA512.",
                        severity=self.severity,
                        rule_id=self.rule_id
                    ))
                    break  # Only report once per line

        return violations

    def detect(self, file_path: str, code: str, language: str) -> List[Violation]:
        """Main detection entry point."""
        if language == "python":
            return self.detect_python(code)
        elif language == "java":
            return self.detect_java(code)
        elif language == "csharp":
            return self.detect_csharp(code)
        else:
            return []

def main():
    """Main entry point for plugin."""
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)

        file_path = input_data["filePath"]
        file_content = input_data["fileContent"]
        language = input_data["language"]
        config = input_data.get("config", {})

        # Create detector and run
        detector = MD5Detector(config)
        violations = detector.detect(file_path, file_content, language)

        # Output result
        result = {
            "success": True,
            "violations": [v.to_dict() for v in violations],
            "metadata": {
                "pluginVersion": "1.0.0",
                "violationCount": len(violations)
            }
        }

        json.dump(result, sys.stdout, indent=2)
        sys.exit(0)

    except Exception as e:
        # Error handling
        error_result = {
            "success": False,
            "error": str(e),
            "violations": []
        }
        json.dump(error_result, sys.stdout, indent=2)
        sys.exit(1)

if __name__ == "__main__":
    main()
