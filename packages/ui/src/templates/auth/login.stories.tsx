/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LoginTemplateComponent } from './login';
import { Checkbox } from '../../components/checkbox';
import { Label } from '../../components/label';
import { Button } from '../../components/button';

const meta = {
  title: 'Templates/Auth/Login',
  component: LoginTemplateComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginTemplateComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default login template
 * Accessibility: Fully accessible form with proper labels and ARIA attributes
 */
export const Default: Story = {
  args: {},
};

/**
 * Custom branding and text
 */
export const CustomBranding: Story = {
  args: {
    texts: {
      title: 'Sign In to Tekton',
      subtitle: 'Access your account',
      button_label: 'Continue',
    },
    slots: {
      logo: (
        <div className="flex justify-center">
          <div className="text-4xl font-bold text-[var(--tekton-bg-primary)]">T</div>
        </div>
      ),
    },
  },
};

/**
 * With forgot password link
 */
export const WithForgotPassword: Story = {
  args: {
    slots: {
      forgotPassword: (
        <a href="#" className="text-sm text-[var(--tekton-bg-primary)] hover:underline">
          Forgot password?
        </a>
      ),
    },
  },
};

/**
 * With remember me checkbox
 */
export const WithRememberMe: Story = {
  args: {
    options: {
      remember_me: true,
    },
    slots: {
      rememberMe: (
        <>
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm cursor-pointer">
            Remember me
          </Label>
        </>
      ),
    },
  },
};

/**
 * With social login options
 */
export const WithSocialLogin: Story = {
  args: {
    options: {
      social_login: true,
    },
    slots: {
      socialLogin: (
        <>
          <Button variant="outline" className="w-full">
            <span className="mr-2">🔍</span>
            Google
          </Button>
          <Button variant="outline" className="w-full">
            <span className="mr-2">📘</span>
            GitHub
          </Button>
        </>
      ),
    },
  },
};

/**
 * Complete login form with all features
 */
export const Complete: Story = {
  args: {
    texts: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue to Tekton',
      button_label: 'Sign In',
    },
    options: {
      remember_me: true,
      social_login: true,
    },
    slots: {
      logo: (
        <div className="flex justify-center mb-4">
          <div className="text-4xl font-bold text-[var(--tekton-bg-primary)]">T</div>
        </div>
      ),
      forgotPassword: (
        <a href="#" className="text-sm text-[var(--tekton-bg-primary)] hover:underline">
          Forgot?
        </a>
      ),
      rememberMe: (
        <>
          <Checkbox id="remember-complete" />
          <Label htmlFor="remember-complete" className="text-sm cursor-pointer">
            Keep me signed in
          </Label>
        </>
      ),
      socialLogin: (
        <>
          <Button variant="outline" className="w-full">
            <span className="mr-2">🔍</span>
            Google
          </Button>
          <Button variant="outline" className="w-full">
            <span className="mr-2">📘</span>
            GitHub
          </Button>
        </>
      ),
      footer: (
        <div className="text-sm text-center w-full space-y-2">
          <p className="text-[var(--tekton-bg-muted-foreground)]">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-[var(--tekton-bg-primary)] hover:underline">
              Sign up for free
            </a>
          </p>
          <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
            By signing in, you agree to our{' '}
            <a href="#" className="hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      ),
    },
  },
};
