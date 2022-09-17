export const conflictStatusOutputKey = "conflictStatus";
export const commonErrorDetailedMessage = "Workflows can't access secrets and have read-only access to upstream when they are triggered by a pull request from a fork, [more information](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token)";
export const eventName = process.env.GITHUB_EVENT_NAME;
export const github_ref = process.env.GITHUB_REF || "";
export const github_baseRef = process.env.GITHUB_BASE_REF || "";
export const github_headRef = process.env.GITHUB_HEAD_REF || "";
