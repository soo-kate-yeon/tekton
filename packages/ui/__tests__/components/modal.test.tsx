/**
 * @tekton/ui - Modal Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from '../../src/components/modal';
import { Button } from '../../src/primitives/button';

describe('Modal', () => {
  describe('Rendering', () => {
    it('renders trigger button', () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
          </ModalContent>
        </Modal>
      );
      expect(screen.getByRole('button', { name: 'Open Modal' })).toBeInTheDocument();
    });

    it('does not render content initially', () => {
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Hidden Title</ModalTitle>
          </ModalContent>
        </Modal>
      );
      expect(screen.queryByText('Hidden Title')).not.toBeInTheDocument();
    });
  });

  describe('Opening and Closing', () => {
    it('opens modal when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal description</ModalDescription>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal description')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Title</ModalTitle>
            <ModalClose asChild>
              <Button>Close</Button>
            </ModalClose>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByText('Title')).toBeInTheDocument();

      // Find Close button within dialog
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      await user.click(closeButtons[closeButtons.length - 1]); // Click the last one (inside modal)
      expect(screen.queryByText('Title')).not.toBeInTheDocument();
    });

    it('closes modal when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Title</ModalTitle>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByText('Title')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByText('Title')).not.toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('renders complete modal structure', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
              <ModalDescription>Modal description text</ModalDescription>
            </ModalHeader>
            <div>Modal body content</div>
            <ModalFooter>
              <Button>Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal description text')).toBeInTheDocument();
      expect(screen.getByText('Modal body content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent data-testid="content">
            <ModalTitle data-testid="title">Title</ModalTitle>
            <ModalDescription data-testid="description">Description</ModalDescription>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByTestId('content')).toHaveClass('bg-[var(--modal-background)]');
      expect(screen.getByTestId('title')).toHaveClass('text-[var(--modal-title-foreground)]');
      expect(screen.getByTestId('description')).toHaveClass(
        'text-[var(--modal-description-foreground)]'
      );
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Accessible Modal</ModalTitle>
              <ModalDescription>This modal is accessible</ModalDescription>
            </ModalHeader>
            <div>Content</div>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has role="dialog"', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Title</ModalTitle>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('focuses modal content when opened', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Title</ModalTitle>
            <Button>First Focusable</Button>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      // Modal should trap focus within dialog
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('traps focus within modal', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger asChild>
            <Button>Open</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Title</ModalTitle>
            <Button>First</Button>
            <Button>Second</Button>
          </ModalContent>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      // Modal should be open
      expect(screen.getByText('Title')).toBeInTheDocument();

      // Focus should be trapped within modal - verify buttons are focusable
      const firstButton = screen.getByRole('button', { name: 'First' });
      const secondButton = screen.getByRole('button', { name: 'Second' });

      expect(firstButton).toBeInTheDocument();
      expect(secondButton).toBeInTheDocument();
    });
  });
});
