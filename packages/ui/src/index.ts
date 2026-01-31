/**
 * @tekton/ui - Component Library Index
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * This package provides a shadcn-ui based component library
 * fully integrated with Tekton's token system.
 */

// ========================================
// Utility Functions
// ========================================
export { cn } from './lib/utils';
export { tokenVars, isTokenReference, extractTokenName } from './lib/tokens';
export type { TektonTokenVars } from './lib/tokens';

export {
  themeToCSS,
  injectThemeCSS,
  getCurrentThemeId,
  setThemeId,
  oklchToCSS,
  resolveSemanticToken,
} from './lib/theme-loader';
export type { ThemeDefinition, OKLCHColor } from './lib/theme-loader';

// ========================================
// Tier 1: Core Components (15)
// ========================================

// Button
export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';

// Input
export { Input } from './components/input';
export type { InputProps } from './components/input';

// Label
export { Label } from './components/label';

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/card';

// Badge
export { Badge, badgeVariants } from './components/badge';
export type { BadgeProps } from './components/badge';

// Avatar
export { Avatar, AvatarImage, AvatarFallback } from './components/avatar';

// Separator
export { Separator } from './components/separator';

// Checkbox
export { Checkbox } from './components/checkbox';

// RadioGroup
export { RadioGroup, RadioGroupItem } from './components/radio-group';

// Switch
export { Switch } from './components/switch';

// Textarea
export { Textarea } from './components/textarea';
export type { TextareaProps } from './components/textarea';

// Skeleton
export { Skeleton } from './components/skeleton';

// ScrollArea
export { ScrollArea, ScrollBar } from './components/scroll-area';

// Form
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from './components/form';

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/select';

// ========================================
// Tier 2: Complex Components (10)
// ========================================

// Dialog
export {
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
} from './components/dialog';

// DropdownMenu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/dropdown-menu';

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table';

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';

// Toast
export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './components/toast';

// Tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/tooltip';

// Popover
export { Popover, PopoverTrigger, PopoverContent } from './components/popover';

// Sheet
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/sheet';

// AlertDialog
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/alert-dialog';

// Progress
export { Progress } from './components/progress';

// ========================================
// Templates
// Will be populated in Phase 3 (Day 5-7)
// ========================================
