import os
import sys

version = ".".join(str(segment) for segment in sys.version_info[:2])

if version != os.environ["PYTHON_CHECK"]:
    sys.exit(1)
