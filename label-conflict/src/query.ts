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

export interface GitHubContextPayloadPullRequest {
  number: number;
  html_url?: string;
  body?: string;
  head: {
    ref: string;
    repo: {
      name: string;
      owner: {
        login: string;
      };
    }
  }
}

export async function postOpenPullRequestsQuery(
  client: Octokit,
  params: {
    refName: string,
    searchRefType: "currentBranch" | "baseBranch",
    repo: {owner: string; repo: string},
    triggeringHead: { login: string; ref: string },
  },
): Promise<PullRequestsNode[]> {
  const {repo, triggeringHead} = params;
  
  const isTriggeringRef = (login: string, headRefName: string) => {
    return login === triggeringHead.login && headRefName === triggeringHead.ref;
  };
  
  const requestParams = {
    headRefName: params.searchRefType === "currentBranch" ? params.refName : undefined,
    baseRefName: params.searchRefType === "baseBranch" ? params.refName : undefined,
    owner: repo.owner,
    repo: repo.repo,
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
  
  // When searching PRs by headRefName, usually it returns only 1 PR.
  // But there are cases where unintended PRs are returned because of the same branch name.
  // i.e. When a user wants to check conflict for a PR whose headRef is `main`,
  // it's possible that the GraphQL query returns 2 branches with the same name but from different repositories
  // (For example, OriginalRepos:main and ForkedRepos:main).
  // The code below will eliminate non-eligible PRs.
  const filterPullRequests = (nodes: PullRequestsNode[]) => {
    if (params.searchRefType === "currentBranch") {
      const prevLen = nodes.length;
      const prNodes = nodes.filter(n => {
        if (!n.headRepository) {
          // Usually this may not happen.
          return true;
        }
        if (!isTriggeringRef(n.headRepository.owner.login, n.headRefName)) {
          core.info(`PR#${n.number} from ${n.headRepository.owner.login}:${n.headRefName} is filtered out.`);
          return false;
        }
        return true;
      });
      if (prevLen > prNodes.length) {
        core.info(`The eligible branch for the target PR is ${triggeringHead.login}:${triggeringHead.ref}`);
      }
      return prNodes;
    }
    return nodes;
  };
  response.repository.pullRequests.nodes = filterPullRequests(response.repository.pullRequests.nodes);
  
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
  
    response.repository.pullRequests.nodes = filterPullRequests(response.repository.pullRequests.nodes);
  
    core.info(`Found ${response.repository.pullRequests.nodes.length} PRs`);
    retVal = retVal.concat(response.repository.pullRequests.nodes);
  }
  
  core.info(`Finished GraphQL query. Found total ${retVal.length} PRs`);
  return retVal;
}
