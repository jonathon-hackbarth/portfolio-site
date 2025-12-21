#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
config({ path: join(__dirname, "../.env") });

const GIST_ID = "e125205972dd01bdcf6729c6960fe50c";
const resumePath = join(__dirname, "../public/resume.json");

async function updateGist() {
  try {
    // Read the resume file
    const resumeContent = readFileSync(resumePath, "utf-8");

    // GitHub API endpoint
    const url = `https://api.github.com/gists/${GIST_ID}`;

    // Get GitHub token from environment
    const token = process.env.GH_GIST_TOKEN;
    if (!token) {
      console.error("❌ GH_GIST_TOKEN environment variable not set");
      console.error("Add to .env: GH_GIST_TOKEN=ghp_...");
      process.exit(1);
    }

    // Update the gist
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          "resume.json": {
            content: resumeContent,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Failed to update gist: ${response.status}`);
      // Log detailed error only in development
      if (process.env.NODE_ENV !== "production") {
        console.error("Details:", errorBody);
      }
      process.exit(1);
    }

    const result = await response.json() as any;
    console.log(`✅ Gist updated successfully!`);
    console.log(`📝 View: ${result.html_url}`);
    console.log(`🔄 Registry will update in a few moments...`);
  } catch (error) {
    console.error("❌ Error updating gist:", error);
    process.exit(1);
  }
}

updateGist();
