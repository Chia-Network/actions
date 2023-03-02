import os
import sys

check = os.environ["PYTHON_CHECK"]
segments = check.split(".")

version = ".".join(str(segment) for segment in sys.version_info[:len(segments)])

if version != check:
    sys.exit(1)
