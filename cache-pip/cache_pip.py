import os
import pathlib
import tempfile


def main() -> None:
    directory = pathlib.Path(
        os.environ["RUNNER_TEMP"],
        ".chia-network-actions-cache-pip",
    )
    directory.mkdir(parents=True, exist_ok=False)

    print(f"Cache directory: {directory}")

    github_output = pathlib.Path(os.environ["GITHUB_OUTPUT"])
    with github_output.open("a") as file:
        print(f"dir={directory}", file=file)

    github_env = pathlib.Path(os.environ["GITHUB_ENV"])
    with github_env.open("a") as file:
        print(f"PIP_CACHE_DIR={directory}", file=file)


main()
