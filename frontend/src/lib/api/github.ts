import { GitHubProfile, GitHubRepo } from "../../types";
import { GITHUB_USERNAME } from "../constants";

export async function fetchGitHubProfile(username: string = GITHUB_USERNAME): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`/api/github/profile?username=${encodeURIComponent(username)}`);
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchGitHubRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(`/api/github/repos?username=${encodeURIComponent(username)}`);
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch {
    return [];
  }
}
