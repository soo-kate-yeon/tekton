/**
 * @tekton/ui - Component Library Index
 * [SPEC-COMPONENT-001-C]
 */

// Utility functions
export { cn } from './lib/utils';

// Primitive Components
export { Button, buttonVariants } from './primitives/button';
export type { ButtonProps } from './primitives/button';

export { Input } from './primitives/input';
export type { InputProps } from './primitives/input';

export { Checkbox } from './primitives/checkbox';

export { RadioGroup, RadioGroupItem } from './primitives/radio';

export { Switch } from './primitives/switch';

export { Slider } from './primitives/slider';

export { Text, textVariants } from './primitives/text';
export type { TextProps } from './primitives/text';

export { Heading, headingVariants } from './primitives/heading';
export type { HeadingProps } from './primitives/heading';

export { Badge, badgeVariants } from './primitives/badge';
export type { BadgeProps } from './primitives/badge';

export { Avatar, AvatarImage, AvatarFallback } from './primitives/avatar';

export { Progress } from './primitives/progress';

export { Link, linkVariants } from './primitives/link';
export type { LinkProps } from './primitives/link';

export { List, ListItem } from './primitives/list';

export { Image } from './primitives/image';
export type { ImageProps } from './primitives/image';

// Composed Components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/card';

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  useFormContext,
} from './components/form';

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from './components/modal';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownRadioGroup,
} from './components/dropdown';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';

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
