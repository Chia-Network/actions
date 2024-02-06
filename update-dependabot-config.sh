#!/bin/bash

set -o errexit -o pipefail

file=.github/dependabot.yml

yq eval -i 'del(.updates[] | select(. | headComment == "generated"))' "$file"

for action in $(git ls-files | sed -n 's;/action.yml$;;p')
do
  export action="$action"
  echo processing: $action
  yq eval -i '.updates += (.updates | filter(.directory == "/") | with(.[]; .directory = env(action))) | .updates.[-1] head_comment= "generated"' "$file"
done

git diff --exit-code --quiet "$file"
