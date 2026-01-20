/**
 * Sample Knowledge Schema
 * Hardcoded knowledge for shadcn/ui components
 */

import type { KnowledgeSchema } from '@tekton/component-generator';

/**
 * Sample knowledge schema with common shadcn components
 */
export const SAMPLE_KNOWLEDGE_SCHEMA: KnowledgeSchema = {
  version: '1.0.0',
  components: [
    {
      componentName: 'Button',
      importPath: '@/components/ui/button',
      category: 'action',
      description: 'A clickable button component with multiple variants',
      slots: [
        {
          slotName: 'children',
          slotType: 'mixed',
          required: true,
          description: 'Button content (text, icons, or components)',
        },
      ],
      props: [
        {
          propName: 'variant',
          propType: 'enum',
          possibleValues: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
          defaultValue: 'default',
          description: 'Visual style variant',
        },
        {
          propName: 'size',
          propType: 'enum',
          possibleValues: ['default', 'sm', 'lg', 'icon'],
          defaultValue: 'default',
          description: 'Button size',
        },
        {
          propName: 'disabled',
          propType: 'boolean',
          defaultValue: false,
          description: 'Whether the button is disabled',
        },
      ],
    },
    {
      componentName: 'Card',
      importPath: '@/components/ui/card',
      category: 'layout',
      description: 'A container card component for grouping related content',
      slots: [
        {
          slotName: 'children',
          slotType: 'component',
          required: true,
          description: 'Card content (typically CardHeader, CardContent, CardFooter)',
        },
      ],
      props: [],
    },
    {
      componentName: 'CardHeader',
      importPath: '@/components/ui/card',
      category: 'layout',
      description: 'Card header section',
      slots: [
        {
          slotName: 'children',
          slotType: 'mixed',
          required: true,
        },
      ],
      props: [],
    },
    {
      componentName: 'CardContent',
      importPath: '@/components/ui/card',
      category: 'layout',
      description: 'Card main content section',
      slots: [
        {
          slotName: 'children',
          slotType: 'mixed',
          required: true,
        },
      ],
      props: [],
    },
    {
      componentName: 'CardFooter',
      importPath: '@/components/ui/card',
      category: 'layout',
      description: 'Card footer section',
      slots: [
        {
          slotName: 'children',
          slotType: 'mixed',
          required: true,
        },
      ],
      props: [],
    },
    {
      componentName: 'Input',
      importPath: '@/components/ui/input',
      category: 'input',
      description: 'Text input field',
      slots: [],
      props: [
        {
          propName: 'type',
          propType: 'enum',
          possibleValues: ['text', 'password', 'email', 'number', 'tel', 'url'],
          defaultValue: 'text',
        },
        {
          propName: 'placeholder',
          propType: 'string',
        },
        {
          propName: 'disabled',
          propType: 'boolean',
          defaultValue: false,
        },
        {
          propName: 'required',
          propType: 'boolean',
          defaultValue: false,
        },
      ],
    },
    {
      componentName: 'Label',
      importPath: '@/components/ui/label',
      category: 'input',
      description: 'Form label component',
      slots: [
        {
          slotName: 'children',
          slotType: 'text',
          required: true,
        },
      ],
      props: [
        {
          propName: 'htmlFor',
          propType: 'string',
          description: 'ID of the associated form control',
        },
      ],
    },
    {
      componentName: 'Dialog',
      importPath: '@/components/ui/dialog',
      category: 'feedback',
      description: 'Modal dialog component',
      slots: [
        {
          slotName: 'children',
          slotType: 'component',
          required: true,
          description: 'Dialog content (DialogTrigger, DialogContent)',
        },
      ],
      props: [],
    },
    {
      componentName: 'Alert',
      importPath: '@/components/ui/alert',
      category: 'feedback',
      description: 'Alert message component',
      slots: [
        {
          slotName: 'children',
          slotType: 'mixed',
          required: true,
        },
      ],
      props: [
        {
          propName: 'variant',
          propType: 'enum',
          possibleValues: ['default', 'destructive'],
          defaultValue: 'default',
        },
      ],
    },
    {
      componentName: 'Badge',
      importPath: '@/components/ui/badge',
      category: 'data-display',
      description: 'Small badge for labels and status',
      slots: [
        {
          slotName: 'children',
          slotType: 'text',
          required: true,
        },
      ],
      props: [
        {
          propName: 'variant',
          propType: 'enum',
          possibleValues: ['default', 'secondary', 'destructive', 'outline'],
          defaultValue: 'default',
        },
      ],
    },
  ],
};
