import { useEffect, useState } from "react";
import type { ProjectData } from "../utils/projectUtils";
import { getProjectsData } from "../utils/projectUtils";
import { fetchRepos } from "../utils/github";
import ProjectCardReact from "./ProjectCardReact";
import React from "react";

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_GH_TOKEN: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_GH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export default function ProjectsIsland() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const username = "jonathon-hackbarth";
      const token = import.meta.env.PUBLIC_GH_TOKEN;
      try {
        console.log(
          "Fetching repos with token:",
          token ? "Token present" : "No token"
        );
        const repos = await fetchRepos(username, token);
        console.log("Fetched repos:", repos);

        const projectData = await getProjectsData(repos, token);
        console.log("Processed project data:", projectData);

        // Log specific details about each project
        projectData.forEach((project, index) => {
          console.log(`Project ${index + 1}:`, {
            name: project.name,
            description: project.description,
            languagesCount: project.languages?.length || 0,
            languages: project.languages,
          });
        });

        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        // Log more details about the error
        if (error instanceof Error) {
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return <div className="text-center">Loading projects...</div>;
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <div key={project.id} className="project-wrapper">
          <ProjectCardReact {...project} />
        </div>
      ))}
    </div>
  );
}
