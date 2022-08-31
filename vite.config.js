import { defineConfig } from "vite";

const port = 3000;

export default defineConfig({
  server: {
    port,
    hmr: resolveHMR(),
  },
});

function resolveHMR() {
  if (process.env.GITPOD_WORKSPACE_URL) {
    return {
      // removes the protocol and replaces it with the port we're connecting to
      host: process.env.GITPOD_WORKSPACE_URL.replace("https://", `${port}-`),
      protocol: "wss",
      clientPort: 443,
    };
  }

  if (process.env.CODESPACES) {
    return {
      host: `${process.env.CODESPACE_NAME}-${port}.githubpreview.dev`,
      protocol: "wss",
      clientPort: 443,
    };
  }

  return true;
}
