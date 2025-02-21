import { useEffect, useState } from "react";
import type { ProjectData } from "../utils/projectUtils";
import ProjectCardReact from "./ProjectCardReact";
import React from "react";

const GITHUB_API_ENDPOINT = "/api/github"; // Correct API endpoint path

export default function ProjectsIsland() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects...");
        const response = await fetch(GITHUB_API_ENDPOINT);
        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error response:", errorData);
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }

        console.log("Received projects:", data.length);
        setProjects(data);
      } catch (error) {
        console.error("Detailed error in component:", {
          message: error instanceof Error ? error.message : "Unknown error",
          error,
        });
        setError(
          error instanceof Error ? error.message : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="projects-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="project-wrapper">
          <ProjectCardReact {...project} />
        </div>
      ))}
    </div>
  );
}
