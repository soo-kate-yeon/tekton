/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size variant',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child component using Radix Slot',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with primary styling
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Destructive variant for dangerous actions
 * Accessibility: Uses semantic color for destructive actions
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

/**
 * Outline variant with border styling
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Secondary variant for less prominent actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Ghost variant with minimal styling
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

/**
 * Link variant styled as a link
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

/**
 * Small size variant
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

/**
 * Large size variant
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

/**
 * Icon-only button
 * Accessibility: Should include aria-label when used
 */
export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🔍',
    'aria-label': 'Search',
  },
};

/**
 * Disabled state
 * Accessibility: Disabled buttons are not keyboard accessible
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

/**
 * Interactive example with all variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Icon">
          🔍
        </Button>
      </div>
    </div>
  ),
};

/**
 * Loading state example
 */
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <span className="mr-2">⏳</span>
      Loading...
    </Button>
  ),
};

/**
 * With icon example
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button>
        <span className="mr-2">📧</span>
        Email
      </Button>
      <Button variant="outline">
        <span className="mr-2">📥</span>
        Download
      </Button>
    </div>
  ),
};
