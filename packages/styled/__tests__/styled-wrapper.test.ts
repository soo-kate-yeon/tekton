/**
 * @tekton/styled - Styled Wrapper Tests (TAG-004, TAG-005)
 * Specification tests for token-enforced styled function
 * [SPEC-STYLED-001] [REQ-STY-001, REQ-STY-002, REQ-STY-015, REQ-STY-016, REQ-STY-017]
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { describe, it, expect } from 'vitest';
import { styled } from '../src/styled.js';
import { tokens } from '../src/tokens.js';

// ============================================================================
// REQ-STY-001, REQ-STY-015: Reject Hardcoded Colors
// ============================================================================

describe('Styled Wrapper - Color Enforcement [REQ-STY-001, REQ-STY-015]', () => {
  it('should allow token-based colors', () => {
    expect(() => {
      styled.div`
        background: ${tokens.bg.surface.default};
        color: ${tokens.fg.primary};
      `;
    }).not.toThrow();
  });

  it('should reject hex colors (#ffffff)', () => {
    expect(() => {
      styled.div`
        background: #ffffff;
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject short hex colors (#fff)', () => {
    expect(() => {
      styled.div`
        color: #fff;
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject rgb() colors', () => {
    expect(() => {
      styled.div`
        background: rgb(255, 255, 255);
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject rgba() colors', () => {
    expect(() => {
      styled.div`
        background: rgba(255, 255, 255, 0.5);
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject hsl() colors', () => {
    expect(() => {
      styled.div`
        color: hsl(0, 0%, 100%);
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject hsla() colors', () => {
    expect(() => {
      styled.div`
        background: hsla(0, 0%, 100%, 0.5);
      `;
    }).toThrow(/hardcoded value detected/i);
  });
});

// ============================================================================
// REQ-STY-002, REQ-STY-016: Reject Hardcoded Spacing
// ============================================================================

describe('Styled Wrapper - Spacing Enforcement [REQ-STY-002, REQ-STY-016]', () => {
  it('should allow token-based spacing', () => {
    expect(() => {
      styled.div`
        padding: ${tokens.spacing[4]};
        margin: ${tokens.spacing[2]};
      `;
    }).not.toThrow();
  });

  it('should reject hardcoded padding in pixels', () => {
    expect(() => {
      styled.div`
        padding: 16px;
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject hardcoded margin in pixels', () => {
    expect(() => {
      styled.div`
        margin: 8px;
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject hardcoded gap in pixels', () => {
    expect(() => {
      styled.div`
        gap: 12px;
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject hardcoded width in pixels', () => {
    expect(() => {
      styled.div`
        width: 200px;
      `;
    }).toThrow(/hardcoded value detected/i);
  });

  it('should reject hardcoded height in pixels', () => {
    expect(() => {
      styled.div`
        height: 100px;
      `;
    }).toThrow(/hardcoded value detected/i);
  });
});

// ============================================================================
// REQ-STY-013: Allow Non-Token Properties
// ============================================================================

describe('Styled Wrapper - Non-Token Properties [REQ-STY-013]', () => {
  it('should allow display property', () => {
    expect(() => {
      styled.div`
        display: flex;
        flex-direction: column;
      `;
    }).not.toThrow();
  });

  it('should allow position property', () => {
    expect(() => {
      styled.div`
        position: relative;
        z-index: 10;
      `;
    }).not.toThrow();
  });

  it('should allow layout properties', () => {
    expect(() => {
      styled.div`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        justify-content: space-between;
      `;
    }).not.toThrow();
  });

  it('should allow transition property with duration', () => {
    expect(() => {
      styled.div`
        transition: all 150ms ease-in-out;
      `;
    }).not.toThrow();
  });

  it('should allow cursor property', () => {
    expect(() => {
      styled.button`
        cursor: pointer;
      `;
    }).not.toThrow();
  });
});

// ============================================================================
// Mixed Valid and Invalid Properties
// ============================================================================

describe('Styled Wrapper - Mixed Properties', () => {
  it('should allow valid tokens with layout properties', () => {
    expect(() => {
      styled.div`
        display: flex;
        background: ${tokens.bg.surface.default};
        padding: ${tokens.spacing[4]};
        border-radius: ${tokens.radius.md};
      `;
    }).not.toThrow();
  });

  it('should reject if any property has hardcoded value', () => {
    expect(() => {
      styled.div`
        display: flex;
        background: ${tokens.bg.surface.default};
        padding: 16px; // This should fail
      `;
    }).toThrow(/hardcoded value detected/i);
  });
});

// ============================================================================
// REQ-STY-017: Error Messages Provide Context
// ============================================================================

describe('Styled Wrapper - Error Messages [REQ-STY-017]', () => {
  it('should provide template context in error message', () => {
    try {
      styled.div`
        background: #ffffff;
      `;
      expect.fail('Should have thrown error');
    } catch (error) {
      expect((error as Error).message).toContain('Hardcoded value detected');
      expect((error as Error).message).toContain('[Tekton]');
    }
  });

  it('should include suggestion to use tokens', () => {
    try {
      styled.div`
        padding: 16px;
      `;
      expect.fail('Should have thrown error');
    } catch (error) {
      expect((error as Error).message).toContain('Use tokens instead');
    }
  });
});

// ============================================================================
// Component Types Support
// ============================================================================

describe('Styled Wrapper - Component Types', () => {
  it('should support div elements', () => {
    expect(() => {
      styled.div`
        background: ${tokens.bg.surface.default};
      `;
    }).not.toThrow();
  });

  it('should support button elements', () => {
    expect(() => {
      styled.button`
        background: ${tokens.bg.primary.default};
        color: ${tokens.fg.inverse};
      `;
    }).not.toThrow();
  });

  it('should support span elements', () => {
    expect(() => {
      styled.span`
        color: ${tokens.fg.secondary};
      `;
    }).not.toThrow();
  });

  it('should support input elements', () => {
    expect(() => {
      styled.input`
        padding: ${tokens.spacing[2]};
        border-radius: ${tokens.radius.sm};
      `;
    }).not.toThrow();
  });
});

// ============================================================================
// Template Literal Interpolation
// ============================================================================

describe('Styled Wrapper - Interpolation', () => {
  it('should allow token interpolation', () => {
    expect(() => {
      const bg = tokens.bg.surface.default;
      const padding = tokens.spacing[4];

      styled.div`
        background: ${bg};
        padding: ${padding};
      `;
    }).not.toThrow();
  });

  it('should allow function interpolation returning tokens', () => {
    expect(() => {
      styled.div`
        background: ${(props: any) =>
          props.variant === 'primary' ? tokens.bg.primary.default : tokens.bg.surface.default};
      `;
    }).not.toThrow();
  });

  // Note: Runtime detection of hardcoded values inside function bodies is not feasible
  // This should be caught by the esbuild plugin during build-time analysis (TAG-006)
  it.skip('should reject function returning hardcoded value (build-time check)', () => {
    expect(() => {
      styled.div`
        background: ${(props: any) => (props.variant === 'primary' ? '#3b82f6' : '#ffffff')};
      `;
    }).toThrow(/hardcoded value detected/i);
  });
});

// ============================================================================
// Real-World Component Examples
// ============================================================================

describe('Styled Wrapper - Real Component Examples', () => {
  it('should create a card component with tokens', () => {
    expect(() => {
      const Card = styled.div`
        background: ${tokens.bg.surface.elevated};
        padding: ${tokens.spacing[6]};
        border-radius: ${tokens.radius.lg};
        box-shadow: ${tokens.shadow.md};
        display: flex;
        flex-direction: column;
      `;
      expect(Card).toBeDefined();
    }).not.toThrow();
  });

  it('should create a button component with states', () => {
    expect(() => {
      const Button = styled.button`
        background: ${tokens.bg.primary.default};
        color: ${tokens.fg.inverse};
        padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
        border-radius: ${tokens.radius.md};
        cursor: pointer;
        transition: all 150ms ease;

        &:hover {
          background: ${tokens.bg.primary.hover};
        }

        &:active {
          background: ${tokens.bg.primary.active};
        }
      `;
      expect(Button).toBeDefined();
    }).not.toThrow();
  });

  it('should reject card with hardcoded values', () => {
    expect(() => {
      styled.div`
        background: #ffffff; // Hardcoded
        padding: ${tokens.spacing[6]};
        border-radius: ${tokens.radius.lg};
      `;
    }).toThrow(/hardcoded value detected/i);
  });
});
