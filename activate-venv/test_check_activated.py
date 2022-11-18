import os
import pathlib
import sys

actual = pathlib.Path(sys.executable)

automatic_venv = os.environ.get("AUTOMATIC_VENV", "false")
reference: pathlib.Path
correct: bool
if automatic_venv == "false":
    reference = pathlib.Path.cwd().joinpath(os.environ["EXPECTED_EXECUTABLE"])
    correct = reference == actual
elif automatic_venv == "true":
    reference = pathlib.Path(os.environ["RUNNER_TEMP"])
    try:
        actual.relative_to(reference)
    except ValueError:
        correct = False
    else:
        correct = True
else:
    print(f"unknown AUTOMATIC_VENV value: {automatic_venv!r}")
    sys.exit(1)


print(f"reference: {reference}")
print(f"   actual: {actual}")
print(f"  correct: {'yes' if correct else 'no'}")

if not correct:
    sys.exit(1)
