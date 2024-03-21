import os
import pathlib
import subprocess


def main() -> None:
    reference_path = pathlib.Path(os.environ["REFERENCE_PATH"])
    completed_process = subprocess.run(
        args=["pip", "cache", "dir"],
        check=True,
        stdout=subprocess.PIPE,
        encoding="utf-8",
    )
    pip_cache_path = pathlib.Path(completed_process.stdout.strip())

    assert reference_path.is_absolute(), f"reference path is not absolute: {reference_path!r}"
    assert pip_cache_path.is_absolute(), f"pip cache path is not absolute: {pip_cache_path!r}"
    assert pip_cache_path.exists(), f"pip cache path does not exist: {pip_cache_path!r}"
    assert pip_cache_path.is_dir(), f"pip cache path exists but is not a directory: {pip_cache_path!r}"
    pip_cache_path.relative_to(reference_path)


main()
