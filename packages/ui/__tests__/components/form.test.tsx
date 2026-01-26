/**
 * @tekton/ui - Form Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '../../src/components/form';
import { Input } from '../../src/primitives/input';

describe('Form', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(
        <Form data-testid="form">
          <FormField name="test">
            <FormLabel>Test Label</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormField>
        </Form>
      );
      expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    it('renders all form sub-components', () => {
      render(
        <Form>
          <FormField name="email">
            <FormLabel data-testid="label">Email</FormLabel>
            <FormControl data-testid="control">
              <Input type="email" />
            </FormControl>
            <FormMessage name="email" data-testid="message">
              Error message
            </FormMessage>
          </FormField>
        </Form>
      );

      expect(screen.getByTestId('label')).toBeInTheDocument();
      expect(screen.getByTestId('control')).toBeInTheDocument();
      expect(screen.getByTestId('message')).toBeInTheDocument();
    });
  });

  describe('Form Field Structure', () => {
    it('associates label with input using htmlFor', () => {
      render(
        <Form>
          <FormField name="username">
            <FormLabel htmlFor="username-input">Username</FormLabel>
            <FormControl>
              <Input id="username-input" />
            </FormControl>
          </FormField>
        </Form>
      );

      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username-input');
    });

    it('renders error messages', () => {
      render(
        <Form>
          <FormField name="email">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input error />
            </FormControl>
            <FormMessage name="email">Invalid email address</FormMessage>
          </FormField>
        </Form>
      );

      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('supports multiple form fields', () => {
      render(
        <Form>
          <FormField name="firstName">
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormField>
          <FormField name="lastName">
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormField>
        </Form>
      );

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('handles form submit event', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn(e => e.preventDefault());

      render(
        <Form onSubmit={handleSubmit} data-testid="form">
          <FormField name="test">
            <FormLabel>Test</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Form>
          <FormField name="test">
            <FormLabel data-testid="label">Label</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
            <FormMessage name="test" data-testid="message">
              Message
            </FormMessage>
          </FormField>
        </Form>
      );

      expect(screen.getByTestId('label')).toHaveClass('text-[var(--form-label-foreground)]');
      expect(screen.getByTestId('message')).toHaveClass(
        'text-[var(--form-message-error-foreground)]'
      );
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Form>
          <FormField name="username">
            <FormLabel htmlFor="username">Username</FormLabel>
            <FormControl>
              <Input id="username" />
            </FormControl>
          </FormField>
          <FormField name="email">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input id="email" type="email" />
            </FormControl>
          </FormField>
        </Form>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('associates error messages with inputs using aria-describedby', () => {
      render(
        <Form>
          <FormField name="email">
            <FormLabel htmlFor="email-input">Email</FormLabel>
            <FormControl>
              <Input id="email-input" error aria-describedby="email-error" />
            </FormControl>
            <FormMessage name="email" id="email-error">
              Invalid email
            </FormMessage>
          </FormField>
        </Form>
      );

      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('supports custom className', () => {
      render(
        <Form className="custom-form" data-testid="form">
          <FormField name="test">
            <FormLabel>Test</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormField>
        </Form>
      );
      expect(screen.getByTestId('form')).toHaveClass('custom-form');
    });
  });
});
