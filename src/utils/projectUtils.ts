// Define proper types for GitHub API responses
export interface GitHubLanguages {
  [key: string]: number;
}

export interface Language {
  name: string;
  percentage: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  languages_url: string;
  pushed_at: string;
}

export interface ProjectData extends Repository {
  languages: Language[];
}

// Moved fetchLanguages here to avoid circular dependencies
async function fetchLanguages(
  url: string,
  token: string
): Promise<GitHubLanguages> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }

  return response.json();
}

export async function getProjectsData(
  repos: Repository[],
  token: string
): Promise<ProjectData[]> {
  if (!token) {
    throw new Error("GitHub token is required");
  }

  try {
    return await Promise.all(
      repos.map(async (repo) => {
        const languages = await fetchLanguages(repo.languages_url, token);
        const totalBytes = Object.values(languages).reduce(
          (acc, bytes) => acc + bytes,
          0
        );

        const languagePercentages = Object.entries(languages).map(
          ([lang, bytes]) => ({
            name: lang,
            percentage: ((bytes / totalBytes) * 100).toFixed(1),
          })
        );

        return {
          ...repo,
          languages: languagePercentages,
        };
      })
    );
  } catch (error) {
    console.error("Error processing project data:", error);
    throw error; // Re-throw to handle in the component
  }
}
