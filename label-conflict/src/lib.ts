import * as github from "@actions/github";
import {getOctokit} from "@actions/github";
import * as core from "@actions/core";
import {postOpenPullRequestsQuery, PullRequestsNode} from "./query";
import {updateLabel} from "./label";

export type Octokit = ReturnType<typeof getOctokit>;

export function getBranchName(ref: string) {
  return ref.replace(/^refs\/heads\//, "");
}

export function isPullRequestBranch(github_head_ref: string, github_base_ref: string){
  return Boolean(github_head_ref && github_base_ref);
}

export function refIsTag(ref: string){
  return ref.startsWith("refs/tags/");
}

function sleep(sec: number): Promise<void> {
  return new Promise((resolve) => {
    if(sec < 0){
      sec = 0;
    }
    setTimeout(() => resolve(), sec*1000);
  });
}

export interface CheckConflictContext {
  currentRef: string;
  client: Octokit;
  commentToAddOnClean: string;
  commentToAddOnConflict: string;
  labelToAddOnConflict: string;
  labelToRemoveOnConflict: string;
  retryIntervalSec: number;
  retryMax: number;
}

export async function checkConflict(context: CheckConflictContext): Promise<Record<number, boolean>> {
  const {
    currentRef,
    client,
    commentToAddOnClean,
    commentToAddOnConflict,
    labelToAddOnConflict,
    labelToRemoveOnConflict,
    retryIntervalSec,
    retryMax,
  } = context;
  
  let pullRequests: PullRequestsNode[] = [];
  
  core.info("Searching conflict between base branch and this branch if base branch exists");
  let res = await postOpenPullRequestsQuery(client, {
    refName: currentRef,
    searchRefType: "currentBranch",
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });
  if(res.length > 0){
    pullRequests = pullRequests.concat(res);
  }
  else{
    core.info(`No base branch for ${currentRef} was found.`);
  }
  
  core.info("Searching conflict between this branch and branches which target this branch");
  res = await postOpenPullRequestsQuery(client, {
    refName: currentRef,
    searchRefType: "baseBranch",
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });
  pullRequests = pullRequests.concat(res);
  
  if (pullRequests.length === 0) {
    core.warning("Found no pull requests");
    return {};
  }
  
  core.info(`There are ${pullRequests.length} PRs to check conflicts`);
  let prsWithUnknownMergeableStatus = pullRequests.filter(pr => pr.mergeable === "UNKNOWN");
  pullRequests = pullRequests.filter(pr => pr.mergeable !== "UNKNOWN");
  core.info(`Number of PRs whose mergeable status is UNKNOWN: ${prsWithUnknownMergeableStatus.length}`);
  
  const conflictStatus: Record<number, boolean> = {};
  
  const labelTasks: Array<Promise<unknown>> = [];
  const checkMergeableStatusTasks: Array<Promise<PullRequestsNode[]>> = [];
  
  let currentTry = 0;
  while((pullRequests.length + prsWithUnknownMergeableStatus.length) > 0){
    core.info(`Retry loop #${currentTry}`);
    core.info(`There are ${pullRequests.length} PRs to update labels`);
    for(const pr of pullRequests){
      const prTitle = pr.title.length > 30 ? pr.title.substring(0, 30) + "..." : pr.title;
      core.info(`Updating label for PR#${pr.number} [${prTitle}]`);
      
      const task = updateLabel(
        conflictStatus,
        client,
        pr,
        labelToAddOnConflict,
        labelToRemoveOnConflict,
        commentToAddOnConflict,
        commentToAddOnClean,
      );
      labelTasks.push(task);
    }
    
    if(prsWithUnknownMergeableStatus.length === 0){
      core.info("There are no PRs with unknown mergeable status.");
      break;
    }
    else if(currentTry >= retryMax){
      core.warning(`Retry count reached a threshold(${retryMax})`);
      break;
    }
  
    for(let i=0; i<prsWithUnknownMergeableStatus.length; i++){
      const pr = prsWithUnknownMergeableStatus[i];
      core.info(`Checking mergeable status for PR#${pr.number} ${pr.headRefName}`);
      
      const task = postOpenPullRequestsQuery(client, {
        refName: pr.headRefName,
        searchRefType: "currentBranch", // When "currentBranch" only one PR should be returned.
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
      });
      checkMergeableStatusTasks.push(task);
    }
    
    pullRequests = [];
    const prResponses = await Promise.all(checkMergeableStatusTasks);
    for(let i=0; i<prResponses.length; i++){
      const res = prResponses[i];
      if(res.length === 0){
        // It's possible that some pull requests get closed while checking mergeable status.
        const pr = prsWithUnknownMergeableStatus[i];
        core.warning(`PR#${pr.number} might be closed during checking conflict`);
        continue;
      }
      else if(res.length > 1){
        throw new Error("Searching PR by headRef is expected to return only 1 PR.");
      }
      const pr = res[0];
      pullRequests.push(pr);
    }
    
    prsWithUnknownMergeableStatus = pullRequests.filter(pr => pr.mergeable === "UNKNOWN");
    pullRequests = pullRequests.filter(pr => pr.mergeable !== "UNKNOWN");
    core.info(`Number of PRs whose mergeable status is UNKNOWN: ${prsWithUnknownMergeableStatus.length}`);
    
    core.info(`Sleeping ${retryIntervalSec} sec`);
    await sleep(retryIntervalSec);
    currentTry++;
  }
  
  await Promise.all(labelTasks);
  core.info("Updating labels has been done");
  
  if(prsWithUnknownMergeableStatus.length > 0){
    core.error("There are PRs whose mergeable status left UNKNOWN");
    for(const pr of prsWithUnknownMergeableStatus){
      core.info(`  #${pr.number} (${pr.title})`);
    }
    throw new Error("Failed to check conflict");
  }
  
  return conflictStatus;
}
