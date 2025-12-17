import os
import sys

check = os.environ["PYTHON_CHECK"]
segments = check.split(".")

version = ".".join(str(segment) for segment in sys.version_info[: len(segments)])

print(f"  actual version: {version!r}")
print(f"expected version: {check!r}")

if version != check:
    sys.exit(1)
