import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabs } from '../../src/hooks/useTabs';
import type { TabItem } from '../../src/hooks/useTabs';

const mockTabs: TabItem[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

const mockTabsWithDisabled: TabItem[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2', disabled: true },
  { id: 'tab3', label: 'Tab 3' },
  { id: 'tab4', label: 'Tab 4', disabled: true },
];

describe('useTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with first tab active by default', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      expect(result.current.activeTab).toBe('tab1');
    });

    it('should initialize with defaultActiveTab', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab2' })
      );
      expect(result.current.activeTab).toBe('tab2');
    });

    it('should initialize with horizontal orientation by default', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      expect(result.current.tabListProps['aria-orientation']).toBe('horizontal');
    });
  });

  describe('Tab Selection', () => {
    it('should change active tab on click', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[1], 1);
        tabProps.onClick();
      });
      expect(result.current.activeTab).toBe('tab2');
    });

    it('should call onChange when tab changes', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, onChange })
      );
      act(() => {
        result.current.setActiveTab('tab3');
      });
      expect(onChange).toHaveBeenCalledWith('tab3');
    });

    it('should not select disabled tabs', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabsWithDisabled })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabsWithDisabled[1], 1);
        tabProps.onClick();
      });
      expect(result.current.activeTab).toBe('tab1');
    });
  });

  describe('Keyboard Navigation - Horizontal', () => {
    it('should navigate to next tab with ArrowRight', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowRight',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab2');
    });

    it('should navigate to previous tab with ArrowLeft', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab2' })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[1], 1);
        tabProps.onKeyDown({
          key: 'ArrowLeft',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab1');
    });

    it('should wrap to first tab from last with ArrowRight', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab3' })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[2], 2);
        tabProps.onKeyDown({
          key: 'ArrowRight',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab1');
    });

    it('should wrap to last tab from first with ArrowLeft', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowLeft',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab3');
    });

    it('should jump to first tab with Home key', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab3' })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[2], 2);
        tabProps.onKeyDown({
          key: 'Home',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab1');
    });

    it('should jump to last tab with End key', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'End',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab3');
    });

    it('should not navigate with ArrowUp/Down in horizontal mode', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      const initialTab = result.current.activeTab;

      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe(initialTab);

      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe(initialTab);
    });
  });

  describe('Keyboard Navigation - Vertical', () => {
    it('should navigate to next tab with ArrowDown', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, orientation: 'vertical' })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab2');
    });

    it('should navigate to previous tab with ArrowUp', () => {
      const { result } = renderHook(() =>
        useTabs({
          tabs: mockTabs,
          orientation: 'vertical',
          defaultActiveTab: 'tab2',
        })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[1], 1);
        tabProps.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab1');
    });

    it('should not navigate with ArrowLeft/Right in vertical mode', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, orientation: 'vertical' })
      );
      const initialTab = result.current.activeTab;

      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowRight',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe(initialTab);

      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowLeft',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe(initialTab);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="tablist" on tab list', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      expect(result.current.tabListProps.role).toBe('tablist');
    });

    it('should set aria-orientation based on orientation prop', () => {
      const { result: horizontal } = renderHook(() =>
        useTabs({ tabs: mockTabs, orientation: 'horizontal' })
      );
      expect(horizontal.current.tabListProps['aria-orientation']).toBe(
        'horizontal'
      );

      const { result: vertical } = renderHook(() =>
        useTabs({ tabs: mockTabs, orientation: 'vertical' })
      );
      expect(vertical.current.tabListProps['aria-orientation']).toBe('vertical');
    });

    it('should set role="tab" on each tab', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      const tabProps = result.current.getTabProps(mockTabs[0], 0);
      expect(tabProps.role).toBe('tab');
    });

    it('should set aria-selected=true on active tab', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab2' })
      );
      const tabProps = result.current.getTabProps(mockTabs[1], 1);
      expect(tabProps['aria-selected']).toBe(true);
    });

    it('should set aria-selected=false on inactive tabs', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab2' })
      );
      const tabProps = result.current.getTabProps(mockTabs[0], 0);
      expect(tabProps['aria-selected']).toBe(false);
    });

    it('should set aria-controls linking tab to panel', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      const tabProps = result.current.getTabProps(mockTabs[0], 0);
      const panelProps = result.current.getTabPanelProps('tab1');
      expect(tabProps['aria-controls']).toBe(panelProps.id);
    });

    it('should set role="tabpanel" on panels', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      const panelProps = result.current.getTabPanelProps('tab1');
      expect(panelProps.role).toBe('tabpanel');
    });

    it('should set aria-labelledby linking panel to tab', () => {
      const { result } = renderHook(() => useTabs({ tabs: mockTabs }));
      const tabProps = result.current.getTabProps(mockTabs[0], 0);
      const panelProps = result.current.getTabPanelProps('tab1');
      expect(panelProps['aria-labelledby']).toBe(tabProps.id);
    });

    it('should set tabIndex=0 on active tab', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab2' })
      );
      const tabProps = result.current.getTabProps(mockTabs[1], 1);
      expect(tabProps.tabIndex).toBe(0);
    });

    it('should set tabIndex=-1 on inactive tabs', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, defaultActiveTab: 'tab2' })
      );
      const tabProps = result.current.getTabProps(mockTabs[0], 0);
      expect(tabProps.tabIndex).toBe(-1);
    });
  });

  describe('Controlled Mode', () => {
    it('should work in controlled mode', () => {
      const { result, rerender } = renderHook(
        ({ activeTab }) => useTabs({ tabs: mockTabs, activeTab }),
        { initialProps: { activeTab: 'tab1' } }
      );
      expect(result.current.activeTab).toBe('tab1');
      rerender({ activeTab: 'tab2' });
      expect(result.current.activeTab).toBe('tab2');
    });

    it('should not update internal state in controlled mode', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, activeTab: 'tab1', onChange })
      );
      act(() => {
        result.current.setActiveTab('tab2');
      });
      expect(onChange).toHaveBeenCalledWith('tab2');
      expect(result.current.activeTab).toBe('tab1');
    });
  });

  describe('Disabled State', () => {
    it('should not change tabs when disabled', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabs, disabled: true })
      );
      const initialTab = result.current.activeTab;
      act(() => {
        const tabProps = result.current.getTabProps(mockTabs[1], 1);
        tabProps.onClick();
      });
      expect(result.current.activeTab).toBe(initialTab);
    });

    it('should set aria-disabled on disabled tabs', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabsWithDisabled })
      );
      const tabProps = result.current.getTabProps(mockTabsWithDisabled[1], 1);
      expect(tabProps['aria-disabled']).toBe(true);
    });

    it('should skip disabled tabs during keyboard navigation', () => {
      const { result } = renderHook(() =>
        useTabs({ tabs: mockTabsWithDisabled })
      );
      act(() => {
        const tabProps = result.current.getTabProps(mockTabsWithDisabled[0], 0);
        tabProps.onKeyDown({
          key: 'ArrowRight',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.activeTab).toBe('tab3');
    });
  });
});
