import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache directory - should be .gitignored
const CACHE_DIR = join(__dirname, "../../.cache");
const PROJECTS_CACHE_FILE = join(CACHE_DIR, "projects.json");
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Reads data from cache if it exists and is still valid
 */
export function readCache<T>(fileName: string): T | null {
  const filePath = join(CACHE_DIR, fileName);
  try {
    if (!existsSync(filePath)) {
      return null;
    }

    const content = readFileSync(filePath, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(content);
    
    // Check if cache is still valid
    const now = Date.now();
    if (now - entry.timestamp > CACHE_MAX_AGE_MS) {
      return null;
    }

    return entry.data;
  } catch (error) {
    // If cache is corrupted or unreadable, return null
    return null;
  }
}

/**
 * Writes data to cache
 */
export function writeCache<T>(fileName: string, data: T): void {
  try {
    // Create cache directory if it doesn't exist
    if (!existsSync(CACHE_DIR)) {
      mkdirSync(CACHE_DIR, { recursive: true });
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };

    writeFileSync(
      join(CACHE_DIR, fileName),
      JSON.stringify(entry, null, 2),
      "utf-8"
    );
  } catch (error) {
    // Fail silently - cache is not critical
    console.warn("Failed to write cache:", error);
  }
}

/**
 * Reads projects cache
 */
export function readProjectsCache<T>(): T | null {
  return readCache<T>("projects.json");
}

/**
 * Writes projects cache
 */
export function writeProjectsCache<T>(data: T): void {
  writeCache("projects.json", data);
}
