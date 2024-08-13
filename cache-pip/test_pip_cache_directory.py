import enum
import os
import pathlib
import subprocess
import sys
from typing import Sequence


class Mode(enum.Enum):
    setuptools = "setuptools"
    poetry = "poetry"


def main(args: Sequence[str]) -> None:
    mode = Mode[args[0]]

    reference_path = pathlib.Path(os.environ["RUNNER_TEMP"])

    if mode == Mode.setuptools:
        completed_process = subprocess.run(
            args=["pip", "cache", "dir"],
            check=True,
            stdout=subprocess.PIPE,
            encoding="utf-8",
        )
        cache_path = pathlib.Path(completed_process.stdout.strip())
    elif mode == Mode.poetry:
        # TODO: implement a poetry command to report the cache directories
        cache_path = pathlib.Path(os.environ["POETRY_CACHE_DIR"])

    assert (
        reference_path.is_absolute()
    ), f"reference path is not absolute: {reference_path!r}"
    assert cache_path.is_absolute(), f"cache path is not absolute: {cache_path!r}"
    assert cache_path.exists(), f"cache path does not exist: {cache_path!r}"
    assert (
        cache_path.is_dir()
    ), f"cache path exists but is not a directory: {cache_path!r}"
    cache_path.relative_to(reference_path)


main(sys.argv[1:])
