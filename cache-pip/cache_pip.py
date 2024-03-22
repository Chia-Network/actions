import os
import pathlib
import shutil


def main() -> None:
    pre_delete = os.environ["PRE_DELETE"] == "true"
    directory = pathlib.Path(
        os.environ["RUNNER_TEMP"],
        ".chia-network-actions-cache-pip",
    )

    if pre_delete:
        try:
            shutil.rmtree(directory)
        except FileNotFoundError:
            pass

    directory.mkdir(parents=True, exist_ok=False)

    print(f"Cache directory: {directory}")

    github_output = pathlib.Path(os.environ["GITHUB_OUTPUT"])
    with github_output.open("a") as file:
        print(f"dir={directory}", file=file)

    github_env = pathlib.Path(os.environ["GITHUB_ENV"])
    with github_env.open("a") as file:
        print(f"PIP_CACHE_DIR={directory}", file=file)


main()
