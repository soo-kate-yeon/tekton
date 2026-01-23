import { useState, useCallback, KeyboardEvent } from "react";
import type { AriaAttributes } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";
import { createKeyboardHandler } from "../utils/keyboard.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Tab item in a tab list
 */
export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props for the useTabs hook
 */
export interface UseTabsProps {
  /**
   * Available tabs
   */
  tabs: TabItem[];

  /**
   * Controlled active tab ID
   */
  activeTab?: string;

  /**
   * Default active tab ID for uncontrolled mode
   */
  defaultActiveTab?: string;

  /**
   * Callback when active tab changes
   */
  onChange?: (tabId: string) => void;

  /**
   * Whether tabs are disabled
   */
  disabled?: boolean;

  /**
   * Orientation of tab list
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Custom ID prefix for tabs
   */
  id?: string;

  /**
   * ARIA label for the tab list
   */
  ariaLabel?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Return type for the useTabs hook
 */
export interface UseTabsReturn {
  /**
   * Props for the tab list container
   */
  tabListProps: {
    role: "tablist";
    "aria-orientation": "horizontal" | "vertical";
    "aria-label"?: string;
  } & Record<string, unknown>;

  /**
   * Get props for an individual tab
   */
  getTabProps: (
    tab: TabItem,
    index: number,
  ) => {
    id: string;
    role: "tab";
    tabIndex: number;
    "aria-selected": boolean;
    "aria-disabled"?: boolean;
    "aria-controls": string;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: () => void;
  };

  /**
   * Get props for a tab panel
   */
  getTabPanelProps: (tabId: string) => {
    id: string;
    role: "tabpanel";
    "aria-labelledby": string;
    tabIndex: number;
  };

  /**
   * Current active tab ID
   */
  activeTab: string;

  /**
   * Set active tab
   */
  setActiveTab: (tabId: string) => void;
}

/**
 * useTabs Hook
 *
 * Headless hook for managing tabbed interface with keyboard navigation.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Arrow key navigation (Left/Right for horizontal, Up/Down for vertical)
 * - Home/End key support
 * - Full ARIA attributes (role=tab, role=tabpanel, aria-selected)
 * - Horizontal and vertical orientations
 * - Automatic focus management
 * - No styling logic
 *
 * @param props - Configuration options for tabs
 * @returns Object containing tab list, tab, and panel props
 *
 * @example
 * ```tsx
 * const { tabListProps, getTabProps, getTabPanelProps, activeTab } = useTabs({
 *   tabs: [
 *     { id: 'tab1', label: 'Tab 1' },
 *     { id: 'tab2', label: 'Tab 2' },
 *   ],
 *   defaultActiveTab: 'tab1',
 * });
 *
 * return (
 *   <div>
 *     <div {...tabListProps}>
 *       {tabs.map((tab, i) => (
 *         <button key={tab.id} {...getTabProps(tab, i)}>
 *           {tab.label}
 *         </button>
 *       ))}
 *     </div>
 *     {tabs.map(tab => (
 *       <div key={tab.id} {...getTabPanelProps(tab.id)} hidden={activeTab !== tab.id}>
 *         Content for {tab.label}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useTabs(props: UseTabsProps): UseTabsReturn {
  const {
    tabs,
    activeTab: controlledActiveTab,
    defaultActiveTab,
    onChange,
    disabled = false,
    orientation = "horizontal",
    id: customId,
    ariaLabel,
    ariaAttributes = {},
  } = props;

  // Generate unique ID prefix
  const idPrefix = useUniqueId(customId);

  // Determine if component is controlled
  const isControlled = controlledActiveTab !== undefined;

  // State management
  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    // Use defaultActiveTab if provided and valid, otherwise use first tab
    if (defaultActiveTab && tabs.some((tab) => tab.id === defaultActiveTab)) {
      return defaultActiveTab;
    }
    return tabs[0]?.id || "";
  });

  // Use controlled value if provided, otherwise use internal state
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  // Set active tab handler
  const setActiveTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab || tab.disabled || disabled) {
        return;
      }

      // Update internal state if not controlled
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }

      // Call onChange callback
      onChange?.(tabId);
    },
    [tabs, disabled, isControlled, onChange],
  );

  // Find next non-disabled tab index
  const findNextEnabledIndex = useCallback(
    (currentIndex: number, direction: 1 | -1): number => {
      let nextIndex = currentIndex;
      let attempts = 0;

      do {
        nextIndex = nextIndex + direction;

        // Wrap around
        if (nextIndex >= tabs.length) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = tabs.length - 1;
        }

        // Prevent infinite loop
        attempts++;
        if (attempts > tabs.length) {
          return currentIndex;
        }
      } while (tabs[nextIndex]?.disabled);

      return nextIndex;
    },
    [tabs],
  );

  // Navigate to tab by index
  const navigateToTabIndex = useCallback(
    (currentIndex: number, direction: 1 | -1) => {
      if (disabled) {
        return;
      }

      const nextIndex = findNextEnabledIndex(currentIndex, direction);
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        setActiveTab(nextTab.id);
      }
    },
    [disabled, tabs, findNextEnabledIndex, setActiveTab],
  );

  // Get props for individual tab
  const getTabProps = useCallback(
    (tab: TabItem, index: number) => {
      const tabId = `${idPrefix}-tab-${index}`;
      const panelId = `${idPrefix}-panel-${index}`;
      const isActive = tab.id === activeTab;

      // Keyboard navigation handler for this tab
      const handleKeyDown = (event: KeyboardEvent) => {
        if (disabled || tab.disabled) {
          return;
        }

        const handlers: Record<string, () => void> = {};

        if (orientation === "horizontal") {
          handlers.ArrowRight = () => navigateToTabIndex(index, 1);
          handlers.ArrowLeft = () => navigateToTabIndex(index, -1);
        } else {
          handlers.ArrowDown = () => navigateToTabIndex(index, 1);
          handlers.ArrowUp = () => navigateToTabIndex(index, -1);
        }

        handlers.Home = () => {
          // Find first non-disabled tab
          const firstEnabledIndex = tabs.findIndex((t) => !t.disabled);
          if (firstEnabledIndex >= 0) {
            setActiveTab(tabs[firstEnabledIndex].id);
          }
        };

        handlers.End = () => {
          // Find last non-disabled tab
          const lastEnabledIndex = tabs
            .slice()
            .reverse()
            .findIndex((t) => !t.disabled);
          if (lastEnabledIndex >= 0) {
            setActiveTab(tabs[tabs.length - 1 - lastEnabledIndex].id);
          }
        };

        const keyboardHandler = createKeyboardHandler(handlers);
        keyboardHandler(event);
      };

      return {
        id: tabId,
        role: "tab" as const,
        tabIndex: isActive ? 0 : -1,
        "aria-selected": isActive,
        ...(tab.disabled && { "aria-disabled": true }),
        "aria-controls": panelId,
        onKeyDown: handleKeyDown,
        onClick: () => setActiveTab(tab.id),
      };
    },
    [
      idPrefix,
      activeTab,
      disabled,
      orientation,
      tabs,
      navigateToTabIndex,
      setActiveTab,
    ],
  );

  // Get props for tab panel
  const getTabPanelProps = useCallback(
    (tabId: string) => {
      const tabIndex = tabs.findIndex((t) => t.id === tabId);
      const tabElementId = `${idPrefix}-tab-${tabIndex}`;
      const panelId = `${idPrefix}-panel-${tabIndex}`;

      return {
        id: panelId,
        role: "tabpanel" as const,
        "aria-labelledby": tabElementId,
        tabIndex: 0,
      };
    },
    [idPrefix, tabs],
  );

  // Generate ARIA props for tab list
  const tabListAriaProps = generateAriaProps({
    role: "tablist",
    "aria-orientation": orientation,
    "aria-label": ariaLabel,
    ...ariaAttributes,
  });

  return {
    tabListProps: {
      ...tabListAriaProps,
      role: "tablist",
      "aria-orientation": orientation,
      ...(ariaLabel && { "aria-label": ariaLabel }),
    },
    getTabProps,
    getTabPanelProps,
    activeTab,
    setActiveTab,
  };
}
