/**
 * @tekton/styled - Token-Enforced Styled Function
 * [SPEC-STYLED-001] [TAG-004]
 * styled-components wrapper with token enforcement
 * REQ-STY-001, REQ-STY-002, REQ-STY-006, REQ-STY-013, REQ-STY-015, REQ-STY-016, REQ-STY-018
 */

import baseStyled, {
  css as baseCss,
  createGlobalStyle as baseCreateGlobalStyle,
} from 'styled-components';
import type { TokenReference } from '@tekton/tokens';
import { validateNoHardcodedValues } from './validation.js';

/**
 * Valid token value types
 * REQ-STY-013: Allow non-token properties
 */
export type ValidTokenValue =
  | TokenReference
  | string
  | number
  | ((props: any) => TokenReference | string | number);

/**
 * Token-enforced styled function
 * REQ-STY-006: Provide token-enforced styled function
 * REQ-STY-018: Don't break existing styled-components features
 */
export const styled: typeof baseStyled = new Proxy(baseStyled, {
  get(target, prop: string | symbol) {
    if (typeof prop === 'symbol' || prop === 'default') {
      return (target as any)[prop];
    }

    const component = (target as any)[prop];

    if (typeof component === 'function') {
      return createTokenEnforcedStyled(component);
    }

    return component;
  },
});

/**
 * Creates a token-enforced styled component creator
 */
function createTokenEnforcedStyled(styledFn: any): any {
  return (strings: TemplateStringsArray, ...values: ValidTokenValue[]) => {
    // REQ-STY-001, REQ-STY-002: Runtime validation (backup for edge cases)
    validateNoHardcodedValues(strings, values);

    // Call the original styled-components function
    return styledFn(strings, ...values);
  };
}

/**
 * Re-export css and createGlobalStyle from styled-components
 * REQ-STY-018: Don't break existing styled-components features
 */
export { baseCss as css, baseCreateGlobalStyle as createGlobalStyle };
