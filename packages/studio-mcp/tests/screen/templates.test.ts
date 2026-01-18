/**
 * Screen Templates Tests
 * TDD tests for screen template generation functions
 *
 * @module tests/screen/templates.test
 */

import { describe, it, expect } from "vitest";
import {
  toPascalCase,
  pathToComponentName,
  generateNextAppTemplate,
  generateNextPagesTemplate,
  generateViteTemplate,
  getArchetypeClassName,
  generateComponentCode,
  generateComponentImport,
  generateLinkCode,
  generateLinkImport,
  applyArchetypeToContent,
  insertComponentIntoContent,
  insertLinkIntoContent,
} from "../../src/screen/index.js";
import type { ArchetypeName } from "../../src/screen/index.js";

describe("Screen Templates", () => {
  describe("toPascalCase", () => {
    it("should convert kebab-case to PascalCase", () => {
      expect(toPascalCase("user-profile")).toBe("UserProfile");
      expect(toPascalCase("my-component-name")).toBe("MyComponentName");
    });

    it("should handle single word", () => {
      expect(toPascalCase("dashboard")).toBe("Dashboard");
    });

    it("should handle empty string", () => {
      expect(toPascalCase("")).toBe("");
    });
  });

  describe("pathToComponentName", () => {
    it("should convert path to PascalCase component name", () => {
      expect(pathToComponentName("/users/profile")).toBe("UsersProfile");
      expect(pathToComponentName("/dashboard")).toBe("Dashboard");
    });

    it("should handle path without leading slash", () => {
      expect(pathToComponentName("users/profile")).toBe("UsersProfile");
    });

    it("should handle empty path", () => {
      expect(pathToComponentName("")).toBe("");
      expect(pathToComponentName("/")).toBe("");
    });
  });

  describe("generateNextAppTemplate", () => {
    it("should generate basic Next.js App Router template", () => {
      const template = generateNextAppTemplate(
        "user-profile",
        "User profile page with avatar",
        "/users/profile"
      );

      expect(template).toContain("'use client'");
      expect(template).toContain("UserProfilePage");
      expect(template).toContain("export default function");
      expect(template).toContain("Route: /users/profile");
    });

    it("should include archetype class when provided", () => {
      const template = generateNextAppTemplate(
        "dashboard",
        "Dashboard with stats",
        "/dashboard",
        "Professional"
      );

      expect(template).toContain("archetype-professional");
    });

    it("should not include archetype class when not provided", () => {
      const template = generateNextAppTemplate(
        "dashboard",
        "Dashboard with stats",
        "/dashboard"
      );

      expect(template).not.toContain("archetype-");
    });
  });

  describe("generateNextPagesTemplate", () => {
    it("should generate basic Next.js Pages Router template", () => {
      const template = generateNextPagesTemplate(
        "settings",
        "User settings page",
        "/settings"
      );

      expect(template).not.toContain("'use client'");
      expect(template).toContain("SettingsPage");
      expect(template).toContain("export default function");
    });

    it("should include archetype class when provided", () => {
      const template = generateNextPagesTemplate(
        "settings",
        "Settings page",
        "/settings",
        "Minimal"
      );

      expect(template).toContain("archetype-minimal");
    });
  });

  describe("generateViteTemplate", () => {
    it("should generate basic Vite template", () => {
      const template = generateViteTemplate(
        "about",
        "About page",
        "/about"
      );

      expect(template).not.toContain("'use client'");
      expect(template).toContain("AboutPage");
      expect(template).toContain("export default function");
    });

    it("should include archetype class when provided", () => {
      const template = generateViteTemplate(
        "about",
        "About page",
        "/about",
        "Bold"
      );

      expect(template).toContain("archetype-bold");
    });
  });

  describe("getArchetypeClassName", () => {
    it("should return correct class names for all archetypes", () => {
      const archetypes: Array<[ArchetypeName, string]> = [
        ["Professional", "archetype-professional"],
        ["Creative", "archetype-creative"],
        ["Minimal", "archetype-minimal"],
        ["Bold", "archetype-bold"],
        ["Warm", "archetype-warm"],
        ["Cool", "archetype-cool"],
        ["High-Contrast", "archetype-high-contrast"],
      ];

      for (const [archetype, expected] of archetypes) {
        expect(getArchetypeClassName(archetype)).toBe(expected);
      }
    });
  });

  describe("generateComponentCode", () => {
    it("should generate basic component code", () => {
      const code = generateComponentCode("useButton");
      expect(code).toBe("<Button />");
    });

    it("should generate component code with string props", () => {
      const code = generateComponentCode("useButton", { variant: "primary" });
      expect(code).toContain('variant="primary"');
    });

    it("should generate component code with non-string props", () => {
      const code = generateComponentCode("useButton", { disabled: true, count: 5 });
      expect(code).toContain("disabled={true}");
      expect(code).toContain("count={5}");
    });

    it("should handle multiple props", () => {
      const code = generateComponentCode("useTextField", {
        label: "Name",
        required: true,
      });
      expect(code).toContain('label="Name"');
      expect(code).toContain("required={true}");
    });
  });

  describe("generateComponentImport", () => {
    it("should generate correct import statement", () => {
      const importStmt = generateComponentImport("useButton");
      expect(importStmt).toBe("import { Button } from '@/components/ui/button';");
    });

    it("should handle different component types", () => {
      const importStmt = generateComponentImport("useTextField");
      expect(importStmt).toBe("import { TextField } from '@/components/ui/textfield';");
    });
  });

  describe("generateLinkCode", () => {
    it("should generate correct Link code", () => {
      const code = generateLinkCode("/users/profile", "View Profile");
      expect(code).toBe('<Link href="/users/profile">View Profile</Link>');
    });
  });

  describe("generateLinkImport", () => {
    it("should generate correct import statement", () => {
      const importStmt = generateLinkImport();
      expect(importStmt).toBe("import Link from 'next/link';");
    });
  });

  describe("applyArchetypeToContent", () => {
    it("should add archetype class to container", () => {
      const content = `export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Title</h1>
    </div>
  );
}`;

      const result = applyArchetypeToContent(content, "Professional");
      expect(result).toContain("archetype-professional");
      expect(result).toContain("container mx-auto px-4 py-8 archetype-professional");
    });

    it("should not duplicate archetype class if already present", () => {
      const content = `export default function Page() {
  return (
    <div className="container mx-auto archetype-professional">
      <h1>Title</h1>
    </div>
  );
}`;

      const result = applyArchetypeToContent(content, "Professional");
      const matches = result.match(/archetype-professional/g);
      expect(matches?.length).toBe(1);
    });

    it("should return unchanged content if no container found", () => {
      const content = `export default function Page() {
  return <h1>Title</h1>;
}`;

      const result = applyArchetypeToContent(content, "Professional");
      expect(result).toBe(content);
    });
  });

  describe("insertComponentIntoContent", () => {
    it("should insert component and import into content with use client", () => {
      const content = `'use client';

export default function TestPage() {
  return (
    <div className="container">
      <h1>Test Page</h1>
    </div>
  );
}`;

      const result = insertComponentIntoContent(
        content,
        "<Button />",
        "import { Button } from '@/components/ui/button';"
      );

      expect(result).toContain("import { Button }");
      expect(result).toContain("<Button />");
    });

    it("should not duplicate import if already present", () => {
      const content = `'use client';
import { Button } from '@/components/ui/button';

export default function TestPage() {
  return (
    <div className="container">
      <h1>Test Page</h1>
    </div>
  );
}`;

      const result = insertComponentIntoContent(
        content,
        "<Button />",
        "import { Button } from '@/components/ui/button';"
      );

      const matches = result.match(/import \{ Button \}/g);
      expect(matches?.length).toBe(1);
    });

    it("should insert import at top when no use client directive", () => {
      const content = `export default function TestPage() {
  return (
    <div className="container">
      <h1>Test Page</h1>
    </div>
  );
}`;

      const result = insertComponentIntoContent(
        content,
        "<Button />",
        "import { Button } from '@/components/ui/button';"
      );

      expect(result.startsWith("import { Button }")).toBe(true);
    });
  });

  describe("insertLinkIntoContent", () => {
    it("should insert link and import into content", () => {
      const content = `export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
}`;

      const result = insertLinkIntoContent(content, "/users/profile", "View Profile");

      expect(result).toContain("import Link from 'next/link'");
      expect(result).toContain("View Profile");
      expect(result).toContain("/users/profile");
    });

    it("should not duplicate Link import if already present", () => {
      const content = `import Link from 'next/link';

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
}`;

      const result = insertLinkIntoContent(content, "/users/profile", "View Profile");

      const matches = result.match(/import Link from/g);
      expect(matches?.length).toBe(1);
    });
  });
});
