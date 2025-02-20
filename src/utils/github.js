// src/utils/github.js
const GITHUB_API_URL = "https://api.github.com";

export async function fetchRepos(username, token) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos?sort=updated&direction=desc`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const repos = await response.json();
  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    svn_url: repo.svn_url,
    stargazers_count: repo.stargazers_count,
    languages_url: repo.languages_url,
    pushed_at: repo.pushed_at,
  }));
}

export async function fetchLanguages(url, token) {
  const headers = { Authorization: `token ${token}` };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }

  return await response.json();
}
