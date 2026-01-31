/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { Button } from './button';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar
 * Accessibility: Includes proper ARIA attributes for screen readers
 */
export const Default: Story = {
  args: {
    value: 33,
    className: 'w-[60%]',
  },
};

/**
 * Different values
 */
export const Values: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>25%</span>
        </div>
        <Progress value={25} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>50%</span>
        </div>
        <Progress value={50} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>75%</span>
        </div>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

/**
 * Animated progress
 */
export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-[400px] space-y-4">
        <Progress value={progress} />
        <Button onClick={() => setProgress(0)}>Reset</Button>
      </div>
    );
  },
};

/**
 * File upload progress
 */
export const FileUpload: Story = {
  render: () => {
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const startUpload = () => {
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    };

    return (
      <div className="w-[400px] space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading document.pdf</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <Button onClick={startUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Start Upload'}
        </Button>
      </div>
    );
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <p className="text-sm">Small</p>
        <Progress value={60} className="h-2" />
      </div>
      <div className="space-y-2">
        <p className="text-sm">Default</p>
        <Progress value={60} />
      </div>
      <div className="space-y-2">
        <p className="text-sm">Large</p>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
};
