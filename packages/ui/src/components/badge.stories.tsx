/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Badge visual style variant',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge with primary styling
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * Secondary variant
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Destructive variant for warnings
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

/**
 * Outline variant
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

/**
 * Status badges
 */
export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge>Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Inactive</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
};

/**
 * With icons
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge>
        <span className="mr-1">✓</span>
        Verified
      </Badge>
      <Badge variant="secondary">
        <span className="mr-1">⏳</span>
        Pending
      </Badge>
      <Badge variant="destructive">
        <span className="mr-1">✗</span>
        Failed
      </Badge>
    </div>
  ),
};

/**
 * With counts
 */
export const WithCounts: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge>New 12</Badge>
      <Badge variant="secondary">Messages 5</Badge>
      <Badge variant="destructive">Errors 3</Badge>
    </div>
  ),
};

/**
 * Large badges
 */
export const Large: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge className="px-4 py-2 text-sm">Large Badge</Badge>
      <Badge variant="secondary" className="px-4 py-2 text-sm">
        Large Secondary
      </Badge>
    </div>
  ),
};

/**
 * Small badges
 */
export const Small: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge className="px-2 py-0.5 text-[10px]">Tiny</Badge>
      <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
        Small
      </Badge>
    </div>
  ),
};
