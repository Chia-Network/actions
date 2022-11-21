import os
import sys

found = ".".join(str(segment) for segment in sys.version_info[:2])
expected = os.environ["PYTHON_CHECK"]
equal = found == expected

print(f"   found: {found}")
print(f"expected: {expected}")
print(f"   equal: {equal}")

if not equal:
    sys.exit(1)
