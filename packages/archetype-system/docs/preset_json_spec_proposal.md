# Proposed 5-Layer Preset JSON Structure

To achieve consistent and predictable design implementation via MCP, the preset JSON must evolve from a simple configuration dictionary into a **Complete Design System Specification**.

This document outlines a proposed 5-layer JSON structure that eliminates AI guesswork ("hallucination") by strictly defining every aspect of the design system, from raw tokens to component variants.

## The 5-Layer Architecture

### Layer 1: Primitives (The "Atoms")
Defines the raw values. All other layers reference these values. No hardcoded hex values should exist outside this layer.
- Colors, Spacing, Radii, Typography, Shadows

### Layer 2: Semantics (The "Meaning")
Maps primitives to their usage context. This tells the AI *why* a color is used, not just *what* it is.
- `action.primary.bg` instead of `blue-500`
- `feedback.error.text` instead of `red-600`

### Layer 3: Components (The "Molecules")
Explicitly maps Headless Hooks to their visual properties. This is the most critical layer for MCP.
- Defines Base Styles
- Defines Variants (Solid, Outline, Ghost)
- Defines Sizes (Sm, Md, Lg)

### Layer 4: States (The "Interaction")
Defines how components react to user interaction, mapped directly to Hook state props.
- `isPressed`, `isHovered`, `isFocused`, `isDisabled`

### Layer 5: Governance (The "Rules")
Provides explicit instructions to the AI about what is *allowed* and *forbidden*.
- Layout patterns, Forbidden CSS properties, spacing scales.

---

## Proposed JSON Structure

```json
{
  "meta": {
    "name": "SaaS Modern",
    "version": "2.0.0",
    "description": "Clean, high-contrast interface for enterprise software."
  },
  
  "primitives": {
    "colors": {
      "brand": {
        "500": "#3B82F6",
        "600": "#2563EB"
      },
      "neutral": {
        "50": "#F9FAFB",
        "100": "#F3F4F6",
        "200": "#E5E7EB",
        "900": "#111827"
      },
      "error": {
        "500": "#EF4444"
      }
    },
    "spacing": {
      "2": "0.5rem",
      "4": "1rem",
      "8": "2rem"
    },
    "radii": {
      "sm": "0.125rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "full": "9999px"
    },
    "typography": {
      "fontFamily": "Inter, sans-serif",
      "weights": {
        "regular": "400",
        "medium": "500",
        "bold": "700"
      }
    }
  },

  "semantics": {
    "action": {
      "primary": {
        "bg": "{primitives.colors.brand.500}",
        "fg": "{primitives.colors.neutral.50}",
        "hover": "{primitives.colors.brand.600}",
        "border": "transparent"
      },
      "secondary": {
        "bg": "{primitives.colors.neutral.100}",
        "fg": "{primitives.colors.neutral.900}",
        "hover": "{primitives.colors.neutral.200}",
        "border": "{primitives.colors.neutral.200}"
      }
    },
    "feedback": {
      "error": {
        "fg": "{primitives.colors.error.500}"
      }
    },
    "surface": {
      "base": "{primitives.colors.neutral.50}",
      "card": "white"
    }
  },

  "components": {
    "useButton": {
      "base": {
        "display": "inline-flex",
        "alignItems": "center",
        "justifyContent": "center",
        "borderRadius": "{primitives.radii.md}",
        "fontWeight": "{primitives.typography.weights.medium}",
        "transition": "all 150ms ease",
        "cursor": "pointer"
      },
      "variants": {
        "solid": {
          "background": "{semantics.action.primary.bg}",
          "color": "{semantics.action.primary.fg}",
          "border": "1px solid {semantics.action.primary.border}",
          "&:hover": {
            "background": "{semantics.action.primary.hover}"
          }
        },
        "outline": {
          "background": "transparent",
          "color": "{semantics.action.primary.bg}",
          "border": "1px solid {semantics.action.primary.bg}",
          "&:hover": {
            "background": "{semantics.action.primary.bg}",
            "color": "{semantics.action.primary.fg}"
          }
        }
      },
      "sizes": {
        "sm": {
          "height": "2rem",
          "padding": "0 {primitives.spacing.2}",
          "fontSize": "0.875rem"
        },
        "md": {
          "height": "2.5rem",
          "padding": "0 {primitives.spacing.4}",
          "fontSize": "1rem"
        }
      },
      "states": {
        "isPressed": {
          "transform": "scale(0.98)"
        },
        "isLoading": {
          "opacity": "0.7",
          "pointerEvents": "none"
        },
        "isDisabled": {
          "opacity": "0.5",
          "cursor": "not-allowed"
        }
      }
    },
    "useTextField": {
      "base": {
        "input": {
          "width": "100%",
          "borderRadius": "{primitives.radii.md}",
          "border": "1px solid {primitives.colors.neutral.200}"
        }
      },
      "states": {
        "isInvalid": {
          "borderColor": "{semantics.feedback.error.fg}"
        },
        "isFocused": {
          "borderColor": "{semantics.action.primary.bg}",
          "ring": "2px solid {semantics.action.primary.bg}"
        }
      }
    }
  },

  "governance": {
    "layout": {
      "density": "comfortable", 
      "maxContentWidth": "1200px"
    },
    "rules": [
      "No inline styles for structural layout",
      "Buttons must always have a variant specified",
      "Touch targets must be at least 44px"
    ]
  }
}
```

## Why This Structure?

1.  **Deterministic Code Generation**: The AI doesn't need to "invent" styles. It simply translates `semantics.action.primary.bg` to `var(--tekton-action-primary-bg)`.
2.  **Context-Aware**: By separating Semantics from Primitives, we can change the entire "Brand Color" (Primitive) without breaking the "Primary Action" (Semantic) logic.
3.  **State Completeness**: Explicitly defining `isPressed` or `isFocused` ensures interactive states are never missed.
4.  **Hook Alignment**: keying components by hook name (`useButton`) directly links the design spec to the implementation library (`@tekton/headless-components`).
