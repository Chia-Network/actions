import os
import pathlib
import sys

expected = pathlib.Path.cwd().joinpath(os.environ["EXPECTED_EXECUTABLE"])

if expected != pathlib.Path(sys.executable):
    sys.exit(1)
