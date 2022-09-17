import * as core from "@actions/core";
import type {Octokit} from "./lib";

export const OpenPullRequestsQuery = `
query openPullRequests($owner: String!, $repo: String!, $after: String, $baseRefName: String, $headRefName: String) {
  repository(owner:$owner, name: $repo) {
    pullRequests(first: 100, after: $after, states: OPEN, baseRefName: $baseRefName, headRefName: $headRefName) {
      nodes {
        headRefName
        mergeable
        number
        title
        updatedAt
        labels(first: 100) {
          nodes {
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
  `;

export interface PullRequestsNode {
  headRefName: string;
  mergeable: string;
  number: number;
  title: string;
  updatedAt: string;
  labels: {
    nodes: Array<{ name: string }>;
  };
}

export interface OpenPullRequestsResponse {
  repository: {
    pullRequests: {
      nodes: PullRequestsNode[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

export async function postOpenPullRequestsQuery(
  client: Octokit,
  params: {
    refName: string,
    searchRefType: "currentBranch" | "baseBranch",
    owner: string,
    repo: string,
  },
): Promise<PullRequestsNode[]> {
  const requestParams = {
    headRefName: params.searchRefType === "currentBranch" ? params.refName : undefined,
    baseRefName: params.searchRefType === "baseBranch" ? params.refName : undefined,
    owner: params.owner,
    repo: params.repo,
  };
  let start = Date.now();
  
  const onRejection = (err: {status: number, message: string}) => {
    core.info(`status: ${err.status}, message: ${err.message}, took: ${Date.now() - start} ms`);
    core.error("Failed to get GraphQL response");
    throw err;
  };
  
  core.info("Posting GraphQL request");
  core.info(JSON.stringify(requestParams, null, 2));
  start = Date.now();
  let response = await client.graphql<OpenPullRequestsResponse>(OpenPullRequestsQuery, requestParams)
    .catch(onRejection);
  core.info(`Request took ${Date.now() - start} ms`);
  
  if(!response){
    return [];
  }
  core.info(`Found ${response.repository.pullRequests.nodes.length} PRs`);
  
  let retVal = response.repository.pullRequests.nodes;
  
  while(response.repository.pullRequests.pageInfo.hasNextPage){
    const after: string = response.repository.pullRequests.pageInfo.endCursor;
    core.info(`GraphQL response has next page. Fetching next page from ${after}`);
  
    start = Date.now();
    response = await client.graphql<OpenPullRequestsResponse>(OpenPullRequestsQuery, {
      ...requestParams,
      after,
    }).catch(onRejection);
    core.info(`Request took ${Date.now() - start} ms`);
    
    if(!response){
      return [];
    }
    
    core.info(`Found ${response.repository.pullRequests.nodes.length} PRs`);
    retVal = retVal.concat(response.repository.pullRequests.nodes);
  }
  
  core.info(`Finished GraphQL query. Found total ${response.repository.pullRequests.nodes.length} PRs`);
  return retVal;
}
