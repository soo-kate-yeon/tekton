import { useState, useCallback, KeyboardEvent } from 'react';
import type { AriaAttributes } from '../types';
import { generateAriaProps } from '../utils/aria';
import { isKeyboardKey, handleKeyboardEvent } from '../utils/keyboard';
import { useUniqueId } from '../utils/id';

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
  orientation?: 'horizontal' | 'vertical';

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
    role: 'tablist';
    'aria-orientation': 'horizontal' | 'vertical';
    'aria-label'?: string;
  } & Record<string, unknown>;

  /**
   * Get props for an individual tab
   */
  getTabProps: (tab: TabItem, index: number) => {
    id: string;
    role: 'tab';
    tabIndex: number;
    'aria-selected': boolean;
    'aria-disabled'?: boolean;
    'aria-controls': string;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: () => void;
  };

  /**
   * Get props for a tab panel
   */
  getTabPanelProps: (tabId: string) => {
    id: string;
    role: 'tabpanel';
    'aria-labelledby': string;
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
    orientation = 'horizontal',
    id: customId,
    ariaLabel,
    ariaAttributes = {},
  } = props;

  // TODO: Implement controlled/uncontrolled state management
  // TODO: Implement tab selection handler
  // TODO: Implement keyboard navigation based on orientation
  // TODO: Arrow Left/Right for horizontal, Up/Down for vertical
  // TODO: Implement Home/End key support
  // TODO: Generate unique IDs for tabs and panels
  // TODO: Generate ARIA props for tab list, tabs, and panels
  // TODO: Handle focus management between tabs
  // TODO: Return tab list, tab, and panel prop generators

  throw new Error('useTabs: Implementation pending');
}
