/**
 * MCP Client for Tekton CLI
 * Communicates with the studio-mcp server to fetch archetype data
 */

/**
 * MCP Tool Result wrapper (matches server response)
 */
export interface MCPToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Base style definition
 */
export interface BaseStyle {
  propObject: string;
  cssProperties: Record<string, string>;
}

/**
 * Hook Prop Rule (Layer 1)
 */
export interface HookPropRule {
  hookName: string;
  propObjects: string[];
  baseStyles: BaseStyle[];
  requiredCSSVariables: string[];
}

/**
 * State definition
 */
export interface StateDefinition {
  stateName: string;
  stateType: 'boolean' | 'numeric' | 'composite';
  visualFeedback: {
    cssProperties: Record<string, string>;
  };
}

/**
 * State Style Mapping (Layer 2)
 */
export interface StateStyleMapping {
  hookName: string;
  states: StateDefinition[];
  transitions: {
    duration: string;
    easing: string;
    reducedMotion: boolean;
  };
}

/**
 * Style rule
 */
export interface StyleRule {
  condition: string;
  cssProperties: Record<string, string>;
}

/**
 * Configuration option
 */
export interface ConfigurationOption {
  optionName: string;
  optionType: 'boolean' | 'string' | 'enum';
  possibleValues: unknown[];
  styleRules: StyleRule[];
}

/**
 * Variant Branching (Layer 3)
 */
export interface VariantBranching {
  hookName: string;
  configurationOptions: ConfigurationOption[];
}

/**
 * ARIA attribute definition
 */
export interface AriaAttribute {
  name: string;
  required: boolean;
  validValues?: string[];
  description: string;
}

/**
 * Keyboard navigation definition
 */
export interface KeyboardNavigation {
  key: string;
  action: string;
  required: boolean;
}

/**
 * Nested component definition
 */
export interface NestedComponent {
  element: string;
  propsObject?: string;
  order: number;
  purpose: string;
}

/**
 * Structure Template (Layer 4)
 */
export interface StructureTemplate {
  hookName: string;
  htmlElement: string;
  jsxPattern: string;
  accessibility: {
    role?: string;
    wcagLevel: 'A' | 'AA' | 'AAA';
    ariaAttributes: AriaAttribute[];
    keyboardNavigation: KeyboardNavigation[];
    focusManagement?: string;
    notes?: string[];
  };
  nestedStructure?: {
    components: NestedComponent[];
    compositionPattern: string;
    requiresWrapper: boolean;
  };
  examples?: string[];
  integrationNotes?: string[];
}

/**
 * Complete archetype data structure (all 4 layers)
 */
export interface CompleteArchetype {
  hookName: string;
  propRules: HookPropRule | null;
  stateMappings: StateStyleMapping | null;
  variants: VariantBranching | null;
  structure: StructureTemplate | null;
}

/**
 * MCP Client configuration
 */
export interface MCPClientConfig {
  baseUrl: string;
  timeout: number;
}

/**
 * Component to hook name mapping
 */
const COMPONENT_TO_HOOK: Record<string, string> = {
  Button: 'useButton',
  Input: 'useTextField',
  TextField: 'useTextField',
  Select: 'useSelect',
  Checkbox: 'useCheckbox',
  Switch: 'useSwitch',
  Toggle: 'useToggleButton',
  ToggleButton: 'useToggleButton',
  Radio: 'useRadioGroup',
  RadioGroup: 'useRadioGroup',
  Slider: 'useSlider',
  Card: 'useCard',
  Dialog: 'useDialog',
  Modal: 'useDialog',
  Menu: 'useMenu',
  DropdownMenu: 'useDropdownMenu',
  Dropdown: 'useDropdownMenu',
  Tabs: 'useTabs',
  Tab: 'useTabs',
  Table: 'useTable',
  DataTable: 'useTable',
  Tooltip: 'useTooltip',
  Popover: 'usePopover',
  Toast: 'useToast',
  Alert: 'useAlert',
  Badge: 'useBadge',
  Avatar: 'useAvatar',
  Progress: 'useProgressBar',
  ProgressBar: 'useProgressBar',
  Accordion: 'useAccordion',
  Breadcrumb: 'useBreadcrumbs',
  Breadcrumbs: 'useBreadcrumbs',
  Pagination: 'usePagination',
  Calendar: 'useCalendar',
  DatePicker: 'useDatePicker',
  Form: 'useForm',
  Chart: 'useChart',
  Stat: 'useStat',
  StatCard: 'useStat',
};

/**
 * MCP Client for fetching archetype data
 */
export class MCPClient {
  private config: MCPClientConfig;

  constructor(config?: Partial<MCPClientConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.MCP_URL || 'http://localhost:3000',
      timeout: config?.timeout || 5000,
    };
  }

  /**
   * Make HTTP request to MCP server
   */
  private async request<T>(toolName: string, params: Record<string, unknown> = {}): Promise<MCPToolResult<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/tools/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      return result as MCPToolResult<T>;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error' };
    }
  }

  /**
   * Check if MCP server is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List all available hooks with archetype definitions
   */
  async listArchetypes(): Promise<MCPToolResult<string[]>> {
    return this.request<string[]>('archetype.list');
  }

  /**
   * Get complete archetype for a specific hook (all 4 layers)
   */
  async getComponent(hookName: string): Promise<MCPToolResult<CompleteArchetype>> {
    return this.request<CompleteArchetype>('archetype.get', { hookName });
  }

  /**
   * Get prop rules for a hook (Layer 1)
   */
  async getPropRules(hookName: string): Promise<MCPToolResult<HookPropRule>> {
    return this.request<HookPropRule>('archetype.getPropRules', { hookName });
  }

  /**
   * Get state mappings for a hook (Layer 2)
   */
  async getStateMappings(hookName: string): Promise<MCPToolResult<StateStyleMapping>> {
    return this.request<StateStyleMapping>('archetype.getStateMappings', { hookName });
  }

  /**
   * Get variants for a hook (Layer 3)
   */
  async getVariants(hookName: string): Promise<MCPToolResult<VariantBranching>> {
    return this.request<VariantBranching>('archetype.getVariants', { hookName });
  }

  /**
   * Get structure template for a hook (Layer 4)
   */
  async getStructure(hookName: string): Promise<MCPToolResult<StructureTemplate>> {
    return this.request<StructureTemplate>('archetype.getStructure', { hookName });
  }

  /**
   * Convert component name to hook name
   */
  componentToHook(componentName: string): string | null {
    // Direct mapping
    if (COMPONENT_TO_HOOK[componentName]) {
      return COMPONENT_TO_HOOK[componentName];
    }

    // Try with "use" prefix (e.g., "Button" -> "useButton")
    const hookName = `use${componentName}`;
    return hookName;
  }

  /**
   * Fetch archetypes for multiple components at once
   */
  async getArchetypesForComponents(components: string[]): Promise<Map<string, CompleteArchetype>> {
    const archetypes = new Map<string, CompleteArchetype>();

    // Convert component names to hook names and dedupe
    const hookNames = new Set<string>();
    for (const component of components) {
      const hookName = this.componentToHook(component);
      if (hookName) {
        hookNames.add(hookName);
      }
    }

    // Fetch archetypes in parallel
    const promises = Array.from(hookNames).map(async (hookName) => {
      const result = await this.getComponent(hookName);
      if (result.success && result.data) {
        return { hookName, archetype: result.data };
      }
      return null;
    });

    const results = await Promise.all(promises);

    for (const result of results) {
      if (result) {
        archetypes.set(result.hookName, result.archetype);
      }
    }

    return archetypes;
  }
}

/**
 * Default MCP client instance
 */
export const mcpClient = new MCPClient();
