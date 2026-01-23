#!/usr/bin/env python3
"""
MD5 Cryptographic Hash Healer
Auto-fixes MD5 usage by replacing with FIPS-approved SHA256 across multiple languages.

Healing Strategy:
  Python: hashlib.md5() -> hashlib.sha256()
  Java: MessageDigest.getInstance("MD5") -> MessageDigest.getInstance("SHA-256")
  C#: MD5.Create() -> SHA256.Create()
"""

import ast
import json
import sys
import re
from typing import List, Dict, Any, Optional

class Fix:
    """Represents a single healing fix."""
    def __init__(self, description: str, fixed_content: str, teaching: str = ""):
        self.description = description
        self.fixed_content = fixed_content
        self.teaching = teaching

    def to_dict(self) -> Dict[str, Any]:
        result = {
            "description": self.description,
            "fixedContent": self.fixed_content
        }
        if self.teaching:
            result["teaching"] = self.teaching
        return result

class MD5Healer:
    """Heals MD5 usage across multiple languages."""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.rule_id = config.get("rule_id", "CUSTOM-SEC-MD5")

    def heal_python(self, code: str) -> Optional[Fix]:
        """Heal MD5 usage in Python code using AST transformation."""
        try:
            tree = ast.parse(code)
            modified = False

            # Track imports to add if needed
            needs_sha256_import = False
            has_hashlib_import = False

            # Check existing imports
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        if alias.name == "hashlib":
                            has_hashlib_import = True

            # For simplicity, use regex replacement on source
            # (Full AST rewriting would be more complex but more accurate)
            fixed_code = code
            replacements = []

            # Replace hashlib.md5() calls
            pattern1 = r'hashlib\.md5\('
            if re.search(pattern1, fixed_code):
                fixed_code = re.sub(pattern1, 'hashlib.sha256(', fixed_code)
                replacements.append("hashlib.md5() → hashlib.sha256()")
                modified = True

            # Replace 'from hashlib import md5' imports
            pattern2 = r'from\s+hashlib\s+import\s+md5'
            if re.search(pattern2, fixed_code):
                fixed_code = re.sub(pattern2, 'from hashlib import sha256', fixed_code)
                replacements.append("import md5 → import sha256")
                modified = True

            # Replace variable names like 'md5' with 'sha256'
            # (Be careful with variable names - only in assignment context)
            pattern3 = r'\bmd5\s*='
            if re.search(pattern3, fixed_code):
                fixed_code = re.sub(pattern3, 'sha256 =', fixed_code)
                replacements.append("md5 variable → sha256")
                modified = True

            if modified:
                teaching = (
                    "FIPS Compliance: Replaced MD5 with SHA256. "
                    "MD5 is cryptographically broken (collision attacks proven) and not FIPS 140-2 approved. "
                    "SHA256 provides stronger security and meets government/enterprise compliance requirements."
                )
                return Fix(
                    description=f"Python: {', '.join(replacements)}",
                    fixed_content=fixed_code,
                    teaching=teaching
                )

            return None

        except SyntaxError:
            # File has syntax errors, cannot heal safely
            return None

    def heal_java(self, code: str) -> Optional[Fix]:
        """Heal MD5 usage in Java code using regex replacement."""
        fixed_code = code
        modified = False
        replacements = []

        # Replace MessageDigest.getInstance("MD5")
        pattern1 = r'MessageDigest\.getInstance\s*\(\s*"MD5"\s*\)'
        if re.search(pattern1, fixed_code):
            fixed_code = re.sub(pattern1, 'MessageDigest.getInstance("SHA-256")', fixed_code)
            replacements.append("MessageDigest.getInstance(\"MD5\") → getInstance(\"SHA-256\")")
            modified = True

        # Replace single quotes variant
        pattern2 = r"MessageDigest\.getInstance\s*\(\s*'MD5'\s*\)"
        if re.search(pattern2, fixed_code):
            fixed_code = re.sub(pattern2, "MessageDigest.getInstance('SHA-256')", fixed_code)
            replacements.append("MessageDigest.getInstance('MD5') → getInstance('SHA-256')")
            modified = True

        if modified:
            teaching = (
                "FIPS Compliance: Replaced MD5 with SHA-256 for Java MessageDigest. "
                "SHA-256 is approved for government and enterprise use, while MD5 is cryptographically broken."
            )
            return Fix(
                description=f"Java: {', '.join(replacements)}",
                fixed_content=fixed_code,
                teaching=teaching
            )

        return None

    def heal_csharp(self, code: str) -> Optional[Fix]:
        """Heal MD5 usage in C# code using regex replacement."""
        fixed_code = code
        modified = False
        replacements = []

        # Replace MD5.Create()
        pattern1 = r'\bMD5\.Create\s*\(\s*\)'
        if re.search(pattern1, fixed_code):
            fixed_code = re.sub(pattern1, 'SHA256.Create()', fixed_code)
            replacements.append("MD5.Create() → SHA256.Create()")
            modified = True

        # Replace new MD5CryptoServiceProvider()
        pattern2 = r'new\s+MD5CryptoServiceProvider\s*\(\s*\)'
        if re.search(pattern2, fixed_code):
            fixed_code = re.sub(pattern2, 'new SHA256CryptoServiceProvider()', fixed_code)
            replacements.append("new MD5CryptoServiceProvider() → new SHA256CryptoServiceProvider()")
            modified = True

        # Replace MD5 type declarations (be careful with context)
        # Pattern: 'MD5 variableName' but not in comments or strings
        pattern3 = r'\bMD5\s+(\w+)\s*='
        matches = list(re.finditer(pattern3, fixed_code))
        if matches:
            # Replace from end to beginning to preserve positions
            for match in reversed(matches):
                start, end = match.span()
                var_name = match.group(1)
                fixed_code = fixed_code[:start] + f'SHA256 {var_name} =' + fixed_code[end:]
            replacements.append(f"MD5 type declarations → SHA256 (x{len(matches)})")
            modified = True

        # Replace 'using (var md5 = MD5.Create())'
        pattern4 = r'using\s*\(\s*var\s+md5\s*=\s*MD5\.Create\s*\(\s*\)\s*\)'
        if re.search(pattern4, fixed_code):
            fixed_code = re.sub(pattern4, 'using (var sha256 = SHA256.Create())', fixed_code)
            replacements.append("using var md5 → using var sha256")
            modified = True

        if modified:
            # Add using statement if not present
            if 'using System.Security.Cryptography;' not in fixed_code and 'SHA256' in fixed_code:
                # Simple check: add at top after any existing using statements
                lines = fixed_code.split('\n')
                insert_idx = 0
                for i, line in enumerate(lines):
                    if line.strip().startswith('using '):
                        insert_idx = i + 1
                if insert_idx > 0:
                    lines.insert(insert_idx, 'using System.Security.Cryptography;')
                    fixed_code = '\n'.join(lines)
                    replacements.append("Added using System.Security.Cryptography")

            teaching = (
                "FIPS Compliance: Replaced MD5 with SHA256 in C#. "
                "Note: SHA256 produces 32-byte hashes vs MD5's 16-byte. "
                "Verify hash size dependencies in your code. "
                "This change is required for FIPS 140-2 compliance."
            )
            return Fix(
                description=f"C#: {', '.join(replacements)}",
                fixed_content=fixed_code,
                teaching=teaching
            )

        return None

    def heal(self, file_path: str, code: str, language: str) -> Optional[Fix]:
        """Main healing entry point."""
        if language == "python":
            return self.heal_python(code)
        elif language == "java":
            return self.heal_java(code)
        elif language == "csharp":
            return self.heal_csharp(code)
        else:
            return None

def main():
    """Main entry point for healer plugin."""
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)

        file_path = input_data["filePath"]
        file_content = input_data["fileContent"]
        language = input_data["language"]
        config = input_data.get("config", {})

        # Create healer and run
        healer = MD5Healer(config)
        fix = healer.heal(file_path, file_content, language)

        # Output result
        if fix:
            result = {
                "success": True,
                "fixes": [fix.to_dict()],
                "metadata": {
                    "pluginVersion": "1.0.0",
                    "language": language,
                    "healingApplied": True
                }
            }
        else:
            # No healing needed
            result = {
                "success": True,
                "fixes": [],
                "metadata": {
                    "pluginVersion": "1.0.0",
                    "language": language,
                    "healingApplied": False
                }
            }

        json.dump(result, sys.stdout, indent=2)
        sys.exit(0)

    except Exception as e:
        # Error handling
        error_result = {
            "success": False,
            "error": str(e),
            "fixes": []
        }
        json.dump(error_result, sys.stdout, indent=2)
        sys.exit(1)

if __name__ == "__main__":
    main()
