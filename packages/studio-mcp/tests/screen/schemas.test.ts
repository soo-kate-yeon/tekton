/**
 * Screen Schemas Tests
 * TDD tests for screen tool Zod schemas
 *
 * @module tests/screen/schemas.test
 */

import { describe, it, expect } from "vitest";
import {
  CreateScreenInputSchema,
  AddComponentInputSchema,
  ApplyArchetypeInputSchema,
  ListScreensInputSchema,
  PreviewScreenInputSchema,
  ArchetypeNameSchema,
  LinkFromSchema,
  type CreateScreenInput,
  type AddComponentInput,
  type ApplyArchetypeInput,
  type ListScreensInput,
  type PreviewScreenInput,
  type ArchetypeName,
} from "../../src/screen/index.js";

describe("Screen Schemas", () => {
  describe("ArchetypeNameSchema", () => {
    it("should accept valid archetype names", () => {
      const validNames: ArchetypeName[] = [
        "Professional",
        "Creative",
        "Minimal",
        "Bold",
        "Warm",
        "Cool",
        "High-Contrast",
      ];

      for (const name of validNames) {
        const result = ArchetypeNameSchema.safeParse(name);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(name);
        }
      }
    });

    it("should reject invalid archetype names", () => {
      const invalidNames = ["invalid", "professional", "BOLD", "Neon", ""];

      for (const name of invalidNames) {
        const result = ArchetypeNameSchema.safeParse(name);
        expect(result.success).toBe(false);
      }
    });
  });

  describe("LinkFromSchema", () => {
    it("should accept valid linkFrom object with required fields", () => {
      const input = {
        page: "/users",
        label: "View Profile",
      };

      const result = LinkFromSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe("/users");
        expect(result.data.label).toBe("View Profile");
      }
    });

    it("should accept linkFrom object with optional description", () => {
      const input = {
        page: "/users",
        label: "View Profile",
        description: "Navigate to user profile page",
      };

      const result = LinkFromSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("Navigate to user profile page");
      }
    });

    it("should reject linkFrom without page", () => {
      const input = {
        label: "View Profile",
      };

      const result = LinkFromSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject linkFrom without label", () => {
      const input = {
        page: "/users",
      };

      const result = LinkFromSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty page string", () => {
      const input = {
        page: "",
        label: "View Profile",
      };

      const result = LinkFromSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty label string", () => {
      const input = {
        page: "/users",
        label: "",
      };

      const result = LinkFromSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateScreenInputSchema", () => {
    it("should accept valid input with required fields only", () => {
      const input: CreateScreenInput = {
        name: "user-profile",
        intent: "User profile page with avatar, bio, and settings link",
        targetPath: "/users/profile",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("user-profile");
        expect(result.data.intent).toBe(
          "User profile page with avatar, bio, and settings link"
        );
        expect(result.data.targetPath).toBe("/users/profile");
        expect(result.data.linkFrom).toBeUndefined();
      }
    });

    it("should accept valid input with linkFrom object", () => {
      const input: CreateScreenInput = {
        name: "user-profile",
        intent: "User profile page",
        targetPath: "/users/profile",
        linkFrom: {
          page: "/users",
          label: "View Profile",
          description: "Navigate to user profile",
        },
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.linkFrom).toBeDefined();
        expect(result.data.linkFrom?.page).toBe("/users");
        expect(result.data.linkFrom?.label).toBe("View Profile");
      }
    });

    it("should reject input without name", () => {
      const input = {
        intent: "User profile page",
        targetPath: "/users/profile",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject input without intent", () => {
      const input = {
        name: "user-profile",
        targetPath: "/users/profile",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject input without targetPath", () => {
      const input = {
        name: "user-profile",
        intent: "User profile page",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty name string", () => {
      const input = {
        name: "",
        intent: "User profile page",
        targetPath: "/users/profile",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty intent string", () => {
      const input = {
        name: "user-profile",
        intent: "",
        targetPath: "/users/profile",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty targetPath string", () => {
      const input = {
        name: "user-profile",
        intent: "User profile page",
        targetPath: "",
      };

      const result = CreateScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("AddComponentInputSchema", () => {
    it("should accept valid input with required fields only", () => {
      const input: AddComponentInput = {
        screenName: "user-profile",
        componentType: "useButton",
      };

      const result = AddComponentInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.screenName).toBe("user-profile");
        expect(result.data.componentType).toBe("useButton");
        expect(result.data.props).toBeUndefined();
      }
    });

    it("should accept valid input with props object", () => {
      const input: AddComponentInput = {
        screenName: "user-profile",
        componentType: "useButton",
        props: {
          variant: "primary",
          size: "large",
        },
      };

      const result = AddComponentInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.props).toBeDefined();
        expect(result.data.props?.variant).toBe("primary");
      }
    });

    it("should reject input without screenName", () => {
      const input = {
        componentType: "useButton",
      };

      const result = AddComponentInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject input without componentType", () => {
      const input = {
        screenName: "user-profile",
      };

      const result = AddComponentInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty screenName string", () => {
      const input = {
        screenName: "",
        componentType: "useButton",
      };

      const result = AddComponentInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty componentType string", () => {
      const input = {
        screenName: "user-profile",
        componentType: "",
      };

      const result = AddComponentInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("ApplyArchetypeInputSchema", () => {
    it("should accept valid input with valid archetype name", () => {
      const input: ApplyArchetypeInput = {
        screenName: "user-profile",
        componentName: "Professional",
      };

      const result = ApplyArchetypeInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.screenName).toBe("user-profile");
        expect(result.data.componentName).toBe("Professional");
      }
    });

    it("should accept all valid archetype names", () => {
      const archetypes: ArchetypeName[] = [
        "Professional",
        "Creative",
        "Minimal",
        "Bold",
        "Warm",
        "Cool",
        "High-Contrast",
      ];

      for (const archetype of archetypes) {
        const input = {
          screenName: "test-screen",
          componentName: archetype,
        };

        const result = ApplyArchetypeInputSchema.safeParse(input);
        expect(result.success).toBe(true);
      }
    });

    it("should reject input without screenName", () => {
      const input = {
        componentName: "Professional",
      };

      const result = ApplyArchetypeInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject input without componentName", () => {
      const input = {
        screenName: "user-profile",
      };

      const result = ApplyArchetypeInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject invalid archetype name", () => {
      const input = {
        screenName: "user-profile",
        componentName: "InvalidArchetype",
      };

      const result = ApplyArchetypeInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty screenName string", () => {
      const input = {
        screenName: "",
        componentName: "Professional",
      };

      const result = ApplyArchetypeInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("ListScreensInputSchema", () => {
    it("should accept empty object", () => {
      const input: ListScreensInput = {};

      const result = ListScreensInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should accept optional projectPath", () => {
      const input: ListScreensInput = {
        projectPath: "/path/to/project",
      };

      const result = ListScreensInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectPath).toBe("/path/to/project");
      }
    });
  });

  describe("PreviewScreenInputSchema", () => {
    it("should accept valid screenName", () => {
      const input: PreviewScreenInput = {
        screenName: "user-profile",
      };

      const result = PreviewScreenInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.screenName).toBe("user-profile");
      }
    });

    it("should accept optional projectPath", () => {
      const input: PreviewScreenInput = {
        screenName: "user-profile",
        projectPath: "/path/to/project",
      };

      const result = PreviewScreenInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectPath).toBe("/path/to/project");
      }
    });

    it("should reject input without screenName", () => {
      const input = {};

      const result = PreviewScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject empty screenName string", () => {
      const input = {
        screenName: "",
      };

      const result = PreviewScreenInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
