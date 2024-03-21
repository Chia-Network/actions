import os
import pathlib
import tempfile


def main() -> None:
    runner_temp = os.environ["RUNNER_TEMP"]
    temporary_directory = tempfile.mkdtemp(dir=runner_temp)

    github_output = pathlib.Path(os.environ["GITHUB_OUTPUT"])
    with github_output.open("a") as file:
        print(f"dir={temporary_directory}", file=file)

    github_env = pathlib.Path(os.environ["GITHUB_ENV"])
    with github_env.open("a") as file:
        print(f"PIP_CACHE_DIR={temporary_directory}", file=file)


main()
