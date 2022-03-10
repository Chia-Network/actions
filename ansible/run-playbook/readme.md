# Ansible Run Playbook

Runs an ansible playbook against an inventory of hosts

## Example Usage

```yaml
- uses: Chia-Network/actions/ansible/run-playbook@main
with:
  ansible_dir: ansible
  playbook_file: playbook.yml
  inventory_file: inventory.dynamic.yml
  remote_user: ubuntu
```

### Parameters

`ansible_dir` Path to the ansible directory that contains the playbook, roles, inventory file, etc

`playbook_file` Path within the `ansible_dir` for the playbook yaml file

`inventory_file` Path within the `ansible_dir` that contains the host inventory

`remote_user` The user ansible should use when making connections to remote hosts

`private_key_file` (Optional) The location of the private key file to use for ssh connections. If not provided, defaults to `~/.ssh/id_rsa`

`extra_vars_file` (Optional) The location within `ansible_dir` of a file that contains extra ansible variables. This file will be passed to ansible with `--extra-vars "@${{ inputs.extra_vars_file }}"`

`ansible_galaxy_roles` (Optional) Ansible galaxy roles to install before running the playbook. Space separated list of role names.

`ansible_galaxy_collections` (Optional) Ansible galaxy collections to install before running the playbook. Space separate list of collection names

`limit_hosts` (Optional) Optional set of hosts to limit the ansible run to. Passed with `--limit` when running ansible
