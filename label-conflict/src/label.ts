import {context} from "@actions/github";
import * as core from "@actions/core";
import {Octokit} from "./lib";
import {ignorePermissionError} from "./input";
import type {RestEndpointMethods} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import {PullRequestsNode} from "./query";
import {commonErrorDetailedMessage} from "./env";

type RestErrorResponse = {
  status: number;
  message: string;
}

export function isMissingPermission(error: RestErrorResponse){
  return (error.status === 403 || error.status === 404)
    && error.message.endsWith("Resource not accessible by integration");
}

export async function addLabel(
  labelName: string,
  pr: PullRequestsNode,
  client: Octokit,
): Promise<boolean> {
  const hasLabel = pr.labels.nodes.some(label => label.name === labelName);
  if(hasLabel){
    core.info(`[Skip] PR#${pr.number} already has label '${labelName}'. No need to add.`);
    return false;
  }
  
  return client.rest.issues
    .addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      labels: [labelName],
    })
    .then(
      () => {
        core.info(`[Success] Added label "${labelName}" to PR#${pr.number}`);
        return true;
      },
      (error: RestErrorResponse) => {
        if(isMissingPermission(error) && ignorePermissionError){
          core.warning(`  [Failure] Could not add label "${labelName}": ${commonErrorDetailedMessage}`);
          return false;
        }
        
        throw new Error(`Error adding "${labelName}": ${error}`);
      }
    );
}

export async function removeLabel(
  labelName: string,
  pr: PullRequestsNode,
  client: Octokit,
): Promise<boolean> {
  const hasLabel = pr.labels.nodes.some(label => label.name === labelName);
  if(!hasLabel){
    core.info(`[Skip] PR#${pr.number} does not have label '${labelName}'. No need to remove.`);
    return false;
  }
  
  return client.rest.issues
    .removeLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      name: labelName,
    })
    .then(
      () => {
        core.info(`[Success] Removed label "${labelName}" from PR#${pr.number}`);
        return true;
      },
      (error: RestErrorResponse) => {
        if(isMissingPermission(error) && ignorePermissionError){
          core.warning(`[Failure] Could not remove label "${labelName}" for PR#${pr.number}: ${commonErrorDetailedMessage}`);
          return false;
        }
        else if(error.status === 404){
          core.info(
            `[Skip] On #${pr.number} label "${labelName}" doesn't need to be removed since it doesn't exist on that issue.`
          );
          return false;
        }
        
        throw new Error(`Error removing "${labelName}": ${error}`);
      }
    );
}

export async function addComment(
  comment: string,
  pr: PullRequestsNode,
  client: Octokit,
): Promise<void> {
  const restEndPointMethods: RestEndpointMethods = client.rest;
  // Originally this was `client.rest.issues.createComment({...})` but
  // since some IDE could not recognize the valid type, I added the type info like this.
  return restEndPointMethods.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: pr.number,
    body: comment,
  }).then(
    () => {
      core.info(`[Success] Created a comment for PR#${pr.number}`);
      return;
    },
    (error: RestErrorResponse) => {
      if(isMissingPermission(error) && ignorePermissionError){
        core.warning(`[Failure] Couldn't add comment to PR#${pr.number}: ${commonErrorDetailedMessage}`);
        return;
      }
      
      throw new Error(`Error adding "${comment}": ${error}`);
    },
  );
}

export async function updateLabel(
  conflictStatuses: Record<number, boolean>,
  client: Octokit,
  pr: PullRequestsNode,
  labelToAddOnConflict: string,
  labelToRemoveOnConflict: string,
  commentToAddOnConflict: string,
  commentToAddOnClean: string,
){
  core.debug(JSON.stringify(pr, null, 2));
  
  const log = (message: string, debug?: boolean) => {
    if(debug){
      core.debug(`${message} for PR#${pr.number}`);
    }
    else{
      core.info(`${message} for PR#${pr.number}`);
    }
  };
  
  switch (pr.mergeable) {
    case "CONFLICTING": {
      const removeLabelInfo = labelToRemoveOnConflict ? `, removing label "${labelToRemoveOnConflict}"` : "";
      log(`Adding label "${labelToAddOnConflict}"` + removeLabelInfo, true);
      
      // for labels PRs and issues are the same
      const tasks: Array<Promise<boolean>> = [addLabel(labelToAddOnConflict, pr, client)];
      if(labelToRemoveOnConflict){
        tasks.push(removeLabel(labelToRemoveOnConflict, pr, client));
      }
      
      const [addedDirtyLabel] = await Promise.all(tasks);
      if (commentToAddOnConflict && addedDirtyLabel) {
        await addComment(commentToAddOnConflict, pr, client);
      }
      
      conflictStatuses[pr.number] = true;
      break;
    }
    case "MERGEABLE": {
      log(`Removing label "${labelToAddOnConflict}"`, true);
      
      const removedDirtyLabel = await removeLabel(
        labelToAddOnConflict,
        pr,
        client,
      );
      if (commentToAddOnClean && removedDirtyLabel) {
        await addComment(commentToAddOnClean, pr, client);
      }
      
      // while we removed a particular label once we enter "CONFLICTING"
      // we don't add it again because we assume that the labelToRemoveOnConflict
      // is used to mark a PR as "merge!".
      // So we basically require a manual review pass after rebase.
      conflictStatuses[pr.number] = false;
      break;
    }
    case "UNKNOWN":
      log("Encountered a pull request whose mergeable status is UNKNOWN. Skipping.");
      break;
    default:
      throw new TypeError(`unhandled mergeable state '${pr.mergeable}'`);
  }
}
