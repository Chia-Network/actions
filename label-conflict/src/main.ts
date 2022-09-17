import * as core from "@actions/core";
import * as github from "@actions/github";
import {checkConflict, getBranchName, isPullRequestBranch, refIsTag} from "./lib";
import {
  eventName,
  github_baseRef,
  github_headRef,
  github_ref,
  conflictStatusOutputKey,
} from "./env";
import {
  commentToAddOnClean,
  commentToAddOnConflict,
  labelToAddOnConflict,
  labelToRemoveOnConflict,
  secretToken,
  retryIntervalSec,
  retryMax,
} from "./input";

async function main() {
  core.info(`Event: ${eventName}`);
  
  if(eventName !== "push"
    && eventName !== "pull_request"
    && eventName !== "pull_request_target"
    && eventName !== "workflow_dispatch"
  ){
    core.info(`Skipping conflict check as the event(${eventName}) is not a target`);
    core.setOutput(conflictStatusOutputKey, {});
    return;
  }
  
  let currentRef = "";
  
  if(isPullRequestBranch(github_headRef, github_baseRef)){
    // If base/target branch is available, we assume that this action runs in pull request context.
    currentRef = getBranchName(github_headRef);
    core.info("Running on pull request context");
  }
  else if(!refIsTag(github_ref)){
    // If no base/target branch info is available, we are going to check conflict between
    // child branch which target this branch.
    // Since 
    currentRef = getBranchName(github_ref);
    core.info("Running on push context");
  }
  else{
    // When pushing a tag, do nothing.
    core.info("No action taken when pushing a tag");
    core.setOutput(conflictStatusOutputKey, {});
    return;
  }
  core.info(`Checking conflicts on this branch and branches whose target branch is: ${currentRef}`)
  
  const client = github.getOctokit(secretToken);
  
  const conflictStatus = await checkConflict({
    currentRef,
    client,
    commentToAddOnClean,
    commentToAddOnConflict,
    labelToAddOnConflict,
    labelToRemoveOnConflict,
    retryIntervalSec,
    retryMax,
  });
  
  core.setOutput(conflictStatusOutputKey, conflictStatus);
}

main().catch((error) => {
  core.error(String(error));
  core.setFailed(String(error.message));
});
