/**
 * ComponentResolver
 * SPEC-PLAYGROUND-001 Milestone 5: Blueprint Renderer
 *
 * Maps component type strings to actual React components from @tekton/ui
 */

import type { ComponentType } from 'react';
import {
  // Primitives
  Button,
  Input,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,
  // Composed Components
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@tekton/ui';

/**
 * Component Map: String type -> React Component
 * Total: 20+ components from @tekton/ui
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENT_MAP: Record<string, ComponentType<any>> = {
  // Primitive Components (9)
  Button,
  Input,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Progress,

  // Composed Components (6 families)
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,

  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,

  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,

  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,

  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,

  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

/**
 * Resolve component type string to React component
 * @param type - Component type string (e.g., "Button", "Card")
 * @returns React component or null if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveComponent(type: string): ComponentType<any> | null {
  return COMPONENT_MAP[type] || null;
}
