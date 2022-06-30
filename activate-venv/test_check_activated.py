import os
import pathlib
import sys

expected = pathlib.Path.cwd().joinpath(os.environ["EXPECTED_EXECUTABLE"])
actual = pathlib.Path(sys.executable)
equal = expected == pathlib.Path(sys.executable)

print(f"expected: {expected}")
print(f"  actual: {actual}")
print(f"   equal: {'yes' if equal else 'no'}")

if not equal:
    sys.exit(1)
