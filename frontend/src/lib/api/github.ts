import { GitHubProfile, GitHubRepo } from "../../types";
import { GITHUB_USERNAME } from "../constants";

export async function fetchGitHubProfile(username: string = GITHUB_USERNAME): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchGitHubRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
