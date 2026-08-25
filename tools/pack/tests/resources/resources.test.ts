import { describe, expect, it } from "vitest";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";

import { domToPptxBundleResource } from "@/dom-to-pptx-resource.js";
import { copyBundledResourceTrees } from "@/resources/index.js";

describe("domToPptxBundleResource", () => {
  it("derives the vendored bundle path from the workspace root, not the caller cwd", async () => {
    const root = await mkdtemp(join(tmpdir(), "open-design-tools-pack-resource-"));
    const workspaceRoot = join(root, "workspace");
    const callerCwd = join(root, "caller");
    const previousCwd = process.cwd();

    try {
      await mkdir(workspaceRoot, { recursive: true });
      await mkdir(callerCwd, { recursive: true });
      process.chdir(callerCwd);

      expect(domToPptxBundleResource({ workspaceRoot })).toEqual({
        from: join(workspaceRoot, "apps", "desktop", "vendor", "dom-to-pptx", "dom-to-pptx.bundle.js.gz"),
        to: "dom-to-pptx.bundle.js.gz",
      });
    } finally {
      process.chdir(previousCwd);
      await rm(root, { force: true, recursive: true });
    }
  });
});

describe("copyBundledResourceTrees", () => {
  it("includes daemon resources and the packaged Website Clone main path", async () => {
    const root = await mkdtemp(join(tmpdir(), "open-design-tools-pack-"));
    const workspaceRoot = join(root, "workspace");
    const resourceRoot = join(root, "resources");

    try {
      const promptTemplatePath = join(
        workspaceRoot,
        "prompt-templates",
        "image",
        "sample.json",
      );
      const designTemplatePath = join(
        workspaceRoot,
        "design-templates",
        "orbit-general",
        "SKILL.md",
      );
      const communityPetPath = join(
        workspaceRoot,
        "assets",
        "community-pets",
        "sample",
        "pet.json",
      );
      const communityRegistryPath = join(
        workspaceRoot,
        "plugins",
        "registry",
        "community",
        "open-design-marketplace.json",
      );
      const webCloneSkillPath = join(
        workspaceRoot,
        "skills",
        "web-clone",
        "SKILL.md",
      );
      const webCloneBrowserRuntimePath = join(
        workspaceRoot,
        "skills",
        "web-clone",
        "scripts",
        "lib",
        "system-browser.mjs",
      );
      await mkdir(join(workspaceRoot, "skills", "sample"), { recursive: true });
      await mkdir(dirname(webCloneBrowserRuntimePath), { recursive: true });
      await mkdir(join(workspaceRoot, "design-templates", "orbit-general"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "design-systems", "sample"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "craft", "sample"), { recursive: true });
      await mkdir(join(workspaceRoot, "plugins", "_official", "sample"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "plugins", "registry", "community"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "assets", "frames"), { recursive: true });
      await mkdir(join(workspaceRoot, "assets", "community-pets", "sample"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "prompt-templates", "image"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "data", "plugin-previews"), {
        recursive: true,
      });
      await writeFile(promptTemplatePath, "{\"id\":\"sample\"}\n", "utf8");
      await writeFile(webCloneSkillPath, "# Website Clone\n", "utf8");
      await writeFile(
        webCloneBrowserRuntimePath,
        "export const systemChromium = {};\n",
        "utf8",
      );
      await writeFile(
        join(workspaceRoot, "data", "plugin-previews", "manifest.json"),
        "{\"previews\":{}}\n",
        "utf8",
      );
      await writeFile(designTemplatePath, "# Orbit General\n", "utf8");
      await writeFile(communityPetPath, "{\"name\":\"sample\"}\n", "utf8");
      await writeFile(
        join(workspaceRoot, "plugins", "_official", "sample", "open-design.json"),
        "{\"id\":\"sample\"}\n",
        "utf8",
      );
      await writeFile(communityRegistryPath, "{\"plugins\":[]}\n", "utf8");

      await copyBundledResourceTrees({ workspaceRoot, resourceRoot });

      await expect(
        readFile(join(resourceRoot, "skills", "web-clone", "SKILL.md"), "utf8"),
      ).resolves.toBe("# Website Clone\n");
      await expect(
        readFile(
          join(
            resourceRoot,
            "skills",
            "web-clone",
            "scripts",
            "lib",
            "system-browser.mjs",
          ),
          "utf8",
        ),
      ).resolves.toBe("export const systemChromium = {};\n");

      await expect(
        readFile(
          join(resourceRoot, "prompt-templates", "image", "sample.json"),
          "utf8",
        ),
      ).resolves.toBe("{\"id\":\"sample\"}\n");
      await expect(
        readFile(
          join(resourceRoot, "data", "plugin-previews", "manifest.json"),
          "utf8",
        ),
      ).resolves.toBe("{\"previews\":{}}\n");
      await expect(
        readFile(
          join(resourceRoot, "design-templates", "orbit-general", "SKILL.md"),
          "utf8",
        ),
      ).resolves.toBe("# Orbit General\n");
      await expect(
        readFile(
          join(resourceRoot, "community-pets", "sample", "pet.json"),
          "utf8",
        ),
      ).resolves.toBe("{\"name\":\"sample\"}\n");
      await expect(
        readFile(
          join(resourceRoot, "plugins", "_official", "sample", "open-design.json"),
          "utf8",
        ),
      ).resolves.toBe("{\"id\":\"sample\"}\n");
      await expect(
        readFile(
          join(
            resourceRoot,
            "plugins",
            "registry",
            "community",
            "open-design-marketplace.json",
          ),
          "utf8",
        ),
      ).resolves.toBe("{\"plugins\":[]}\n");
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});
