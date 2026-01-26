# Composed Components

Composed Components는 primitive 컴포넌트들을 조합하여 만든 복잡한 UI 패턴입니다. 총 6개의 composed 컴포넌트가 제공됩니다.

## 목차

1. [Card](#card)
2. [Form](#form)
3. [Modal](#modal)
4. [Dropdown](#dropdown)
5. [Tabs](#tabs)
6. [Table](#table)

---

## Card

카드 컨테이너 컴포넌트로 header/content/footer 구조를 제공합니다.

### 컴포넌트 구성

- **Card**: 카드 컨테이너
- **CardHeader**: 카드 헤더 영역
- **CardTitle**: 카드 제목
- **CardDescription**: 카드 설명/부제목
- **CardContent**: 카드 본문 영역
- **CardFooter**: 카드 푸터 영역

### Props

모든 Card 관련 컴포넌트는 해당 HTML 요소의 모든 props를 지원합니다.

| Component         | Type                   | Props                                  |
| ----------------- | ---------------------- | -------------------------------------- |
| `Card`            | `HTMLDivElement`       | `HTMLAttributes<HTMLDivElement>`       |
| `CardHeader`      | `HTMLDivElement`       | `HTMLAttributes<HTMLDivElement>`       |
| `CardTitle`       | `HTMLHeadingElement`   | `HTMLAttributes<HTMLHeadingElement>`   |
| `CardDescription` | `HTMLParagraphElement` | `HTMLAttributes<HTMLParagraphElement>` |
| `CardContent`     | `HTMLDivElement`       | `HTMLAttributes<HTMLDivElement>`       |
| `CardFooter`      | `HTMLDivElement`       | `HTMLAttributes<HTMLDivElement>`       |

### 사용 예시

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@tekton/ui';
import { Button } from '@tekton/ui';

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card without footer
<Card>
  <CardHeader>
    <CardTitle>Simple Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content without footer</p>
  </CardContent>
</Card>

// Card with custom content
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Input placeholder="Name" />
      <Input type="email" placeholder="Email" />
    </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>

// Multiple cards grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card>
    <CardHeader>
      <CardTitle>Feature 1</CardTitle>
    </CardHeader>
    <CardContent>Description</CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Feature 2</CardTitle>
    </CardHeader>
    <CardContent>Description</CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Feature 3</CardTitle>
    </CardHeader>
    <CardContent>Description</CardContent>
  </Card>
</div>
```

### 접근성 기능

- ✅ 의미론적 HTML 구조 (article/section/footer)
- ✅ 제목 계층 구조 자동 관리
- ✅ 카드 내 interactive 요소에 적절한 focus 순서

### CSS Variables

```css
--card-background
--card-foreground
--card-border
--card-header-spacing
--card-content-spacing
--card-footer-spacing
--card-radius
```

### 디자인 패턴

**Product Card:**

```tsx
<Card>
  <CardHeader>
    <Image src="/product.jpg" alt="Product" />
  </CardHeader>
  <CardContent>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>$99.99</CardDescription>
    <Text size="sm">Product description here</Text>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Add to Cart</Button>
  </CardFooter>
</Card>
```

**Stat Card:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Total Users</CardTitle>
    <CardDescription>Last 30 days</CardDescription>
  </CardHeader>
  <CardContent>
    <Heading level={2}>12,345</Heading>
    <Badge variant="primary">+12.5%</Badge>
  </CardContent>
</Card>
```

---

## Form

폼 컴포넌트로 검증 컨텍스트 및 오류 처리를 제공합니다.

### 컴포넌트 구성

- **Form**: 폼 컨테이너
- **FormField**: 폼 필드 래퍼
- **FormLabel**: 폼 레이블
- **FormControl**: 입력 컨트롤 래퍼
- **FormDescription**: 필드 설명
- **FormMessage**: 오류 메시지

### Props

#### Form Props

| Prop       | Type                                  | Default | Description          |
| ---------- | ------------------------------------- | ------- | -------------------- |
| `onSubmit` | `FormEventHandler<HTMLFormElement>`   | -       | 폼 제출 핸들러       |
| `children` | `ReactNode`                           | -       | 폼 필드들            |
| ...rest    | `FormHTMLAttributes<HTMLFormElement>` | -       | 모든 form 요소 props |

#### FormField Props

| Prop       | Type                             | Default      | Description                    |
| ---------- | -------------------------------- | ------------ | ------------------------------ |
| `name`     | `string`                         | **required** | 필드 이름 (오류 메시지 연결용) |
| `children` | `ReactNode`                      | -            | 필드 내용                      |
| ...rest    | `HTMLAttributes<HTMLDivElement>` | -            | 모든 div 요소 props            |

#### FormLabel Props

| Prop       | Type                                    | Default | Description           |
| ---------- | --------------------------------------- | ------- | --------------------- |
| `htmlFor`  | `string`                                | -       | 연결할 입력 요소 ID   |
| `children` | `ReactNode`                             | -       | 레이블 텍스트         |
| ...rest    | `LabelHTMLAttributes<HTMLLabelElement>` | -       | 모든 label 요소 props |

#### FormControl Props

| Prop       | Type                             | Default | Description                      |
| ---------- | -------------------------------- | ------- | -------------------------------- |
| `children` | `ReactNode`                      | -       | 입력 컨트롤 (Input, Checkbox 등) |
| ...rest    | `HTMLAttributes<HTMLDivElement>` | -       | 모든 div 요소 props              |

#### FormDescription Props

| Prop       | Type                                   | Default | Description       |
| ---------- | -------------------------------------- | ------- | ----------------- |
| `children` | `ReactNode`                            | -       | 설명 텍스트       |
| ...rest    | `HTMLAttributes<HTMLParagraphElement>` | -       | 모든 p 요소 props |

#### FormMessage Props

| Prop       | Type                                   | Default | Description        |
| ---------- | -------------------------------------- | ------- | ------------------ |
| `name`     | `string`                               | -       | 연결할 필드 이름   |
| `children` | `ReactNode`                            | -       | 오류 메시지 텍스트 |
| ...rest    | `HTMLAttributes<HTMLParagraphElement>` | -       | 모든 p 요소 props  |

### 사용 예시

```tsx
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@tekton/ui';
import { Input, Button } from '@tekton/ui';

// Basic form
<Form onSubmit={(e) => {
  e.preventDefault();
  // Handle form submission
}}>
  <FormField name="email">
    <FormLabel htmlFor="email">Email</FormLabel>
    <FormControl>
      <Input id="email" type="email" placeholder="you@example.com" />
    </FormControl>
    <FormDescription>We'll never share your email.</FormDescription>
    <FormMessage name="email">Invalid email address</FormMessage>
  </FormField>

  <Button type="submit">Submit</Button>
</Form>

// Form with multiple fields
<Form onSubmit={handleSubmit}>
  <FormField name="username">
    <FormLabel htmlFor="username">Username</FormLabel>
    <FormControl>
      <Input id="username" type="text" />
    </FormControl>
    <FormMessage name="username" />
  </FormField>

  <FormField name="password">
    <FormLabel htmlFor="password">Password</FormLabel>
    <FormControl>
      <Input id="password" type="password" />
    </FormControl>
    <FormDescription>At least 8 characters</FormDescription>
    <FormMessage name="password" />
  </FormField>

  <FormField name="terms">
    <FormControl>
      <Checkbox id="terms" />
      <FormLabel htmlFor="terms">
        I agree to the terms and conditions
      </FormLabel>
    </FormControl>
    <FormMessage name="terms" />
  </FormField>

  <Button type="submit">Create Account</Button>
</Form>

// Form with validation state
const [errors, setErrors] = useState({});

<Form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const email = formData.get('email');

  if (!email || !email.includes('@')) {
    setErrors({ email: 'Invalid email address' });
    return;
  }

  // Submit form
  setErrors({});
}}>
  <FormField name="email">
    <FormLabel htmlFor="email">Email</FormLabel>
    <FormControl>
      <Input
        id="email"
        name="email"
        type="email"
        aria-invalid={!!errors.email}
      />
    </FormControl>
    {errors.email && (
      <FormMessage name="email">{errors.email}</FormMessage>
    )}
  </FormField>

  <Button type="submit">Submit</Button>
</Form>
```

### 접근성 기능

- ✅ `<form>` 의미론적 요소 사용
- ✅ Label과 input 자동 연결 (htmlFor/id)
- ✅ `aria-describedby`로 설명 및 오류 메시지 연결
- ✅ `aria-invalid` 상태 지원
- ✅ 키보드 네비게이션 (Tab, Enter)

### CSS Variables

```css
--form-label-foreground
--form-message-destructive
--form-description-foreground
--form-field-spacing
```

### 폼 검증 패턴

**React Hook Form 통합 예시:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField name="email">
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormControl>
          <Input id="email" {...register('email')} aria-invalid={!!errors.email} />
        </FormControl>
        {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
      </FormField>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

---

## Modal

모달/다이얼로그 오버레이 컴포넌트로 Portal 렌더링을 지원합니다.

### 컴포넌트 구성

- **Modal**: 모달 컨텍스트 제공자
- **ModalTrigger**: 모달 열기 트리거
- **ModalContent**: 모달 컨텐츠 컨테이너
- **ModalHeader**: 모달 헤더
- **ModalTitle**: 모달 제목
- **ModalDescription**: 모달 설명
- **ModalFooter**: 모달 푸터 (액션 버튼 영역)
- **ModalClose**: 모달 닫기 버튼

### Props

모든 Modal 컴포넌트는 Radix UI Dialog의 props를 상속받습니다.

| Component          | Base Props                       | Additional                            |
| ------------------ | -------------------------------- | ------------------------------------- |
| `Modal`            | `RadixDialogProps`               | `open`, `onOpenChange`, `defaultOpen` |
| `ModalTrigger`     | `RadixDialogTriggerProps`        | `asChild` (자식을 트리거로 사용)      |
| `ModalContent`     | `RadixDialogContentProps`        | Portal 자동 적용                      |
| `ModalHeader`      | `HTMLAttributes<HTMLDivElement>` | -                                     |
| `ModalTitle`       | `RadixDialogTitleProps`          | -                                     |
| `ModalDescription` | `RadixDialogDescriptionProps`    | -                                     |
| `ModalFooter`      | `HTMLAttributes<HTMLDivElement>` | -                                     |
| `ModalClose`       | `RadixDialogCloseProps`          | `asChild`                             |

### 사용 예시

```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose
} from '@tekton/ui';
import { Button } from '@tekton/ui';

// Basic modal
<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description text</ModalDescription>
    </ModalHeader>
    <div>Modal body content goes here</div>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="primary">Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Controlled modal
const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button>Open</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Are you sure?</ModalTitle>
      <ModalDescription>
        This action cannot be undone.
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          // Perform action
          setOpen(false);
        }}
      >
        Delete
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Modal with form
<Modal>
  <ModalTrigger asChild>
    <Button>Add User</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Add New User</ModalTitle>
      <ModalDescription>
        Enter user details below
      </ModalDescription>
    </ModalHeader>
    <Form onSubmit={handleSubmit}>
      <FormField name="name">
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormControl>
          <Input id="name" placeholder="John Doe" />
        </FormControl>
      </FormField>
      <FormField name="email">
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormControl>
          <Input id="email" type="email" placeholder="john@example.com" />
        </FormControl>
      </FormField>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline">Cancel</Button>
        </ModalClose>
        <Button type="submit">Add User</Button>
      </ModalFooter>
    </Form>
  </ModalContent>
</Modal>

// Alert dialog pattern
<Modal>
  <ModalTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Delete Account</ModalTitle>
      <ModalDescription>
        This will permanently delete your account and all data.
        This action cannot be undone.
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="destructive" onClick={handleDelete}>
        Delete Account
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### 접근성 기능

- ✅ `role="dialog"` 자동 적용
- ✅ `aria-labelledby` (ModalTitle과 자동 연결)
- ✅ `aria-describedby` (ModalDescription과 자동 연결)
- ✅ Focus trap (모달 내부로 focus 제한)
- ✅ Escape 키로 닫기
- ✅ Overlay 클릭으로 닫기
- ✅ Portal 렌더링 (body 직하위)

### CSS Variables

```css
--modal-background
--modal-border
--modal-overlay-background
--modal-title-foreground
--modal-description-foreground
--modal-max-width
--modal-radius
--modal-animation-duration
```

### 모달 패턴

**Confirmation Dialog:**

```tsx
<Modal>
  <ModalTrigger asChild>
    <Button>Logout</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Logout</ModalTitle>
      <ModalDescription>Are you sure you want to logout?</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button onClick={handleLogout}>Logout</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**Multi-step Modal:**

```tsx
const [step, setStep] = useState(1);

<Modal>
  <ModalTrigger asChild>
    <Button>Start Wizard</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Step {step} of 3</ModalTitle>
    </ModalHeader>
    {step === 1 && <Step1Content />}
    {step === 2 && <Step2Content />}
    {step === 3 && <Step3Content />}
    <ModalFooter>
      {step > 1 && (
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Back
        </Button>
      )}
      {step < 3 ? (
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      ) : (
        <ModalClose asChild>
          <Button>Finish</Button>
        </ModalClose>
      )}
    </ModalFooter>
  </ModalContent>
</Modal>;
```

---

## Dropdown

드롭다운 메뉴 컴포넌트로 키보드 네비게이션을 지원합니다.

### 컴포넌트 구성

- **Dropdown**: 드롭다운 컨텍스트 제공자
- **DropdownTrigger**: 드롭다운 열기 트리거
- **DropdownContent**: 드롭다운 컨텐츠 컨테이너
- **DropdownItem**: 드롭다운 아이템
- **DropdownSeparator**: 구분선

### Props

#### Dropdown Props

| Prop           | Type                      | Default | Description                      |
| -------------- | ------------------------- | ------- | -------------------------------- |
| `open`         | `boolean`                 | -       | 제어된 열림 상태                 |
| `onOpenChange` | `(open: boolean) => void` | -       | 상태 변경 핸들러                 |
| `defaultOpen`  | `boolean`                 | `false` | 기본 열림 상태                   |
| ...rest        | `RadixDropdownMenuProps`  | -       | 모든 Radix UI DropdownMenu props |

#### DropdownTrigger Props

| Prop      | Type                            | Default | Description                 |
| --------- | ------------------------------- | ------- | --------------------------- |
| `asChild` | `boolean`                       | `false` | 자식을 트리거로 사용        |
| ...rest   | `RadixDropdownMenuTriggerProps` | -       | 모든 Radix UI trigger props |

#### DropdownContent Props

| Prop         | Type                            | Default    | Description                 |
| ------------ | ------------------------------- | ---------- | --------------------------- |
| `align`      | `"start" \| "center" \| "end"`  | `"center"` | 정렬 방식                   |
| `sideOffset` | `number`                        | `4`        | 트리거와의 간격 (px)        |
| ...rest      | `RadixDropdownMenuContentProps` | -          | 모든 Radix UI content props |

#### DropdownItem Props

| Prop       | Type                         | Default | Description              |
| ---------- | ---------------------------- | ------- | ------------------------ |
| `onClick`  | `MouseEventHandler`          | -       | 클릭 핸들러              |
| `disabled` | `boolean`                    | `false` | 비활성화 상태            |
| ...rest    | `RadixDropdownMenuItemProps` | -       | 모든 Radix UI item props |

### 사용 예시

```tsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator
} from '@tekton/ui';
import { Button } from '@tekton/ui';

// Basic dropdown
<Dropdown>
  <DropdownTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem onClick={() => console.log('Edit')}>Edit</DropdownItem>
    <DropdownItem onClick={() => console.log('Duplicate')}>Duplicate</DropdownItem>
    <DropdownSeparator />
    <DropdownItem disabled>Disabled Item</DropdownItem>
    <DropdownItem onClick={() => console.log('Delete')}>Delete</DropdownItem>
  </DropdownContent>
</Dropdown>

// Dropdown with icons
<Dropdown>
  <DropdownTrigger asChild>
    <Button variant="outline">
      Actions
    </Button>
  </DropdownTrigger>
  <DropdownContent align="end">
    <DropdownItem onClick={handleEdit}>
      <EditIcon /> Edit
    </DropdownItem>
    <DropdownItem onClick={handleDuplicate}>
      <CopyIcon /> Duplicate
    </DropdownItem>
    <DropdownSeparator />
    <DropdownItem onClick={handleDelete}>
      <TrashIcon /> Delete
    </DropdownItem>
  </DropdownContent>
</Dropdown>

// Controlled dropdown
const [open, setOpen] = useState(false);

<Dropdown open={open} onOpenChange={setOpen}>
  <DropdownTrigger asChild>
    <Button>Menu</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem onClick={() => {
      console.log('Action');
      setOpen(false);
    }}>
      Action
    </DropdownItem>
  </DropdownContent>
</Dropdown>

// Dropdown in table row
<Table>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="ghost" size="sm">...</Button>
          </DropdownTrigger>
          <DropdownContent align="end">
            <DropdownItem onClick={() => handleView(row.id)}>
              View
            </DropdownItem>
            <DropdownItem onClick={() => handleEdit(row.id)}>
              Edit
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem onClick={() => handleDelete(row.id)}>
              Delete
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 접근성 기능

- ✅ `role="menu"` 자동 적용
- ✅ 키보드 네비게이션 (Arrow keys)
- ✅ Enter/Space로 아이템 선택
- ✅ Escape로 메뉴 닫기
- ✅ `aria-expanded` 상태 관리
- ✅ Focus 관리 (첫 번째 아이템으로 focus 이동)

### CSS Variables

```css
--dropdown-background
--dropdown-border
--dropdown-item-hover-background
--dropdown-item-focus-background
--dropdown-item-disabled-opacity
--dropdown-separator-color
--dropdown-radius
--dropdown-animation-duration
```

### 드롭다운 패턴

**User Menu:**

```tsx
<Dropdown>
  <DropdownTrigger asChild>
    <Button variant="ghost">
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownTrigger>
  <DropdownContent align="end">
    <DropdownItem onClick={() => navigate('/profile')}>Profile</DropdownItem>
    <DropdownItem onClick={() => navigate('/settings')}>Settings</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
  </DropdownContent>
</Dropdown>
```

---

## Tabs

탭 네비게이션 컴포넌트로 자동 ARIA 레이블을 지원합니다.

### 컴포넌트 구성

- **Tabs**: 탭 컨텍스트 제공자
- **TabsList**: 탭 버튼 컨테이너
- **TabsTrigger**: 개별 탭 버튼
- **TabsContent**: 탭 컨텐츠 패널

### Props

#### Tabs Props

| Prop            | Type                      | Default | Description              |
| --------------- | ------------------------- | ------- | ------------------------ |
| `value`         | `string`                  | -       | 제어된 활성 탭           |
| `defaultValue`  | `string`                  | -       | 기본 활성 탭             |
| `onValueChange` | `(value: string) => void` | -       | 탭 변경 핸들러           |
| ...rest         | `RadixTabsProps`          | -       | 모든 Radix UI Tabs props |

#### TabsList Props

| Prop       | Type                 | Default | Description                  |
| ---------- | -------------------- | ------- | ---------------------------- |
| `children` | `ReactNode`          | -       | TabsTrigger 컴포넌트들       |
| ...rest    | `RadixTabsListProps` | -       | 모든 Radix UI TabsList props |

#### TabsTrigger Props

| Prop       | Type                    | Default      | Description                     |
| ---------- | ----------------------- | ------------ | ------------------------------- |
| `value`    | `string`                | **required** | 탭 고유 값                      |
| `disabled` | `boolean`               | `false`      | 비활성화 상태                   |
| `children` | `ReactNode`             | -            | 탭 레이블                       |
| ...rest    | `RadixTabsTriggerProps` | -            | 모든 Radix UI TabsTrigger props |

#### TabsContent Props

| Prop       | Type                    | Default      | Description                     |
| ---------- | ----------------------- | ------------ | ------------------------------- |
| `value`    | `string`                | **required** | 연결된 탭 값                    |
| `children` | `ReactNode`             | -            | 탭 컨텐츠                       |
| ...rest    | `RadixTabsContentProps` | -            | 모든 Radix UI TabsContent props |

### 사용 예시

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@tekton/ui';

// Basic tabs
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Content for Tab 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Content for Tab 2</p>
  </TabsContent>
  <TabsContent value="tab3">
    <p>Content for Tab 3</p>
  </TabsContent>
</Tabs>

// Controlled tabs
const [activeTab, setActiveTab] = useState('overview');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        Overview content
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="details">
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        Details content
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="settings">
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        Settings content
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>

// Tabs with disabled tab
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2" disabled>Tab 2 (Disabled)</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
  <TabsContent value="tab3">Content 3</TabsContent>
</Tabs>

// Tabs with icons
<Tabs defaultValue="home">
  <TabsList>
    <TabsTrigger value="home">
      <HomeIcon /> Home
    </TabsTrigger>
    <TabsTrigger value="profile">
      <UserIcon /> Profile
    </TabsTrigger>
    <TabsTrigger value="settings">
      <SettingsIcon /> Settings
    </TabsTrigger>
  </TabsList>
  <TabsContent value="home">Home content</TabsContent>
  <TabsContent value="profile">Profile content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>
```

### 접근성 기능

- ✅ `role="tablist"`, `role="tab"`, `role="tabpanel"` 자동 적용
- ✅ 키보드 네비게이션 (Arrow keys, Home, End)
- ✅ `aria-selected` 상태 자동 관리
- ✅ `aria-controls`로 탭과 패널 연결
- ✅ Focus 관리 (선택된 탭으로 focus 이동)

### CSS Variables

```css
--tabs-background
--tabs-list-background
--tabs-trigger-foreground
--tabs-trigger-hover-background
--tabs-trigger-active-background
--tabs-trigger-active-foreground
--tabs-content-background
--tabs-border
```

### 탭 패턴

**Settings Tabs:**

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Form>
      <FormField name="name">
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input placeholder="Your name" />
        </FormControl>
      </FormField>
      <Button>Save Changes</Button>
    </Form>
  </TabsContent>
  <TabsContent value="security">
    <Form>
      <FormField name="password">
        <FormLabel>New Password</FormLabel>
        <FormControl>
          <Input type="password" />
        </FormControl>
      </FormField>
      <Button>Update Password</Button>
    </Form>
  </TabsContent>
  <TabsContent value="notifications">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label>Email notifications</label>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <label>Push notifications</label>
        <Switch />
      </div>
    </div>
  </TabsContent>
</Tabs>
```

---

## Table

데이터 테이블 컴포넌트로 의미론적 HTML 구조를 제공합니다.

### 컴포넌트 구성

- **Table**: 테이블 컨테이너
- **TableCaption**: 테이블 캡션
- **TableHeader**: 테이블 헤더 (thead)
- **TableBody**: 테이블 본문 (tbody)
- **TableFooter**: 테이블 푸터 (tfoot)
- **TableRow**: 테이블 행 (tr)
- **TableHead**: 헤더 셀 (th)
- **TableCell**: 데이터 셀 (td)

### Props

모든 Table 컴포넌트는 해당 HTML 요소의 모든 props를 지원합니다.

| Component      | Type                      | Props                                     |
| -------------- | ------------------------- | ----------------------------------------- |
| `Table`        | `HTMLTableElement`        | `TableHTMLAttributes<HTMLTableElement>`   |
| `TableCaption` | `HTMLTableCaptionElement` | `HTMLAttributes<HTMLTableCaptionElement>` |
| `TableHeader`  | `HTMLTableSectionElement` | `HTMLAttributes<HTMLTableSectionElement>` |
| `TableBody`    | `HTMLTableSectionElement` | `HTMLAttributes<HTMLTableSectionElement>` |
| `TableFooter`  | `HTMLTableSectionElement` | `HTMLAttributes<HTMLTableSectionElement>` |
| `TableRow`     | `HTMLTableRowElement`     | `HTMLAttributes<HTMLTableRowElement>`     |
| `TableHead`    | `HTMLTableCellElement`    | `ThHTMLAttributes<HTMLTableCellElement>`  |
| `TableCell`    | `HTMLTableCellElement`    | `TdHTMLAttributes<HTMLTableCellElement>`  |

### 사용 예시

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from '@tekton/ui';

// Basic table
<Table>
  <TableCaption>List of users</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Jane Smith</TableCell>
      <TableCell>jane@example.com</TableCell>
      <TableCell>User</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total: 2 users</TableCell>
    </TableRow>
  </TableFooter>
</Table>

// Table with actions
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant={user.active ? 'primary' : 'secondary'}>
            {user.active ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell>
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="ghost" size="sm">...</Button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem onClick={() => handleEdit(user.id)}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => handleDelete(user.id)}>
                Delete
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Sortable table
const [sortBy, setSortBy] = useState('name');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => handleSort('name')}
        >
          Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Button>
      </TableHead>
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => handleSort('email')}
        >
          Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Button>
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sortedUsers.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Table with selection
const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <Checkbox
          checked={selectedRows.size === users.length}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedRows(new Set(users.map(u => u.id)));
            } else {
              setSelectedRows(new Set());
            }
          }}
        />
      </TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>
          <Checkbox
            checked={selectedRows.has(user.id)}
            onCheckedChange={(checked) => {
              const newSelection = new Set(selectedRows);
              if (checked) {
                newSelection.add(user.id);
              } else {
                newSelection.delete(user.id);
              }
              setSelectedRows(newSelection);
            }}
          />
        </TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 접근성 기능

- ✅ 의미론적 테이블 요소 (table, thead, tbody, tfoot, tr, th, td)
- ✅ `<caption>` 요소로 테이블 설명
- ✅ `scope` 속성으로 헤더 셀 범위 지정 가능
- ✅ 키보드 네비게이션 (Tab)
- ✅ 스크린 리더 지원

### CSS Variables

```css
--table-background
--table-border
--table-header-background
--table-header-foreground
--table-row-hover-background
--table-cell-padding
```

### 테이블 패턴

**Data Grid with Pagination:**

```tsx
const [page, setPage] = useState(1);
const pageSize = 10;
const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

<div>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {paginatedUsers.map(user => (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.role}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  <div className="flex justify-between items-center mt-4">
    <Text>
      Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, users.length)} of{' '}
      {users.length}
    </Text>
    <div className="flex gap-2">
      <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </Button>
      <Button
        variant="outline"
        disabled={page * pageSize >= users.length}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  </div>
</div>;
```

---

## 공통 패턴 및 Best Practices

### 컴포넌트 조합

Composed 컴포넌트들은 서로 조합하여 사용할 수 있습니다:

```tsx
// Card + Form + Modal
<Modal>
  <ModalTrigger asChild>
    <Button>Create Item</Button>
  </ModalTrigger>
  <ModalContent>
    <Card>
      <CardHeader>
        <CardTitle>New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <FormField name="title">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" />
            </FormControl>
          </FormField>
          <Button type="submit">Create</Button>
        </Form>
      </CardContent>
    </Card>
  </ModalContent>
</Modal>

// Table + Dropdown + Tabs
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All Users</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
    <TabsTrigger value="inactive">Inactive</TabsTrigger>
  </TabsList>
  <TabsContent value="all">
    <Table>
      {/* Table content with Dropdown actions */}
    </Table>
  </TabsContent>
</Tabs>
```

### 테마 커스터마이징

모든 composed 컴포넌트는 CSS Variables로 커스터마이징 가능합니다:

```css
/* theme.css */
@import '@tekton/ui/styles';

:root {
  /* Card */
  --card-background: #ffffff;
  --card-border: #e5e7eb;

  /* Modal */
  --modal-overlay-background: rgba(0, 0, 0, 0.5);
  --modal-background: #ffffff;

  /* Dropdown */
  --dropdown-background: #ffffff;
  --dropdown-item-hover-background: #f3f4f6;

  /* Tabs */
  --tabs-trigger-active-background: #3b82f6;

  /* Table */
  --table-row-hover-background: #f9fafb;
}
```

---

**버전**: 1.0.0
**최종 업데이트**: 2026-01-26
**문서 관리**: Tekton Team
