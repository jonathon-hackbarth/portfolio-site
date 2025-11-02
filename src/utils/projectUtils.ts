// Define proper types for GitHub API responses
export interface GitHubLanguages {
  readonly [key: string]: number;
}

export interface Language {
  readonly name: string;
  readonly percentage: string;
}

export interface Repository {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly html_url: string;
  readonly languages_url: string;
  readonly pushed_at: string;
  readonly homepage?: string | null;
  readonly fork?: boolean;
}

export interface ProjectData extends Repository {
  readonly languages: ReadonlyArray<Language>;
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

/**
 * Fetches and enriches GitHub repository data with language percentages
 */
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
