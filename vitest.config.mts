import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";
import { parse } from "dotenv";

export default defineConfig({
  test: {
    // carrega o .env.test ANTES de qualquer import, para nunca tocar no banco de desenvolvimento
    env: parse(readFileSync(".env.test")),
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: false, // os arquivos de teste compartilham o mesmo banco
  },
});
