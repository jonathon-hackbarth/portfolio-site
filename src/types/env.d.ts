interface ImportMetaEnv {
  readonly GH_DEV_TOKEN?: string;
  readonly GH_GIST_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
