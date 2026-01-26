/**
 * @tekton/ui - Form Component
 * [SPEC-COMPONENT-001-C] [COMPOSED]
 */

import * as React from 'react';
import { cn } from '../lib/utils';

type FormContextValue = {
  errors: Record<string, string>;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
};

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within Form');
  }
  return context;
};

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, children, ...props }, ref) => {
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const setError = React.useCallback((name: string, message: string) => {
      setErrors(prev => ({ ...prev, [name]: message }));
    }, []);

    const clearError = React.useCallback((name: string) => {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }, []);

    return (
      <FormContext.Provider value={{ errors, setError, clearError }}>
        <form ref={ref} className={cn('space-y-6', className)} {...props}>
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);
Form.displayName = 'Form';

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { name: string }
>(({ className, name, ...props }, ref) => {
  return <div ref={ref} className={cn('space-y-2', className)} {...props} />;
});
FormField.displayName = 'FormField';

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        'text-[var(--form-label-foreground)]',
        className
      )}
      {...props}
    />
  )
);
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />;
  }
);
FormControl.displayName = 'FormControl';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { name: string }
>(({ className, name, children, ...props }, ref) => {
  const { errors } = useFormContext();
  const error = errors[name];

  if (!error && !children) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn(
        'text-sm font-medium',
        'text-[var(--form-message-error-foreground)]',
        className
      )}
      {...props}
    >
      {error || children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormLabel, FormControl, FormMessage, useFormContext };
