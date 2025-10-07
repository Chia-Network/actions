#!/usr/bin/env bash
set -o errexit

echo "Path is $PATH"
echo "Github Path is $GITHUB_PATH"

$PYTHON_SHIM --version
