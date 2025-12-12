# Docker build

```yaml
permissions:
  id-token: write
  contents: read
  packages: write

jobs:
  package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      # Some pre-work

      - name: Package
        uses: Chia-Network/actions/docker/remote-arm-build@main
        with:
          # Make sure to quote this if your account ID starts with a zero
          aws_account_id: "012345678910"
          aws_role: github-buildx-remote
          aws_region: us-west-2
          aws_vpc_id: vpc-abcd1234
          aws_subnet_id: subnet-abcd1234
          aws_keypair_name: SSHKeyPairInEC2
```

## Prerequisites

This requires an AWS account with an ARM64 AMI present in the account that this action can launch. The AMI must start
buildkitd on boot and it must be configured to accept remote connections on port 1234. A security group will be created
that only allows inbound connections from the public IP of the runner that is running the job.
