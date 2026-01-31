/**
 * @tekton/ui - Login Template
 * SPEC-UI-001 Phase 3: Authentication Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 로그인 템플릿이 인증 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 로그인 불가
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/card';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { Separator } from '../../components/separator';
import type { ScreenTemplate, ScreenTemplateProps } from '../types';
import { DEFAULT_RESPONSIVE_LAYOUT } from '../types';

/**
 * Login Template Component
 */
export function LoginTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Welcome Back';
  const subtitle = texts.subtitle || 'Sign in to your account';
  const buttonLabel = texts.button_label || 'Sign In';
  const showSocialLogin = options.social_login ?? false;
  const showRememberMe = options.remember_me ?? false;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--tekton-spacing-4)] ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          {slots.logo && <div className="mb-[var(--tekton-spacing-4)]">{slots.logo}</div>}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-[var(--tekton-spacing-4)]">
          {/* Email Input */}
          <div className="space-y-[var(--tekton-spacing-2)]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          {/* Password Input */}
          <div className="space-y-[var(--tekton-spacing-2)]">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {slots.forgotPassword && <div>{slots.forgotPassword}</div>}
            </div>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>

          {/* Remember Me */}
          {showRememberMe && slots.rememberMe && (
            <div className="flex items-center space-x-[var(--tekton-spacing-2)]">
              {slots.rememberMe}
            </div>
          )}

          {/* Sign In Button */}
          <Button className="w-full">{buttonLabel}</Button>

          {/* Social Login */}
          {showSocialLogin && slots.socialLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--tekton-bg-background)] px-[var(--tekton-spacing-2)] text-[var(--tekton-text-muted-foreground)]">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[var(--tekton-spacing-4)]">
                {slots.socialLogin}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          {slots.footer || (
            <p className="text-sm text-center w-full text-[var(--tekton-text-muted-foreground)]">
              Don&apos;t have an account?{' '}
              <a href="#" className="text-[var(--tekton-text-primary)] hover:underline">
                Sign up
              </a>
            </p>
          )}
        </CardFooter>
      </Card>
      {children}
    </div>
  );
}

/**
 * Login Template Definition
 */
export const LoginTemplate: ScreenTemplate = {
  id: 'auth.login',
  name: 'Login',
  category: 'auth',
  description: 'Standard login screen with email and password',

  skeleton: {
    shell: 'centered-card',
    page: 'auth-page',
    sections: [
      {
        id: 'login-form',
        name: 'Login Form',
        slot: 'main',
        required: true,
        Component: LoginTemplateComponent,
      },
    ],
  },

  layout: {
    type: 'centered',
    responsive: DEFAULT_RESPONSIVE_LAYOUT,
  },

  customizable: {
    texts: ['title', 'subtitle', 'button_label'],
    optional: ['social_login', 'remember_me'],
    slots: ['logo', 'forgotPassword', 'rememberMe', 'socialLogin', 'footer'],
  },

  requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label'],

  Component: LoginTemplateComponent,

  version: '1.0.0',
  created: '2026-01-31',
  updated: '2026-01-31',
  tags: ['auth', 'login', 'form'],
};
