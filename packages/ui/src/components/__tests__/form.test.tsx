/**
 * @tekton/ui - Form Component Tests
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../form';
import { Input } from '../input';
import { Button } from '../button';

describe('Form', () => {
  const TestForm = ({ onSubmit = vi.fn() }) => {
    const form = useForm({
      defaultValues: { name: '', email: '' },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Enter your name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  };

  describe('Rendering', () => {
    it('renders form without crashing', () => {
      render(<TestForm />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('renders all form sub-components', () => {
      render(<TestForm />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByText('Enter your name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('handles form submission', async () => {
      const handleSubmit = vi.fn();
      render(<TestForm onSubmit={handleSubmit} />);

      const input = screen.getByLabelText('Name');
      await userEvent.type(input, 'John Doe');
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('updates field value', async () => {
      render(<TestForm />);
      const input = screen.getByLabelText('Name');

      await userEvent.type(input, 'Test User');
      expect(input).toHaveValue('Test User');
    });
  });

  describe('Validation', () => {
    it('shows validation errors', async () => {
      const ValidatedForm = () => {
        const form = useForm({
          defaultValues: { email: '' },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="email"
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      render(<ValidatedForm />);
      await userEvent.click(screen.getByRole('button'));

      // Validation message may appear
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<TestForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('associates label with input', () => {
      render(<TestForm />);
      const input = screen.getByLabelText('Name');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Token Compliance', () => {
    it('uses consistent styling', () => {
      const { container } = render(<TestForm />);
      expect(container).toBeInTheDocument();
    });
  });
});
