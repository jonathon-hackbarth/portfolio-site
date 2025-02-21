interface ImportMetaEnv {
  readonly GH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import type { APIRoute } from "astro";
import { getProjectsData } from "../../utils/projectUtils";

const fetchGitHubRepos = async (username: string, token: string) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  return response.json();
};

export const GET: APIRoute = async () => {
  const token = import.meta.env.GH_TOKEN;

  if (!token) {
    return new Response(
      JSON.stringify({ message: "GitHub token not configured" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const username = "jonathon-hackbarth"; // Your GitHub username
    const repos = await fetchGitHubRepos(username, token);
    const projectsData = await getProjectsData(repos, token);

    return new Response(JSON.stringify(projectsData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch GitHub data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
