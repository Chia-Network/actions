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
  
  core.info(`Searching conflict between base branch and this branch(${currentRef}) if base branch exists`);
  // If pushing to a non-PR branch (main, master, ...), this returns empty array.
  let prsOfThisBranch = await postOpenPullRequestsQuery(client, {
    refName: currentRef,
    searchRefType: "currentBranch",
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });
  if(prsOfThisBranch.length <= 0){
    core.info(`No base branch for ${currentRef} was found.`);
  }
  
  core.info(`Searching conflict between this branch(${currentRef}) and branches which target this branch`);
  let prsOfChildBranch = await postOpenPullRequestsQuery(client, {
    refName: currentRef,
    searchRefType: "baseBranch",
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });
  
  if (prsOfThisBranch.length === 0 && prsOfChildBranch.length === 0) {
    core.warning("Found no pull requests associated with this branch");
    return {};
  }
  
  core.info(`There are ${prsOfThisBranch.length} + ${prsOfChildBranch.length} PRs to check conflicts`);
  let prsOfThisBranchUnknown = prsOfThisBranch.filter(pr => pr.mergeable === "UNKNOWN");
  let prsOfChildBranchUnknown = prsOfChildBranch.filter(pr => pr.mergeable === "UNKNOWN");
  prsOfThisBranch = prsOfThisBranch.filter(pr => pr.mergeable !== "UNKNOWN");
  prsOfChildBranch = prsOfChildBranch.filter(pr => pr.mergeable !== "UNKNOWN");
  core.info(`Number of PRs whose mergeable status is UNKNOWN: ${prsOfThisBranchUnknown.length} + ${prsOfChildBranchUnknown.length}`);
  
  const conflictStatus: Record<number, boolean> = {};
  
  const labelTasks: Array<Promise<unknown>> = [];
  const finishedPRs = new Set<string>();
  
  let currentTry = 0;
  while(
    (prsOfThisBranch.length + prsOfChildBranch.length + prsOfThisBranchUnknown.length + prsOfChildBranchUnknown.length) > 0
  ){
    core.info(`Retry loop #${currentTry}`);
    core.info(`There are ${prsOfThisBranch.length + prsOfChildBranch.length} PRs to update labels`);
    const prsToUpdateLabel = ([] as PullRequestsNode[]).concat(prsOfThisBranch, prsOfChildBranch);
    for(let i=0; i<prsToUpdateLabel.length; i++){
      const pr = prsToUpdateLabel[i];
      
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
      finishedPRs.add(pr.headRefName);
    }
    
    if(prsOfThisBranchUnknown.length + prsOfChildBranchUnknown.length === 0){
      core.info("There are no PRs with unknown mergeable status.");
      break;
    }
    else if(currentTry >= retryMax){
      core.warning(`Retry count reached a threshold(${retryMax})`);
      break;
    }
  
    let checkConflictBetweenParentAndThisBranch: Promise<PullRequestsNode[]>|null = null;
    let checkConflictBetweenThisAndChildBranches: Promise<PullRequestsNode[]>|null = null;
  
    // prsOfThisBranchUnknown.length should be 0 or 1.
    if(prsOfThisBranchUnknown.length > 1){
      throw new Error(`Multiple base branches have been reported for a single branch(${currentRef})`);
    }
    else if(prsOfThisBranchUnknown.length === 1){
      const pr = prsOfThisBranchUnknown[0];
      core.info(`Searching conflict between base branch and this branch(${currentRef}) if base branch exists`);
  
      checkConflictBetweenParentAndThisBranch = postOpenPullRequestsQuery(client, {
        refName: pr.headRefName,
        searchRefType: "currentBranch", // When "currentBranch" only one PR should be returned.
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
      });
    }
  
    if(prsOfChildBranchUnknown.length > 0){
      core.info(`Searching conflict between this branch(${currentRef}) and branches which target this branch`);
  
      checkConflictBetweenThisAndChildBranches = postOpenPullRequestsQuery(client, {
        refName: currentRef,
        searchRefType: "baseBranch",
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
      });
    }
  
    prsOfThisBranch = [];
    prsOfThisBranchUnknown = [];
    prsOfChildBranch = [];
    prsOfChildBranchUnknown = [];
    
    if(checkConflictBetweenParentAndThisBranch){
      const response = await checkConflictBetweenParentAndThisBranch;
      if(response.length === 0){
        core.warning(`Branch${currentRef} might be removed during checking conflict`);
      }
      else if(response.length > 1){
        throw new Error("Searching PR by headRef is expected to return only 1 PR.");
      }
      
      const pr = response[0];
      if(finishedPRs.has(pr.headRefName)){
        continue;
      }
  
      if(pr.mergeable === "UNKNOWN"){
        prsOfThisBranchUnknown.push(pr);
      }
      else{
        prsOfThisBranch.push(pr);
      }
    }
    
    if(checkConflictBetweenThisAndChildBranches){
      const response = await checkConflictBetweenThisAndChildBranches;
      for(let i=0;i<response.length;i++){
        const pr = response[i];
        if(finishedPRs.has(pr.headRefName)){
          continue;
        }
        
        if(pr.mergeable === "UNKNOWN"){
          prsOfChildBranchUnknown.push(pr);
        }
        else{
          prsOfChildBranch.push(pr);
        }
      }
    }
    
    core.info(
      `Number of PRs whose mergeable status is UNKNOWN: ${prsOfThisBranchUnknown.length} + ${prsOfChildBranchUnknown.length}`
    );
    
    core.info(`Sleeping ${retryIntervalSec} sec`);
    await sleep(retryIntervalSec);
    currentTry++;
  }
  
  await Promise.all(labelTasks);
  core.info("Updating labels has been done");
  
  if(prsOfThisBranchUnknown.length + prsOfChildBranchUnknown.length > 0){
    core.error("There are PRs whose mergeable status left UNKNOWN");
    const prs = ([] as PullRequestsNode[]).concat(prsOfThisBranchUnknown, prsOfChildBranchUnknown);
    for(let i=0;i<prs.length;i++){
      const pr = prs[i];
      core.info(`  #${pr.number} (${pr.title})`);
    }
    throw new Error("Failed to check conflict");
  }
  
  return conflictStatus;
}
