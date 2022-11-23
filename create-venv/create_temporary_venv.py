import os
import pathlib
import tempfile
import venv

runner_temp = os.environ["RUNNER_TEMP"]
temporary_directory = pathlib.Path(tempfile.mkdtemp(dir=runner_temp))
github_output = pathlib.Path(os.environ["GITHUB_OUTPUT"])
with github_output.open("a") as file:
    print(f"temp-venv-path={temporary_directory}", file=file)
venv.create(env_dir=temporary_directory, with_pip=True)
