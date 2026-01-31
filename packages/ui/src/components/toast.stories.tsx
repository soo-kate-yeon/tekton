/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider, ToastViewport } from './toast';
import { Button } from './button';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Toast notification system
 * Accessibility: Screen reader announcements with proper ARIA
 * Note: Toast typically uses a hook/context pattern for implementation
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show Toast</Button>
        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Notification</div>
            <div className="text-sm opacity-90">Your message has been sent.</div>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};

/**
 * Destructive variant
 */
export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <ToastProvider>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Show Error
        </Button>
        <Toast variant="destructive" open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Error</div>
            <div className="text-sm opacity-90">Failed to send message.</div>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};

/**
 * With action button
 */
export const WithAction: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Schedule Meeting</Button>
        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Meeting Scheduled</div>
            <div className="text-sm opacity-90">Friday, January 10 at 3:00 PM</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            View
          </Button>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};
