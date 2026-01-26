# Primitive Components

Primitive Components는 단일 책임을 가진 핵심 UI 빌딩 블록입니다. 총 14개의 primitive 컴포넌트가 제공됩니다.

## 목차

1. [Button](#button)
2. [Input](#input)
3. [Checkbox](#checkbox)
4. [RadioGroup](#radiogroup)
5. [Switch](#switch)
6. [Slider](#slider)
7. [Text](#text)
8. [Heading](#heading)
9. [Badge](#badge)
10. [Avatar](#avatar)
11. [Progress](#progress)
12. [Link](#link)
13. [Image](#image)
14. [List](#list)

---

## Button

인터랙티브 버튼 컴포넌트로 로딩 상태 및 다양한 variant를 지원합니다.

### Props

| Prop       | Type                                                                                       | Default     | Description                |
| ---------- | ------------------------------------------------------------------------------------------ | ----------- | -------------------------- |
| `variant`  | `"default" \| "primary" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` | 버튼 스타일 variant        |
| `size`     | `"sm" \| "md" \| "lg"`                                                                     | `"md"`      | 버튼 크기                  |
| `loading`  | `boolean`                                                                                  | `false`     | 로딩 상태 표시             |
| `disabled` | `boolean`                                                                                  | `false`     | 비활성화 상태              |
| ...rest    | `ButtonHTMLAttributes<HTMLButtonElement>`                                                  | -           | 모든 네이티브 button props |

### 사용 예시

```tsx
import { Button } from '@tekton/ui';

// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// Event handling
<Button onClick={() => console.log('Clicked')}>
  Click me
</Button>
```

### 접근성 기능

- ✅ 키보드 네비게이션 (Enter, Space)
- ✅ Focus 표시 (--button-focus-ring)
- ✅ `disabled` 상태 시 ARIA 지원
- ✅ `loading` 상태 시 `aria-busy` 자동 추가

### CSS Variables

```css
--button-default-background
--button-default-foreground
--button-primary-background
--button-primary-foreground
--button-secondary-background
--button-secondary-foreground
--button-destructive-background
--button-destructive-foreground
--button-outline-border
--button-outline-foreground
--button-ghost-hover-background
--button-link-foreground
--button-disabled-opacity
--button-focus-ring
```

---

## Input

텍스트 입력 컴포넌트로 오류 상태 및 다양한 타입을 지원합니다.

### Props

| Prop           | Type                                                                        | Default  | Description               |
| -------------- | --------------------------------------------------------------------------- | -------- | ------------------------- |
| `type`         | `"text" \| "email" \| "password" \| "number" \| "search" \| "tel" \| "url"` | `"text"` | Input 타입                |
| `aria-invalid` | `boolean`                                                                   | `false`  | 오류 상태 표시            |
| `disabled`     | `boolean`                                                                   | `false`  | 비활성화 상태             |
| ...rest        | `InputHTMLAttributes<HTMLInputElement>`                                     | -        | 모든 네이티브 input props |

### 사용 예시

```tsx
import { Input } from '@tekton/ui';

// Basic usage
<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" min={0} max={100} />

// With error state
<Input type="text" aria-invalid="true" />

// Disabled
<Input disabled placeholder="Disabled input" />

// Controlled input
const [value, setValue] = useState('');
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

### 접근성 기능

- ✅ `aria-invalid` 상태 지원
- ✅ `aria-describedby`로 오류 메시지 연결
- ✅ `placeholder` 텍스트 지원
- ✅ Focus 표시 (--input-focus-ring)

### CSS Variables

```css
--input-background
--input-foreground
--input-border
--input-placeholder
--input-focus-ring
--input-disabled-background
--input-disabled-foreground
```

---

## Checkbox

체크박스 컴포넌트로 indeterminate 상태 및 폼 통합을 지원합니다.

### Props

| Prop              | Type                                            | Default | Description                  |
| ----------------- | ----------------------------------------------- | ------- | ---------------------------- |
| `checked`         | `boolean \| "indeterminate"`                    | `false` | 체크 상태                    |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | -       | 상태 변경 핸들러             |
| `disabled`        | `boolean`                                       | `false` | 비활성화 상태                |
| ...rest           | `RadixCheckboxProps`                            | -       | 모든 Radix UI Checkbox props |

### 사용 예시

```tsx
import { Checkbox } from '@tekton/ui';

// Basic checkbox
<label>
  <Checkbox id="terms" />
  Accept terms and conditions
</label>

// Controlled checkbox
const [checked, setChecked] = useState(false);
<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
/>

// Indeterminate state
<Checkbox checked="indeterminate" />

// Disabled
<Checkbox disabled />
<Checkbox checked disabled />
```

### 접근성 기능

- ✅ `aria-checked` 상태 자동 관리
- ✅ 키보드 네비게이션 (Space)
- ✅ Focus 표시
- ✅ Label 연결 (id/htmlFor)

### CSS Variables

```css
--checkbox-background
--checkbox-border
--checkbox-indicator-foreground
--checkbox-focus-ring
--checkbox-disabled-opacity
```

---

## RadioGroup

라디오 버튼 그룹 컴포넌트로 키보드 네비게이션을 지원합니다.

### Props

#### RadioGroup Props

| Prop            | Type                      | Default | Description                    |
| --------------- | ------------------------- | ------- | ------------------------------ |
| `value`         | `string`                  | -       | 선택된 값                      |
| `defaultValue`  | `string`                  | -       | 기본 선택 값                   |
| `onValueChange` | `(value: string) => void` | -       | 값 변경 핸들러                 |
| `disabled`      | `boolean`                 | `false` | 비활성화 상태                  |
| ...rest         | `RadixRadioGroupProps`    | -       | 모든 Radix UI RadioGroup props |

#### RadioGroupItem Props

| Prop       | Type      | Default      | Description            |
| ---------- | --------- | ------------ | ---------------------- |
| `value`    | `string`  | **required** | 라디오 버튼 값         |
| `id`       | `string`  | -            | HTML ID (label 연결용) |
| `disabled` | `boolean` | `false`      | 비활성화 상태          |

### 사용 예시

```tsx
import { RadioGroup, RadioGroupItem } from '@tekton/ui';

// Basic usage
<RadioGroup defaultValue="option1">
  <div>
    <RadioGroupItem value="option1" id="opt1" />
    <label htmlFor="opt1">Option 1</label>
  </div>
  <div>
    <RadioGroupItem value="option2" id="opt2" />
    <label htmlFor="opt2">Option 2</label>
  </div>
  <div>
    <RadioGroupItem value="option3" id="opt3" />
    <label htmlFor="opt3">Option 3</label>
  </div>
</RadioGroup>

// Controlled radio group
const [value, setValue] = useState('option1');
<RadioGroup value={value} onValueChange={setValue}>
  {/* ... */}
</RadioGroup>

// Disabled group
<RadioGroup defaultValue="option1" disabled>
  {/* ... */}
</RadioGroup>
```

### 접근성 기능

- ✅ `role="radiogroup"` 자동 적용
- ✅ 키보드 네비게이션 (Arrow keys)
- ✅ `aria-checked` 상태 관리
- ✅ Focus 관리 및 표시

### CSS Variables

```css
--radio-background
--radio-border
--radio-indicator-foreground
--radio-focus-ring
--radio-disabled-opacity
```

---

## Switch

토글 스위치 컴포넌트로 checked/unchecked 상태를 지원합니다.

### Props

| Prop              | Type                         | Default | Description                |
| ----------------- | ---------------------------- | ------- | -------------------------- |
| `checked`         | `boolean`                    | `false` | 체크 상태                  |
| `onCheckedChange` | `(checked: boolean) => void` | -       | 상태 변경 핸들러           |
| `disabled`        | `boolean`                    | `false` | 비활성화 상태              |
| ...rest           | `RadixSwitchProps`           | -       | 모든 Radix UI Switch props |

### 사용 예시

```tsx
import { Switch } from '@tekton/ui';

// Basic switch
<label>
  <Switch id="notifications" />
  Enable notifications
</label>

// Controlled switch
const [enabled, setEnabled] = useState(false);
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
/>

// Disabled
<Switch disabled />
<Switch checked disabled />

// With onChange handler
<Switch onCheckedChange={(checked) => {
  console.log('Switch is now:', checked);
}} />
```

### 접근성 기능

- ✅ `role="switch"` 자동 적용
- ✅ `aria-checked` 상태 관리
- ✅ 키보드 네비게이션 (Space)
- ✅ Focus 표시

### CSS Variables

```css
--switch-background
--switch-checked-background
--switch-thumb-background
--switch-focus-ring
--switch-disabled-opacity
```

---

## Slider

범위 슬라이더 컴포넌트로 min/max/step 설정을 지원합니다.

### Props

| Prop            | Type                        | Default | Description                |
| --------------- | --------------------------- | ------- | -------------------------- |
| `defaultValue`  | `number[]`                  | -       | 기본 값 배열               |
| `value`         | `number[]`                  | -       | 제어된 값 배열             |
| `onValueChange` | `(value: number[]) => void` | -       | 값 변경 핸들러             |
| `min`           | `number`                    | `0`     | 최소값                     |
| `max`           | `number`                    | `100`   | 최대값                     |
| `step`          | `number`                    | `1`     | 증감 단위                  |
| `disabled`      | `boolean`                   | `false` | 비활성화 상태              |
| ...rest         | `RadixSliderProps`          | -       | 모든 Radix UI Slider props |

### 사용 예시

```tsx
import { Slider } from '@tekton/ui';

// Basic slider
<label htmlFor="volume" id="volume-label">Volume</label>
<Slider
  id="volume"
  defaultValue={[50]}
  min={0}
  max={100}
  step={1}
  aria-labelledby="volume-label"
/>

// Range slider (두 개의 thumb)
<Slider defaultValue={[25, 75]} min={0} max={100} />

// Controlled slider
const [value, setValue] = useState([50]);
<Slider
  value={value}
  onValueChange={setValue}
  min={0}
  max={100}
/>

// Custom step
<Slider defaultValue={[0]} min={0} max={1} step={0.1} />

// Disabled
<Slider defaultValue={[50]} disabled />
```

### 접근성 기능

- ✅ `role="slider"` 자동 적용
- ✅ 키보드 네비게이션 (Arrow keys)
- ✅ `aria-valuenow`, `aria-valuemin`, `aria-valuemax` 관리
- ✅ Focus 표시

### CSS Variables

```css
--slider-track-background
--slider-range-background
--slider-thumb-background
--slider-thumb-border
--slider-focus-ring
--slider-disabled-opacity
```

---

## Text

다형성 텍스트 컴포넌트로 size variant를 지원합니다.

### Props

| Prop       | Type                                | Default     | Description          |
| ---------- | ----------------------------------- | ----------- | -------------------- |
| `as`       | `"p" \| "span" \| "div" \| "label"` | `"p"`       | 렌더링할 HTML 요소   |
| `size`     | `"xs" \| "sm" \| "md" \| "lg"`      | `"md"`      | 텍스트 크기          |
| `variant`  | `"default" \| "muted"`              | `"default"` | 텍스트 스타일        |
| `children` | `ReactNode`                         | -           | 텍스트 내용          |
| ...rest    | `HTMLAttributes<HTMLElement>`       | -           | 모든 HTML 요소 props |

### 사용 예시

```tsx
import { Text } from '@tekton/ui';

// Sizes
<Text size="xs">Extra small text</Text>
<Text size="sm">Small text</Text>
<Text size="md">Medium text</Text>
<Text size="lg">Large text</Text>

// Variants
<Text variant="default">Default text</Text>
<Text variant="muted">Muted text</Text>

// Polymorphic rendering
<Text as="p">Paragraph</Text>
<Text as="span">Inline text</Text>
<Text as="div">Block text</Text>
<Text as="label" htmlFor="input-id">Label text</Text>

// Combination
<Text as="span" size="lg" variant="muted">
  Large muted text
</Text>
```

### 접근성 기능

- ✅ 의미론적 HTML 요소 선택 가능
- ✅ `aria-label` 지원
- ✅ 충분한 색상 대비 (WCAG 2.1 AA)

### CSS Variables

```css
--text-default-foreground
--text-muted-foreground
--text-size-xs
--text-size-sm
--text-size-md
--text-size-lg
```

---

## Heading

계층적 제목 컴포넌트로 level prop을 지원합니다 (h1-h6).

### Props

| Prop       | Type                                 | Default           | Description             |
| ---------- | ------------------------------------ | ----------------- | ----------------------- |
| `level`    | `1 \| 2 \| 3 \| 4 \| 5 \| 6`         | **required**      | 제목 레벨 (h1~h6)       |
| `size`     | `"sm" \| "md" \| "lg"`               | level에 따라 자동 | 제목 크기               |
| `children` | `ReactNode`                          | -                 | 제목 내용               |
| ...rest    | `HTMLAttributes<HTMLHeadingElement>` | -                 | 모든 heading 요소 props |

### 사용 예시

```tsx
import { Heading } from '@tekton/ui';

// Hierarchical headings
<Heading level={1}>Heading 1</Heading>
<Heading level={2}>Heading 2</Heading>
<Heading level={3}>Heading 3</Heading>
<Heading level={4}>Heading 4</Heading>
<Heading level={5}>Heading 5</Heading>
<Heading level={6}>Heading 6</Heading>

// Custom sizes (시각적 크기와 의미론적 레벨 분리)
<Heading level={1} size="sm">Small H1</Heading>
<Heading level={2} size="lg">Large H2</Heading>
<Heading level={3} size="md">Medium H3</Heading>

// With styling
<Heading level={1} className="text-center">
  Centered Title
</Heading>
```

### 접근성 기능

- ✅ 의미론적 제목 계층 구조 (h1~h6)
- ✅ 스크린 리더 네비게이션 지원
- ✅ ARIA 레이블 지원

### CSS Variables

```css
--heading-foreground
--heading-size-sm
--heading-size-md
--heading-size-lg
--heading-weight
```

---

## Badge

상태 배지 컴포넌트로 다양한 variant를 지원합니다.

### Props

| Prop       | Type                                                                  | Default     | Description          |
| ---------- | --------------------------------------------------------------------- | ----------- | -------------------- |
| `variant`  | `"default" \| "primary" \| "secondary" \| "destructive" \| "outline"` | `"default"` | 배지 스타일 variant  |
| `children` | `ReactNode`                                                           | -           | 배지 내용            |
| ...rest    | `HTMLAttributes<HTMLSpanElement>`                                     | -           | 모든 span 요소 props |

### 사용 예시

```tsx
import { Badge } from '@tekton/ui';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Status indicators
<Badge variant="primary">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>

// With icons
<Badge>
  <Icon /> New
</Badge>

// Counts
<Badge variant="primary">5</Badge>
<Badge variant="destructive">99+</Badge>
```

### 접근성 기능

- ✅ `aria-label`로 배지 의미 설명 가능
- ✅ 충분한 색상 대비 (WCAG 2.1 AA)
- ✅ `role="status"` 추가 가능

### CSS Variables

```css
--badge-default-background
--badge-default-foreground
--badge-default-border
--badge-primary-background
--badge-primary-foreground
--badge-secondary-background
--badge-secondary-foreground
--badge-destructive-background
--badge-destructive-foreground
--badge-outline-border
--badge-outline-foreground
```

---

## Avatar

사용자 아바타 컴포넌트로 이미지/fallback 지원을 제공합니다.

### Props

#### Avatar Props

| Prop       | Type               | Default | Description                   |
| ---------- | ------------------ | ------- | ----------------------------- |
| `children` | `ReactNode`        | -       | AvatarImage 및 AvatarFallback |
| ...rest    | `RadixAvatarProps` | -       | 모든 Radix UI Avatar props    |

#### AvatarImage Props

| Prop    | Type                    | Default      | Description                     |
| ------- | ----------------------- | ------------ | ------------------------------- |
| `src`   | `string`                | **required** | 이미지 URL                      |
| `alt`   | `string`                | **required** | 대체 텍스트                     |
| ...rest | `RadixAvatarImageProps` | -            | 모든 Radix UI AvatarImage props |

#### AvatarFallback Props

| Prop       | Type                       | Default | Description                        |
| ---------- | -------------------------- | ------- | ---------------------------------- |
| `children` | `ReactNode`                | -       | Fallback 내용 (보통 이니셜)        |
| ...rest    | `RadixAvatarFallbackProps` | -       | 모든 Radix UI AvatarFallback props |

### 사용 예시

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@tekton/ui';

// Basic avatar with image and fallback
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Fallback only (이미지 로드 실패 시)
<Avatar>
  <AvatarImage src="invalid-url" alt="Jane Smith" />
  <AvatarFallback>JS</AvatarFallback>
</Avatar>

// With delayMs (fallback 표시 지연)
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback delayMs={600}>U</AvatarFallback>
</Avatar>

// Custom styling
<Avatar className="w-16 h-16">
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>
```

### 접근성 기능

- ✅ 이미지에 필수 `alt` 속성
- ✅ 이미지 로드 실패 시 자동 fallback
- ✅ `aria-label` 추가 가능

### CSS Variables

```css
--avatar-background
--avatar-foreground
--avatar-border
--avatar-size
```

---

## Progress

진행률 표시 컴포넌트로 0-100 값을 지원합니다.

### Props

| Prop         | Type                 | Default | Description                  |
| ------------ | -------------------- | ------- | ---------------------------- |
| `value`      | `number`             | -       | 진행률 (0-100)               |
| `max`        | `number`             | `100`   | 최대값                       |
| `aria-label` | `string`             | -       | 접근성 레이블                |
| ...rest      | `RadixProgressProps` | -       | 모든 Radix UI Progress props |

### 사용 예시

```tsx
import { Progress } from '@tekton/ui';

// Basic progress
<Progress value={50} aria-label="Upload progress" />
<Progress value={75} aria-label="Loading" />
<Progress value={100} aria-label="Complete" />

// With label
<div>
  <label id="progress-label">File upload: 50%</label>
  <Progress value={50} aria-labelledby="progress-label" />
</div>

// Dynamic progress
const [progress, setProgress] = useState(0);
useEffect(() => {
  const timer = setInterval(() => {
    setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
  }, 500);
  return () => clearInterval(timer);
}, []);

<Progress value={progress} aria-label="Progress" />
```

### 접근성 기능

- ✅ `role="progressbar"` 자동 적용
- ✅ `aria-valuenow`, `aria-valuemax` 관리
- ✅ `aria-label` 또는 `aria-labelledby` 필수

### CSS Variables

```css
--progress-background
--progress-indicator-background
--progress-height
```

---

## Link

네비게이션 링크 컴포넌트로 다양한 variant를 지원합니다.

### Props

| Prop       | Type                                      | Default      | Description                |
| ---------- | ----------------------------------------- | ------------ | -------------------------- |
| `href`     | `string`                                  | **required** | 링크 URL                   |
| `variant`  | `"default" \| "muted" \| "underline"`     | `"default"`  | 링크 스타일 variant        |
| `children` | `ReactNode`                               | -            | 링크 텍스트                |
| ...rest    | `AnchorHTMLAttributes<HTMLAnchorElement>` | -            | 모든 네이티브 a 태그 props |

### 사용 예시

```tsx
import { Link } from '@tekton/ui';

// Variants
<Link href="/home" variant="default">Default Link</Link>
<Link href="/about" variant="muted">Muted Link</Link>
<Link href="/contact" variant="underline">Underlined Link</Link>

// External link
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</Link>

// With routing library (예: React Router)
<Link as={RouterLink} to="/dashboard">
  Dashboard
</Link>

// Disabled appearance (CSS로 처리)
<Link href="/disabled" className="pointer-events-none opacity-50">
  Disabled Link
</Link>
```

### 접근성 기능

- ✅ 의미론적 `<a>` 요소
- ✅ `target="_blank"` 시 보안 rel 속성 권장
- ✅ Focus 표시 (--link-focus-ring)
- ✅ `aria-label`로 링크 목적 설명 가능

### CSS Variables

```css
--link-default-foreground
--link-default-hover-foreground
--link-muted-foreground
--link-underline-color
--link-focus-ring
```

---

## Image

이미지 컴포넌트로 alt 텍스트 및 object-fit 지원을 제공합니다.

### Props

| Prop      | Type                                  | Default      | Description                  |
| --------- | ------------------------------------- | ------------ | ---------------------------- |
| `src`     | `string`                              | **required** | 이미지 URL                   |
| `alt`     | `string`                              | **required** | 대체 텍스트 (접근성 필수)    |
| `loading` | `"lazy" \| "eager"`                   | `"lazy"`     | 이미지 로딩 전략             |
| ...rest   | `ImgHTMLAttributes<HTMLImageElement>` | -            | 모든 네이티브 img 태그 props |

### 사용 예시

```tsx
import { Image } from '@tekton/ui';

// Basic image
<Image
  src="https://example.com/image.jpg"
  alt="Description of image"
/>

// With explicit dimensions
<Image
  src="https://example.com/image.jpg"
  alt="Product photo"
  width={400}
  height={300}
/>

// Cover mode (Tailwind CSS 사용 시)
<Image
  src="https://example.com/image.jpg"
  alt="Cover image"
  className="object-cover w-full h-64"
/>

// Eager loading (above the fold)
<Image
  src="https://example.com/hero.jpg"
  alt="Hero image"
  loading="eager"
/>

// Lazy loading (default, below the fold)
<Image
  src="https://example.com/gallery.jpg"
  alt="Gallery image"
  loading="lazy"
/>
```

### 접근성 기능

- ✅ 필수 `alt` 속성 (접근성 준수)
- ✅ 장식용 이미지는 `alt=""` 사용
- ✅ `loading="lazy"` 기본값으로 성능 최적화

### CSS Variables

```css
--image-border
--image-radius
```

---

## List

다형성 리스트 컴포넌트로 ul/ol 지원을 제공합니다.

### Props

#### List Props

| Prop       | Type                                                   | Default | Description            |
| ---------- | ------------------------------------------------------ | ------- | ---------------------- |
| `as`       | `"ul" \| "ol"`                                         | `"ul"`  | 렌더링할 리스트 타입   |
| `children` | `ReactNode`                                            | -       | ListItem 컴포넌트들    |
| ...rest    | `HTMLAttributes<HTMLUListElement \| HTMLOListElement>` | -       | 모든 리스트 요소 props |

#### ListItem Props

| Prop       | Type                              | Default | Description        |
| ---------- | --------------------------------- | ------- | ------------------ |
| `children` | `ReactNode`                       | -       | 리스트 아이템 내용 |
| ...rest    | `LiHTMLAttributes<HTMLLIElement>` | -       | 모든 li 요소 props |

### 사용 예시

```tsx
import { List, ListItem } from '@tekton/ui';

// Unordered list (default)
<List as="ul">
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</List>

// Ordered list
<List as="ol">
  <ListItem>First item</ListItem>
  <ListItem>Second item</ListItem>
  <ListItem>Third item</ListItem>
</List>

// Nested list
<List as="ul">
  <ListItem>
    Parent item 1
    <List as="ul">
      <ListItem>Child item 1.1</ListItem>
      <ListItem>Child item 1.2</ListItem>
    </List>
  </ListItem>
  <ListItem>Parent item 2</ListItem>
</List>

// Custom styling
<List as="ul" className="space-y-2">
  <ListItem className="text-muted">Item 1</ListItem>
  <ListItem className="text-muted">Item 2</ListItem>
</List>
```

### 접근성 기능

- ✅ 의미론적 리스트 요소 (ul, ol, li)
- ✅ 스크린 리더 네비게이션 지원
- ✅ 리스트 구조 자동 인식

### CSS Variables

```css
--list-marker-color
--list-item-spacing
```

---

## 공통 테마 커스터마이징

모든 primitive 컴포넌트는 CSS Variables를 통해 테마를 커스터마이징할 수 있습니다.

### 기본 사용법

```css
/* styles/theme.css */
@import '@tekton/ui/styles';

:root {
  /* Atomic Layer - 기본 색상 및 값 */
  --color-primary: #3b82f6;
  --color-destructive: #ef4444;
  --spacing-sm: 0.5rem;
  --radius-md: 0.375rem;

  /* Component Layer - 각 컴포넌트 토큰 */
  --button-primary-background: var(--color-primary);
  --input-border: #d1d5db;
  --badge-primary-background: var(--color-primary);
  /* ... 기타 컴포넌트 토큰 */
}
```

### 다크 모드 예시

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1f2937;
    --color-foreground: #f9fafb;
    --button-default-background: #374151;
    --input-background: #374151;
    --card-background: #374151;
  }
}
```

---

**버전**: 1.0.0
**최종 업데이트**: 2026-01-26
**문서 관리**: Tekton Team
