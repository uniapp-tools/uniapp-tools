import jiti from "file:///E:/github/miniapp-ci-cli/node_modules/.pnpm/jiti@1.21.0/node_modules/jiti/lib/index.js";

/** @type {import("E:/github/miniapp-ci-cli/src/index")} */
const _module = jiti(null, {
  "esmResolve": true,
  "interopDefault": true,
  "alias": {
    "miniapp-ci-cli": "E:/github/miniapp-ci-cli",
    "prompts": "prompts/lib/index.js"
  }
})("E:/github/miniapp-ci-cli/src/index.ts");

export const main = _module.main;