import enum
import os
import pathlib
import shutil
import sys
from typing import Mapping, Sequence


class Mode(enum.Enum):
    setuptools = "setuptools"
    poetry = "poetry"


env_var: Mapping[Mode, str] = {
    Mode.setuptools: "PIP_CACHE_DIR",
    Mode.poetry: "POETRY_CACHE_DIR",
}


def main(args: Sequence[str]) -> None:
    mode = Mode[args[0]]

    pre_delete = os.environ["PRE_DELETE"] == "true"
    directory = pathlib.Path(
        os.environ["RUNNER_TEMP"],
        f".chia-network-actions-cache-{mode.value}",
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
        print(f"{env_var[mode]}={directory}", file=file)


main(sys.argv[1:])
