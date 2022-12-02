import * as core from "@actions/core";
import type {Octokit} from "./lib";

export const OpenPullRequestsQuery = `
query openPullRequests($owner: String!, $repo: String!, $after: String, $baseRefName: String, $headRefName: String) {
  repository(owner:$owner, name: $repo) {
    pullRequests(first: 100, after: $after, states: OPEN, baseRefName: $baseRefName, headRefName: $headRefName) {
      nodes {
        headRefName
        headRepository {
          owner {
            login
          }
        }
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
  headRepository: null | {
    owner: {
      login: string;
    };
  };
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
  
  const queryId = params.searchRefType === "currentBranch" ?
    `headRef=${requestParams.headRefName}` : `baseRef=${requestParams.baseRefName}`;
  core.info("Posting GraphQL request for " + queryId);
  core.debug(JSON.stringify(requestParams, null, 2));
  start = Date.now();
  let response = await client.graphql<OpenPullRequestsResponse>(OpenPullRequestsQuery, requestParams)
    .catch(onRejection);
  core.info(`Request took ${Date.now() - start} ms for ${queryId}`);
  
  if(!response){
    return [];
  }
  
  if(params.searchRefType === "currentBranch"){
    // This eliminates external branches whose headRefName is the same as `param.refName`.
    // We aren't interested in conflicts between external branch and branches whose target is the external branch.
    // By the code below, pullRequests with branches whose owner does not match the pullRequest repository owner
    // will be eliminated.
    response.repository.pullRequests.nodes = response.repository.pullRequests.nodes.filter(n => {
      return n.headRepository && n.headRepository.owner.login === requestParams.owner;
    });
  }
  
  core.info(`Found ${response.repository.pullRequests.nodes.length} PRs for ${queryId}`);
  
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
  
    if(params.searchRefType === "currentBranch"){
      response.repository.pullRequests.nodes = response.repository.pullRequests.nodes.filter(n => {
        return n.headRepository && n.headRepository.owner.login === requestParams.owner;
      });
    }
    
    core.info(`Found ${response.repository.pullRequests.nodes.length} PRs`);
    retVal = retVal.concat(response.repository.pullRequests.nodes);
  }
  
  core.info(`Finished GraphQL query. Found total ${retVal.length} PRs`);
  return retVal;
}
