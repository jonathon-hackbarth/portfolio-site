import { fetchLanguages } from "./github";

interface Language {
  name: string;
  percentage: string;
}

interface Repository {
  languages_url: string;
  [key: string]: any;
}

export interface ProjectData extends Repository {
  languages: Language[];
}

export async function getProjectsData(
  repos: Repository[],
  token: string
): Promise<ProjectData[]> {
  try {
    return await Promise.all(
      repos.map(async (repo) => {
        const languages = await fetchLanguages(repo.languages_url, token);
        const totalBytes = (Object.values(languages) as number[]).reduce(
          (acc: number, bytes: number) => acc + bytes,
          0
        );
        const languagePercentages = Object.entries(languages).map(
          ([lang, bytes]) => ({
            name: lang,
            percentage: ((Number(bytes) / totalBytes) * 100).toFixed(1),
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
    return [];
  }
}
