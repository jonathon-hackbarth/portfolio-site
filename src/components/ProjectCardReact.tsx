import { useState } from "react";
import type { ProjectData } from "../utils/projectUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faClone,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface ProjectCardProps extends ProjectData {
  homepage?: string; // Add homepage property to interface
}

export default function ProjectCardReact({
  name,
  description,
  html_url,
  homepage,
  languages,
  pushed_at,
}: ProjectCardProps) {
  const [copyStatus, setCopyStatus] = useState("Clone"); // Track button text state
  const gitCloneUrl = `git clone ${html_url}.git`;
  const updatedTime = new Date(pushed_at).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleCloneClick = async () => {
    try {
      await navigator.clipboard.writeText(gitCloneUrl);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Clone"), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("Failed to copy");
    }
  };

  return (
    <article className="project-card" aria-labelledby={`project-title-${name}`}>
      <div className="project-content">
        <h3 id={`project-title-${name}`} className="project-title">
          {name}
        </h3>
        <p className="project-description">
          {description || "No description available."}
        </p>

        <div
          className="project-buttons"
          role="group"
          aria-label="Project actions"
        >
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="project-button-tiertiary"
              aria-label={`Visit ${name} website`}
            >
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="mr-1"
                aria-hidden="true"
              />
              Site
            </a>
          )}
          <button
            className="project-button-primary"
            onClick={handleCloneClick}
            aria-label={`Copy git clone command for ${name}`}
          >
            <FontAwesomeIcon
              icon={faClone}
              className="mr-1"
              aria-hidden="true"
            />
            {copyStatus}
          </button>
          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-button-secondary"
            aria-label={`View ${name} repository on GitHub`}
          >
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="mr-1"
              aria-hidden="true"
            />
            Repo
          </a>
        </div>

        <hr className="project-divider" aria-hidden="true" />

        {languages && languages.length > 0 && (
          <div
            className="project-languages"
            role="list"
            aria-label="Project languages"
          >
            {languages.map((lang) => (
              <div key={lang.name} className="language-tag" role="listitem">
                <span className="language-name">{lang.name}</span>
                <span
                  className="language-percentage"
                  aria-label={`${lang.percentage}% ${lang.name}`}
                >
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}

        <footer className="project-footer">
          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${name} on GitHub`}
            className="github-link"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="github-icon"
              aria-hidden="true"
            />
          </a>
          <time className="update-time" dateTime={pushed_at}>
            Updated on {updatedTime}
          </time>
        </footer>
      </div>
    </article>
  );
}
