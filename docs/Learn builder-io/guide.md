# Complete Guide: Creating Components for Builder.io

This guide provides comprehensive, step-by-step instructions for creating Builder.io components in the lead-gen-site application. It covers all possible scenarios from simple components to complex nested containers.

## Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Component Architecture Overview](#component-architecture-overview)
3. [Step-by-Step: Simple Component](#step-by-step-simple-component)
4. [Step-by-Step: Component with Images](#step-by-step-component-with-images)
5. [Step-by-Step: Component with Buttons/Links](#step-by-step-component-with-buttonslinks)
6. [Step-by-Step: Component with Array/List Inputs](#step-by-step-component-with-arraylist-inputs)
7. [Step-by-Step: Container with Nested Children](#step-by-step-container-with-nested-children)
8. [Step-by-Step: Component with Default Children](#step-by-step-component-with-default-children)
9. [Step-by-Step: Component with Conditional Inputs](#step-by-step-component-with-conditional-inputs)
10. [Step-by-Step: Component with SVG Icons](#step-by-step-component-with-svg-icons)
11. [Step-by-Step: Multiple Variants from Same Component](#step-by-step-multiple-variants-from-same-component)
12. [Input Field Types Reference](#input-field-types-reference)
13. [Utilities & Constants Reference](#utilities--constants-reference)
14. [Best Practices & Common Patterns](#best-practices--common-patterns)

---

## Prerequisites & Setup

### Required Files & Folders

All Builder.io components are located in:
```
apps/lead-gen-site/src/components/
```

### Key Supporting Files

1. **`src/components/builder-registry.ts`** - Central registry for all components
2. **`src/types/builder.ts`** - BuilderBlockNames enum
3. **`src/constants/site.ts`** - SITE_PAGE_MODEL_ID constant
4. **`src/utils/builder-props.ts`** - Utility functions
5. **`packages/builder-components/constants/index.ts`** - Reusable field configurations
6. **`packages/builder-components/utils/index.ts`** - Shared utilities

### Required Imports

Common imports used across components:
```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
import { BuilderBlocks, type BuilderElement } from '@builder.io/react';
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
import { BuilderBlockNames } from '@/types/builder';
```

---

## Component Architecture Overview

### Standard Folder Structure

**Simple Component:**
```
component-name/
├── content-model.ts    # Builder.io registration
└── index.tsx           # React component
```

**Complex Component with Variants:**
```
component-name/
├── content-model.ts           # Main registration
├── index.tsx                  # Main component
├── variant-a/
│   └── index.tsx
└── nested-child/
    ├── content-model.ts       # Child registration
    └── index.tsx
```

### File Responsibilities

- **`content-model.ts`**: Defines Builder.io configuration, inputs, and registration
- **`index.tsx`**: React component implementation with props and rendering logic

---

## Step-by-Step: Simple Component

### Example: Text Banner Component

This example creates a basic component with text inputs and styling options.

### Step 1: Add Component Name to Enum

**File:** `apps/lead-gen-site/src/types/builder.ts`

```typescript
export enum BuilderBlockNames {
  // ... existing names
  TEXT_BANNER = 'Text Banner',
  // Add your new component name here
}
```

### Step 2: Create Component Folder & Files

```bash
apps/lead-gen-site/src/components/
└── text-banner/
    ├── content-model.ts
    └── index.tsx
```

### Step 3: Create Content Model

**File:** `apps/lead-gen-site/src/components/text-banner/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const TextBanner = dynamic(() => import('./index'));

export const registerTextBanner = () =>
  Builder.registerComponent(TextBanner, {
    name: BuilderBlockNames.TEXT_BANNER,
    models: [SITE_PAGE_MODEL_ID],
    image: 'https://cdn.builder.io/api/v1/image/assets%2F...', // Optional thumbnail
    inputs: [
      {
        name: 'heading',
        type: 'richText',
        defaultValue: '<h2>Enter heading text here. Remove if not needed.</h2>',
        helperText: 'An <h2> styling will be strictly applied to this text',
      },
      {
        name: 'subheading',
        type: 'richText',
        defaultValue: '<p>Enter subheading text here. Remove if not needed.</p>',
        helperText: 'A <p> styling will be strictly applied to this text',
      },
      {
        name: 'gap',
        type: 'number',
        defaultValue: 4,
        helperText: 'Column gap must match Tailwind spacing scale values',
      },
      {
        name: 'textAlign',
        type: 'string',
        defaultValue: 'start',
        enum: ['start', 'center', 'end'],
      },
    ],
  });
```

### Step 4: Create React Component

**File:** `apps/lead-gen-site/src/components/text-banner/index.tsx`

```typescript
// @ag-packages
import { cn } from '@ag-packages/utils/cn';
// utils
import { hasValidRichTextContent } from '@/utils/builder-props';
// components
import RichTextRender from '@/components/rich-text-render';

// ----------------------------------------------------------------------

type Props = {
  heading?: string;
  subheading?: string;
  gap?: number;
  textAlign?: 'start' | 'center' | 'end';
};

const TextBanner: React.FC<Props> = ({
  heading,
  subheading,
  gap = 4,
  textAlign = 'start',
}) => {
  return (
    <div
      style={
        {
          '--col-gap': `calc(var(--spacing) * ${gap ?? 0})`,
        } as React.CSSProperties
      }
      className={cn(
        'flex h-full w-full flex-col justify-center gap-[var(--col-gap)]',
        {
          'items-start': textAlign === 'start',
          'items-center': textAlign === 'center',
          'items-end': textAlign === 'end',
        },
      )}
    >
      {heading && hasValidRichTextContent(heading) && (
        <RichTextRender
          typography="h2"
          className={cn({
            'text-start': textAlign === 'start',
            'text-center': textAlign === 'center',
            'text-end': textAlign === 'end',
          })}
          htmlString={heading}
        />
      )}

      {subheading && hasValidRichTextContent(subheading) && (
        <RichTextRender
          typography="p"
          className={cn('!text-muted-foreground', {
            'text-start': textAlign === 'start',
            'text-center': textAlign === 'center',
            'text-end': textAlign === 'end',
          })}
          htmlString={subheading}
        />
      )}
    </div>
  );
};

export default TextBanner;
```

### Step 5: Register in Builder Registry

**File:** `apps/lead-gen-site/src/components/builder-registry.ts`

```typescript
// Import the registration function
import { registerTextBanner } from './text-banner/content-model';

const builderRegistry = () => {
  // ... existing code

  // Add to appropriate category
  const buildingBlockItems: { name: BuilderBlockNames }[] = [
    { name: BuilderBlockNames.TEXT_BANNER },
    // ... other items
  ];

  // Register custom insert menu
  Builder.register('insertMenu', {
    name: 'Building Blocks',
    items: buildingBlockItems,
  });

  // Call registration function
  registerTextBanner();
  // ... other registrations
};

export default builderRegistry;
```

### Step 6: Test in Builder.io

1. Restart your development server
2. Open Builder.io editor
3. Look for "Text Banner" in the "Building Blocks" insert menu
4. Drag and drop to test

---

## Step-by-Step: Component with Images

### Example: Image Box Component

This example shows how to handle image uploads with fit and position options.

### Step 1-2: Setup (Same as Simple Component)

Add `IMAGE_BOX = 'Image Box'` to `BuilderBlockNames` enum and create folder structure.

### Step 3: Create Content Model with Image Fields

**File:** `apps/lead-gen-site/src/components/image-box/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// @ag-packages
import { createBuilderImageSubFields } from '@ag-packages/builder-components/utils';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const ImageBox = dynamic(() => import('./index'));

export const registerImageBox = () =>
  Builder.registerComponent(ImageBox, {
    name: BuilderBlockNames.IMAGE_BOX,
    models: [SITE_PAGE_MODEL_ID],
    image: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    inputs: [
      {
        name: 'displayAsHexagon',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Display the image in a hexagon shape',
      },
      // Spreads: media, imageFit, imagePosition, altText
      ...createBuilderImageSubFields({}),
    ],
  });
```

**Alternative: Manual Image Fields**

If you need custom field names:

```typescript
inputs: [
  {
    name: 'customImageName',
    type: 'file',
    allowedFileTypes: ['jpeg', 'jpg', 'png', 'gif'],
    helperText: 'Upload a media file (jpeg, jpg, png, gif)',
    required: true,
  },
  {
    name: 'imageFit',
    type: 'enum',
    enum: ['contain', 'cover'],
    defaultValue: 'contain',
  },
  {
    name: 'imagePosition',
    type: 'enum',
    enum: ['center', 'top', 'left', 'right', 'bottom',
           'top left', 'top right', 'bottom left', 'bottom right'],
    defaultValue: 'center',
  },
  {
    name: 'altText',
    type: 'text',
    helperText: 'Text to display when the user has images off',
    required: true,
  },
],
```

### Step 4: Create React Component with Image

**File:** `apps/lead-gen-site/src/components/image-box/index.tsx`

```typescript
import Image from 'next/image';
// @ag-packages
import { cn } from '@ag-packages/utils/cn';
import { FALLBACK_WHITELABEL_IMAGE_URL } from '@ag-packages/builder-components/constants';

// ----------------------------------------------------------------------

interface Props {
  media: string;
  altText?: string;
  imageFit?: string;
  imagePosition?: string;
  displayAsHexagon?: boolean;
}

const ImageBox: React.FC<Props> = ({
  media = FALLBACK_WHITELABEL_IMAGE_URL,
  altText = 'placeholder',
  imageFit = 'contain',
  imagePosition = 'top',
  displayAsHexagon = false,
}) => {
  return (
    <div
      className={cn('relative w-full overflow-hidden', {
        'h-full': !displayAsHexagon,
        'aspect-9/8 h-fit': displayAsHexagon,
      })}
    >
      <Image
        src={media}
        alt={altText}
        fill
        className={cn({
          'object-cover': imageFit === 'cover',
          'object-contain': imageFit === 'contain',
          'object-top': imagePosition === 'top',
          'object-center': imagePosition === 'center',
          'object-bottom': imagePosition === 'bottom',
          'object-left': imagePosition === 'left',
          'object-right': imagePosition === 'right',
          'object-left-top': imagePosition === 'top left',
          'object-right-top': imagePosition === 'top right',
          'object-left-bottom': imagePosition === 'bottom left',
          'object-right-bottom': imagePosition === 'bottom right',
        })}
      />
    </div>
  );
};

export default ImageBox;
```

### Step 5-6: Register and Test (Same as Simple Component)

---

## Step-by-Step: Component with Buttons/Links

### Example: Callout Card Component

This example demonstrates adding button/link functionality.

### Step 3: Content Model with Button Object

**File:** `apps/lead-gen-site/src/components/callout-card/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// @ag-packages
import { BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL } from '@ag-packages/builder-components/constants';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const CalloutCard = dynamic(() => import('./index'));

export const registerCalloutCard = () =>
  Builder.registerComponent(CalloutCard, {
    name: BuilderBlockNames.CALLOUT_CARD,
    models: [SITE_PAGE_MODEL_ID],
    inputs: [
      {
        name: 'title',
        type: 'text',
        required: true,
        defaultValue: 'Enter title here',
      },
      {
        name: 'description',
        type: 'longText',
        required: true,
        defaultValue: 'Enter description text here.',
      },
      {
        name: 'buttonLink',
        type: 'object',
        defaultValue: {
          label: 'Click here',
        },
        subFields: BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL,
      },
      {
        name: 'variant',
        type: 'string',
        defaultValue: 'outlined',
        enum: ['outlined', 'shaded'],
      },
    ],
  });
```

**What `BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL` provides:**
```typescript
[
  {
    name: 'label',
    type: 'text',
    helperText: 'Adding a button label will require you to also add a button link.',
    required: true,
  },
  {
    name: 'link',
    type: 'url',
    helperText: 'For internal links, supply only the path, i.e. "/about-us"',
    required: true,
  },
]
```

### Step 4: Component with Link Handling

**File:** `apps/lead-gen-site/src/components/callout-card/index.tsx`

```typescript
import Link from 'next/link';
// @ag-packages
import { cn } from '@ag-packages/utils/cn';
import { isExternalUrl } from '@ag-packages/utils/url';
import { Button } from '@ag-packages/ui/button';
import { Card } from '@ag-packages/ui/card';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description: string;
  buttonLink: {
    label: string;
    link: string;
  };
  variant?: 'outlined' | 'shaded';
};

const CalloutCard: React.FC<Props> = ({
  title,
  description,
  buttonLink,
  variant = 'outlined',
}) => {
  return (
    <Card
      className={cn('p-6', {
        'border-2': variant === 'outlined',
        'bg-muted': variant === 'shaded',
      })}
    >
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>

      {buttonLink.label && buttonLink.link && (
        <Button asChild>
          <Link
            href={buttonLink.link || ''}
            rel={isExternalUrl(buttonLink.link) ? 'noopener noreferrer' : undefined}
            target={isExternalUrl(buttonLink.link) ? '_blank' : '_self'}
          >
            {buttonLink.label}
          </Link>
        </Button>
      )}
    </Card>
  );
};

export default CalloutCard;
```

---

## Step-by-Step: Component with Array/List Inputs

### Example: Accordion Block Component

This example shows how to handle arrays of items with subfields.

### Step 3: Content Model with List Type

**File:** `apps/lead-gen-site/src/components/accordion-block/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const AccordionBlock = dynamic(() => import('./index'));

export const registerAccordionBlock = () =>
  Builder.registerComponent(AccordionBlock, {
    name: BuilderBlockNames.ACCORDION_BLOCK,
    models: [SITE_PAGE_MODEL_ID],
    inputs: [
      {
        name: 'heading',
        type: 'text',
        defaultValue: 'Frequently Asked Questions',
        required: true,
      },
      {
        name: 'accordionItems',
        type: 'list',  // Array of items
        required: true,
        defaultValue: [
          // Provide default items
          {
            title: 'First Question?',
            content: '<p>Answer to the first question goes here.</p>',
          },
          {
            title: 'Second Question?',
            content: '<p>Answer to the second question goes here.</p>',
          },
          {
            title: 'Third Question?',
            content: '<p>Answer to the third question goes here.</p>',
          },
        ],
        subFields: [  // Define structure of each item
          {
            name: 'title',
            type: 'text',
            required: true,
          },
          {
            name: 'content',
            type: 'richText',
            required: true,
          },
        ],
      },
      {
        name: 'image',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png'],
        helperText: 'Optional image to display alongside the accordion',
      },
    ],
  });
```

### Step 4: Component Rendering Array Items

**File:** `apps/lead-gen-site/src/components/accordion-block/index.tsx`

```typescript
import Image from 'next/image';
// @ag-packages
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ag-packages/ui/accordion';
// components
import RichTextRender from '@/components/rich-text-render';

// ----------------------------------------------------------------------

interface AccordionItemType {
  title: string;
  content: string;
}

type Props = {
  heading: string;
  accordionItems: AccordionItemType[];
  image?: string;
};

const AccordionBlock: React.FC<Props> = ({ heading, accordionItems, image }) => {
  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="mb-8 text-3xl font-bold">{heading}</h2>

      <div className="grid gap-8 md:grid-cols-2">
        <Accordion type="single" collapsible className="w-full">
          {accordionItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <RichTextRender typography="p" htmlString={item.content} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {image && (
          <div className="relative h-[400px] w-full">
            <Image src={image} alt="Accordion illustration" fill className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
};

export default AccordionBlock;
```

---

## Step-by-Step: Container with Nested Children

### Example: Grid Column Container

This is a container component that allows users to add Builder.io blocks inside columns.

### Step 3: Content Model with uiBlocks

**File:** `apps/lead-gen-site/src/components/grid-column-container/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const GridColumnContainer = dynamic(() => import('./index'));

export const registerGridColumnContainer = () =>
  Builder.registerComponent(GridColumnContainer, {
    name: BuilderBlockNames.GRID_COLUMN_CONTAINER,
    models: [SITE_PAGE_MODEL_ID],
    inputs: [
      {
        name: 'displayInContainer',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Wraps content in a centered container with horizontal padding',
      },
      {
        name: 'columnList',
        type: 'array',
        defaultValue: [
          {
            blocks: [],  // Empty blocks array for first column
          },
        ],
        subFields: [
          {
            name: 'blocks',
            type: 'uiBlocks',  // Special type for Builder child blocks
            hideFromUI: true,  // Don't show in inputs panel
            defaultValue: [],
          },
        ],
      },
      {
        name: 'columns',
        type: 'object',
        defaultValue: {
          small: 1,
          medium: 2,
          large: 4,
        },
        subFields: [
          {
            name: 'small',
            type: 'number',
            required: true,
            helperText: 'Columns on mobile screens',
          },
          {
            name: 'medium',
            type: 'number',
            required: true,
            helperText: 'Columns on tablet screens',
          },
          {
            name: 'large',
            type: 'number',
            required: true,
            helperText: 'Columns on desktop screens',
          },
        ],
      },
      {
        name: 'gap',
        type: 'object',
        subFields: [
          {
            name: 'small',
            type: 'number',
          },
          {
            name: 'medium',
            type: 'number',
          },
          {
            name: 'large',
            type: 'number',
          },
        ],
        helperText: 'Column gap must match Tailwind spacing scale values',
      },
      {
        name: 'backgroundColor',
        type: 'text',
        enum: ['muted', 'white'],
        defaultValue: 'white',
      },
    ],
  });
```

### Step 4: Component with BuilderBlocks

**File:** `apps/lead-gen-site/src/components/grid-column-container/index.tsx`

```typescript
import { BuilderBlocks, type BuilderElement } from '@builder.io/react';
// @ag-packages
import { cn } from '@ag-packages/utils/cn';

// ----------------------------------------------------------------------

type Props = {
  displayInContainer?: boolean;
  columnList: { blocks: React.ReactNode[] }[];
  columns: {
    small: number;
    medium: number;
    large: number;
  };
  gap?: {
    small: number;
    medium: number;
    large: number;
  };
  backgroundColor?: 'muted' | 'white';
  builderBlock: BuilderElement;  // REQUIRED for BuilderBlocks
};

const GridColumnContainer: React.FC<Props> = ({
  displayInContainer = true,
  columnList,
  columns = {
    small: 1,
    medium: 2,
    large: 4,
  },
  gap,
  backgroundColor = 'white',
  builderBlock,  // REQUIRED prop
}) => {
  return (
    <div
      className={cn('w-full', {
        'bg-muted': backgroundColor === 'muted',
        'bg-background': backgroundColor === 'white',
      })}
      style={
        {
          '--col-num-xs': `repeat(${columns.small}, minmax(0, 1fr))`,
          '--col-num-sm': `repeat(${columns.medium}, minmax(0, 1fr))`,
          '--col-num-md': `repeat(${columns.large}, minmax(0, 1fr))`,
          '--col-gap-xs': `calc(var(--spacing) * ${gap?.small ?? 0})`,
          '--col-gap-sm': `calc(var(--spacing) * ${gap?.medium ?? 0})`,
          '--col-gap-md': `calc(var(--spacing) * ${gap?.large ?? 0})`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          displayInContainer &&
            'px-6 lg:container lg:mx-auto xl:px-[var(--dp-px)]',
        )}
      >
        <div
          className={cn(
            'grid grid-cols-[var(--col-num-xs)] sm:grid-cols-[var(--col-num-sm)] md:grid-cols-[var(--col-num-md)]',
            gap?.small && 'gap-[var(--col-gap-xs)]',
            gap?.medium && 'sm:gap-[var(--col-gap-sm)]',
            gap?.large && 'md:gap-[var(--col-gap-md)]',
          )}
        >
          {columnList.map((col, idx) => (
            <BuilderBlocks
              key={idx}
              parentElementId={builderBlock?.id}  // Link to parent
              dataPath={`columnList.${idx}.blocks`}  // Path to blocks data
              blocks={col.blocks}
              className="[&_.builder-block]:h-full [&_.builder-block]:w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridColumnContainer;
```

**Key Points:**
- `builderBlock: BuilderElement` prop is **required** when using `<BuilderBlocks>`
- `parentElementId={builderBlock?.id}` links the child blocks to the parent
- `dataPath` specifies the exact path in the data structure where blocks are stored
- Users can drag and drop components into each column in Builder.io editor

---

## Step-by-Step: Component with Default Children

### Example: Hero Banner with Switch-on Heading

This shows how to include a default child component that users can customize.

### Step 3: Content Model with Default Children

**File:** `apps/lead-gen-site/src/components/hero-banner/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// @ag-packages
import { BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL } from '@ag-packages/builder-components/constants';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const HeroBanner = dynamic(() => import('./index'));

export const registerHeroBanner = () =>
  Builder.registerComponent(HeroBanner, {
    name: BuilderBlockNames.HERO_BANNER,
    models: [SITE_PAGE_MODEL_ID],
    inputs: [
      {
        name: 'displayInFullHeight',
        type: 'boolean',
        defaultValue: false,
      },
      {
        name: 'description',
        type: 'longText',
        required: true,
        defaultValue: 'Enter description text to highlight this banner.',
      },
      {
        name: 'primaryButton',
        type: 'object',
        defaultValue: {
          label: 'Button Text',
        },
        subFields: BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL,
      },
      {
        name: 'secondaryButton',
        type: 'object',
        defaultValue: {
          label: 'Button Text',
        },
        subFields: BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL,
      },
      {
        name: 'badge',
        type: 'text',
        defaultValue: 'Global Reach',
      },
      {
        name: 'heroImage',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png'],
        helperText: 'Upload a image file (jpeg, jpg, png)',
      },
      {
        name: 'heroBackground',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png'],
        helperText: 'Upload a image file (jpeg, jpg, png)',
      },
      {
        name: 'children',
        type: 'uiBlocks',
        hideFromUI: true,
        defaultValue: [  // DEFAULT CHILD COMPONENT
          {
            '@type': '@builder.io/sdk:Element',
            id: 'switch-on-heading-fallback',
            component: {
              name: BuilderBlockNames.SWITCH_ON_HEADING,  // Reference another component
              options: {
                textStart: '<p>Text before the switch </p>',
                textInline: '<p> animated text.</p>',
                textEnd: '<p> Text after the switch.</p>',
                showSwitch: true,
                textColor: 'white',
              },
            },
          },
        ],
      },
    ],
  });
```

### Step 4: Component Rendering Children

**File:** `apps/lead-gen-site/src/components/hero-banner/index.tsx`

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { BuilderBlocks, type BuilderElement } from '@builder.io/react';
// @ag-packages
import { Button } from '@ag-packages/ui/button';
import { Badge } from '@ag-packages/ui/badge';
import { BuilderComponentState } from '@ag-packages/builder-components/types';
import { isExternalUrl } from '@ag-packages/utils/url';
import { cn } from '@ag-packages/utils/cn';

// ----------------------------------------------------------------------

type Props = {
  displayInFullHeight?: boolean;
  description: string;
  primaryButton: {
    label: string;
    link: string;
  };
  secondaryButton?: {
    label: string;
    link: string;
  };
  badge?: string;
  heroImage?: string;
  heroBackground?: string;
  children: React.ReactNode[];
  builderBlock: BuilderElement;  // REQUIRED
  builderState?: BuilderComponentState;  // Optional
};

const HeroBanner: React.FC<Props> = ({
  displayInFullHeight = false,
  description,
  primaryButton,
  secondaryButton,
  badge,
  heroImage,
  heroBackground,
  children,
  builderBlock,
  builderState,
}) => {
  return (
    <section
      className={cn('relative w-full', {
        'min-h-screen': displayInFullHeight,
        'py-20': !displayInFullHeight,
      })}
    >
      {/* Background Image */}
      {heroBackground && (
        <div className="absolute inset-0 z-0">
          <Image src={heroBackground} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-center">
            {badge && (
              <Badge variant="secondary" className="mb-6 w-fit">
                {badge}
              </Badge>
            )}

            {/* Render children (Switch-on Heading component) */}
            <BuilderBlocks
              parentElementId={builderBlock?.id}
              dataPath="children"
              blocks={children}
            />

            <p className="mb-8 text-lg text-white">{description}</p>

            <div className="flex gap-4">
              {primaryButton.label && primaryButton.link && (
                <Button asChild size="lg">
                  <Link
                    href={primaryButton.link}
                    rel={isExternalUrl(primaryButton.link) ? 'noopener noreferrer' : undefined}
                    target={isExternalUrl(primaryButton.link) ? '_blank' : '_self'}
                  >
                    {primaryButton.label}
                  </Link>
                </Button>
              )}

              {secondaryButton?.label && secondaryButton?.link && (
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={secondaryButton.link}
                    rel={isExternalUrl(secondaryButton.link) ? 'noopener noreferrer' : undefined}
                    target={isExternalUrl(secondaryButton.link) ? '_blank' : '_self'}
                  >
                    {secondaryButton.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {heroImage && (
            <div className="relative h-[400px] w-full">
              <Image src={heroImage} alt="Hero" fill className="object-contain" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
```

**Key Points:**
- Default children are pre-populated when component is added
- Users can still edit, remove, or replace the default child component
- The `children` prop receives the child components as React nodes

---

## Step-by-Step: Component with Conditional Inputs

### Example: Switch-on Heading

This example shows inputs that appear/disappear based on other input values.

### Step 3: Content Model with `showIf`

**File:** `apps/lead-gen-site/src/components/hero-banner/switch-on-heading/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const SwitchOnHeading = dynamic(() => import('./index'));

export const registerSwitchOnHeading = () =>
  Builder.registerComponent(SwitchOnHeading, {
    name: BuilderBlockNames.SWITCH_ON_HEADING,
    models: [SITE_PAGE_MODEL_ID],
    inputs: [
      {
        name: 'showSwitch',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Toggle to show/hide the animated switch effect',
      },
      {
        name: 'textStart',
        type: 'richText',
        defaultValue: '<p>Text before the switch </p>',
        helperText: 'Text displayed before the animated text',
      },
      {
        name: 'textInline',
        type: 'richText',
        defaultValue: '<p> animated text.</p>',
        helperText: 'This text will be animated if showSwitch is enabled',
        showIf: (options) => options.get('showSwitch') === true,  // CONDITIONAL
      },
      {
        name: 'textEnd',
        type: 'richText',
        defaultValue: '<p> Text after the switch.</p>',
        helperText: 'Text displayed after the animated text',
        showIf: (options) => options.get('showSwitch') === true,  // CONDITIONAL
      },
      {
        name: 'staticText',
        type: 'richText',
        defaultValue: '<h1>Static heading text</h1>',
        helperText: 'Displayed when showSwitch is disabled',
        showIf: (options) => options.get('showSwitch') === false,  // CONDITIONAL
      },
      {
        name: 'textColor',
        type: 'text',
        enum: ['black', 'white'],
        defaultValue: 'black',
      },
    ],
  });
```

**Key Points:**
- `showIf` takes a function that receives an options Map
- Use `options.get('fieldName')` to access other field values
- Return `true` to show the field, `false` to hide it
- Supports complex logic: `options.get('mode') === 'advanced' && options.get('enabled') === true`

### Step 4: Component with Conditional Logic

**File:** `apps/lead-gen-site/src/components/hero-banner/switch-on-heading/index.tsx`

```typescript
// @ag-packages
import { cn } from '@ag-packages/utils/cn';
// components
import RichTextRender from '@/components/rich-text-render';
import { hasValidRichTextContent } from '@/utils/builder-props';

// ----------------------------------------------------------------------

type Props = {
  showSwitch: boolean;
  textStart?: string;
  textInline?: string;
  textEnd?: string;
  staticText?: string;
  textColor?: 'black' | 'white';
};

const SwitchOnHeading: React.FC<Props> = ({
  showSwitch,
  textStart,
  textInline,
  textEnd,
  staticText,
  textColor = 'black',
}) => {
  if (!showSwitch && staticText && hasValidRichTextContent(staticText)) {
    return (
      <div className={cn({ 'text-white': textColor === 'white' })}>
        <RichTextRender typography="h1" htmlString={staticText} />
      </div>
    );
  }

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', {
        'text-white': textColor === 'white',
      })}
    >
      {textStart && hasValidRichTextContent(textStart) && (
        <RichTextRender typography="h1" htmlString={textStart} />
      )}

      {showSwitch && textInline && hasValidRichTextContent(textInline) && (
        <div className="animate-switch-text">
          <RichTextRender typography="h1" htmlString={textInline} />
        </div>
      )}

      {textEnd && hasValidRichTextContent(textEnd) && (
        <RichTextRender typography="h1" htmlString={textEnd} />
      )}
    </div>
  );
};

export default SwitchOnHeading;
```

---

## Step-by-Step: Component with SVG Icons

### Example: Feature Card

This example shows how to handle SVG file uploads and render them inline.

### Step 3: Content Model with SVG File Input

**File:** `apps/lead-gen-site/src/components/feature-card/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames } from '@/types/builder';

// ----------------------------------------------------------------------

const FeatureCard = dynamic(() => import('./index'));

export const registerFeatureCard = () =>
  Builder.registerComponent(FeatureCard, {
    name: BuilderBlockNames.FEATURE_CARD,
    models: [SITE_PAGE_MODEL_ID],
    inputs: [
      {
        name: 'title',
        type: 'text',
        required: true,
        defaultValue: 'Feature Title',
      },
      {
        name: 'description',
        type: 'longText',
        required: true,
        defaultValue: 'Feature description goes here.',
      },
      {
        name: 'icon',
        type: 'file',
        allowedFileTypes: ['svg'],  // Only SVG files
        helperText: 'Only accepts SVG files for the icon',
      },
      {
        name: 'align',
        type: 'string',
        defaultValue: 'start',
        enum: ['start', 'center', 'end'],
      },
    ],
  });
```

### Step 4: Component with SVG Rendering

**File:** `apps/lead-gen-site/src/components/feature-card/index.tsx`

```typescript
import InlineSVG from 'react-inlinesvg';
// @ag-packages
import { cn } from '@ag-packages/utils/cn';
import { Card } from '@ag-packages/ui/card';
// utils
import { transformInlineSVG } from '@/utils/builder-props';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description: string;
  align?: 'start' | 'center' | 'end';
  icon?: React.ReactNode | string;
};

const FeatureCard: React.FC<Props> = ({
  title,
  description,
  align = 'start',
  icon,
}) => {
  return (
    <Card
      className={cn('p-6', {
        'text-left': align === 'start',
        'text-center': align === 'center',
        'text-right': align === 'end',
      })}
    >
      <div
        className={cn('mb-4 flex', {
          'justify-start': align === 'start',
          'justify-center': align === 'center',
          'justify-end': align === 'end',
        })}
      >
        {icon && typeof icon === 'string' ? (
          <InlineSVG
            src={icon}
            className="size-10.5 text-primary"
            preProcessor={(code) => transformInlineSVG(code, 1.5)}
          />
        ) : (
          icon
        )}
      </div>

      <h5 className="mb-3 text-lg font-semibold">{title}</h5>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

export default FeatureCard;
```

**What `transformInlineSVG` does:**
```typescript
// Forces all paths to use currentColor and sets stroke-width
transformInlineSVG(svgCode, strokeWidth)
// Returns: Standardized SVG that inherits text color
```

**Key Points:**
- Use `react-inlinesvg` library to render SVG strings
- `transformInlineSVG` normalizes SVG to use `currentColor` for consistent theming
- SVG will inherit text color from parent via `currentColor`
- Check if `icon` is a string (URL) before rendering with InlineSVG

---

## Step-by-Step: Multiple Variants from Same Component

### Example: Form Cards (Contact Us, Jobseeker, Employer)

This shows how to register the same component multiple times with different defaults.

### Step 1: Add Multiple Names to Enum

**File:** `apps/lead-gen-site/src/types/builder.ts`

```typescript
export enum BuilderBlockNames {
  // ... existing
  FORM_CONTACT_US = 'Contact Us Form',
  FORM_EMPLOYER = 'Employer Form',
  FORM_JOBSEEKER = 'Jobseeker Form',
}

export enum FormTypeNames {
  CONTACT_US = 'contact-us',
  EMPLOYER_FORM = 'employer-form',
  JOBSEEKER_FORM = 'jobseeker-form',
}
```

### Step 3: Multiple Registrations in Content Model

**File:** `apps/lead-gen-site/src/components/form-block/form-card/content-model.ts`

```typescript
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
// constants
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
// types
import { BuilderBlockNames, FormTypeNames } from '@/types/builder';

// ----------------------------------------------------------------------

const FormCard = dynamic(() => import('./index'));

export const registerFormContactUs = () =>
  Builder.registerComponent(FormCard, {
    name: BuilderBlockNames.FORM_CONTACT_US,
    models: [SITE_PAGE_MODEL_ID],
    image: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    inputs: [
      {
        name: 'heading',
        type: 'text',
        required: true,
        defaultValue: 'Send us a message',
      },
      {
        name: 'subheading',
        type: 'text',
        defaultValue: 'We\'ll get back to you within 24 hours',
      },
      {
        name: 'formType',
        type: 'text',
        defaultValue: FormTypeNames.CONTACT_US,
        hideFromUI: true,  // Hidden from user, set internally
      },
    ],
  });

export const registerFormJobseeker = () =>
  Builder.registerComponent(FormCard, {
    name: BuilderBlockNames.FORM_JOBSEEKER,
    models: [SITE_PAGE_MODEL_ID],
    image: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    inputs: [
      {
        name: 'heading',
        type: 'text',
        required: true,
        defaultValue: 'Search & Apply',
      },
      {
        name: 'subheading',
        type: 'text',
        defaultValue: 'Find your dream job today',
      },
      {
        name: 'formType',
        type: 'text',
        defaultValue: FormTypeNames.JOBSEEKER_FORM,
        hideFromUI: true,
      },
    ],
  });

export const registerFormEmployer = () =>
  Builder.registerComponent(FormCard, {
    name: BuilderBlockNames.FORM_EMPLOYER,
    models: [SITE_PAGE_MODEL_ID],
    image: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    inputs: [
      {
        name: 'heading',
        type: 'text',
        required: true,
        defaultValue: 'Search & Hire',
      },
      {
        name: 'subheading',
        type: 'text',
        defaultValue: 'Post a job and find qualified candidates',
      },
      {
        name: 'formType',
        type: 'text',
        defaultValue: FormTypeNames.EMPLOYER_FORM,
        hideFromUI: true,
      },
    ],
  });
```

### Step 4: Component with Type-based Rendering

**File:** `apps/lead-gen-site/src/components/form-block/form-card/index.tsx`

```typescript
// @ag-packages
import { Card } from '@ag-packages/ui/card';
// types
import { FormTypeNames } from '@/types/builder';
// components
import ContactUsForm from './contact-us-form';
import JobseekerForm from './jobseeker-form';
import EmployerForm from './employer-form';

// ----------------------------------------------------------------------

type Props = {
  heading: string;
  subheading?: string;
  formType: FormTypeNames;
};

const FormCard: React.FC<Props> = ({ heading, subheading, formType }) => {
  const renderForm = () => {
    switch (formType) {
      case FormTypeNames.CONTACT_US:
        return <ContactUsForm />;
      case FormTypeNames.JOBSEEKER_FORM:
        return <JobseekerForm />;
      case FormTypeNames.EMPLOYER_FORM:
        return <EmployerForm />;
      default:
        return <ContactUsForm />;
    }
  };

  return (
    <Card className="p-8">
      <h3 className="mb-2 text-2xl font-bold">{heading}</h3>
      {subheading && <p className="mb-6 text-muted-foreground">{subheading}</p>}
      {renderForm()}
    </Card>
  );
};

export default FormCard;
```

### Step 5: Register All Variants

**File:** `apps/lead-gen-site/src/components/builder-registry.ts`

```typescript
import {
  registerFormContactUs,
  registerFormEmployer,
  registerFormJobseeker,
} from './form-block/form-card/content-model';

const builderRegistry = () => {
  // ... existing code

  const formBlockItems: { name: BuilderBlockNames }[] = [
    { name: BuilderBlockNames.FORM_CONTACT_US },
    { name: BuilderBlockNames.FORM_EMPLOYER },
    { name: BuilderBlockNames.FORM_JOBSEEKER },
  ];

  Builder.register('insertMenu', {
    name: 'Form Blocks',
    items: formBlockItems,
  });

  // Register all three variants
  registerFormContactUs();
  registerFormEmployer();
  registerFormJobseeker();
};
```

**Key Points:**
- Same component, different Builder.io names and default values
- Use `hideFromUI: true` for fields that should be set internally
- Component uses the hidden field to determine behavior
- Appears as 3 separate components in Builder.io UI

---

## Input Field Types Reference

### Complete List of Input Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Short text input | `{ name: 'title', type: 'text' }` |
| `longText` | Multi-line text area | `{ name: 'description', type: 'longText' }` |
| `richText` | WYSIWYG HTML editor | `{ name: 'content', type: 'richText' }` |
| `number` | Numeric input | `{ name: 'count', type: 'number' }` |
| `boolean` | Checkbox (true/false) | `{ name: 'enabled', type: 'boolean' }` |
| `file` | File upload | `{ name: 'image', type: 'file', allowedFileTypes: ['png', 'jpg'] }` |
| `url` | URL input with validation | `{ name: 'link', type: 'url' }` |
| `string` + `enum` | Dropdown select | `{ name: 'size', type: 'string', enum: ['sm', 'md', 'lg'] }` |
| `enum` | Dropdown (alternative) | `{ name: 'fit', type: 'enum', enum: ['contain', 'cover'] }` |
| `color` | Color picker | `{ name: 'bgColor', type: 'color' }` |
| `date` | Date picker | `{ name: 'publishDate', type: 'date' }` |
| `object` | Nested object with subFields | `{ name: 'button', type: 'object', subFields: [...] }` |
| `list` | Array of objects | `{ name: 'items', type: 'list', subFields: [...] }` |
| `array` | Array (for Builder blocks) | `{ name: 'columns', type: 'array', subFields: [{ name: 'blocks', type: 'uiBlocks' }] }` |
| `uiBlocks` | Builder.io child blocks | `{ name: 'children', type: 'uiBlocks', hideFromUI: true }` |
| `reference` | Reference to another model | `{ name: 'related', type: 'reference', model: 'products' }` |

### Input Field Options

Common options available for all input types:

```typescript
{
  name: 'fieldName',           // Required: Field identifier
  type: 'text',                // Required: Field type
  defaultValue: 'Default',     // Optional: Default value
  required: true,              // Optional: Make field required
  helperText: 'Help text',     // Optional: Helper text below input
  hideFromUI: true,            // Optional: Hide from Builder UI
  showIf: (options) => true,   // Optional: Conditional visibility
  enum: ['a', 'b', 'c'],       // Optional: For dropdowns
  subFields: [],               // Optional: For object/list/array types
  allowedFileTypes: ['png'],   // Optional: For file type only
  model: 'model-name',         // Optional: For reference type only
}
```

### Detailed Examples

#### Rich Text with Validation

```typescript
{
  name: 'heading',
  type: 'richText',
  defaultValue: '<h2>Default Heading</h2>',
  required: true,
  helperText: 'An <h2> styling will be strictly applied to this text',
}
```

#### Enum/Dropdown

```typescript
{
  name: 'textAlign',
  type: 'string',
  defaultValue: 'start',
  enum: ['start', 'center', 'end'],
  helperText: 'Text alignment option',
}
```

#### File Upload with Restrictions

```typescript
{
  name: 'image',
  type: 'file',
  allowedFileTypes: ['jpeg', 'jpg', 'png', 'gif'],
  helperText: 'Upload a media file (jpeg, jpg, png, gif)',
  required: true,
}
```

#### Object with SubFields

```typescript
{
  name: 'button',
  type: 'object',
  defaultValue: {
    label: 'Click me',
    link: '/',
  },
  subFields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'url',
      required: true,
    },
  ],
}
```

#### List/Array of Items

```typescript
{
  name: 'features',
  type: 'list',
  defaultValue: [
    { title: 'Feature 1', description: 'Description 1' },
    { title: 'Feature 2', description: 'Description 2' },
  ],
  subFields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'longText',
    },
  ],
}
```

#### Builder Blocks Container

```typescript
{
  name: 'columnList',
  type: 'array',
  defaultValue: [{ blocks: [] }],
  subFields: [
    {
      name: 'blocks',
      type: 'uiBlocks',
      hideFromUI: true,
      defaultValue: [],
    },
  ],
}
```

#### Conditional Field

```typescript
{
  name: 'advancedOptions',
  type: 'object',
  showIf: (options) => options.get('mode') === 'advanced',
  subFields: [
    // ... advanced fields
  ],
}
```

---

## Utilities & Constants Reference

### From `packages/builder-components/constants/index.ts`

#### Button Fields

```typescript
import { BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL } from '@ag-packages/builder-components/constants';

// Usage in inputs:
{
  name: 'button',
  type: 'object',
  subFields: BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL,
}

// Provides:
// - label (text, required)
// - link (url, required)
```

#### Image Fields

```typescript
import {
  BUILDER_IMAGE_FIT_FIELD,
  BUILDER_IMAGE_POSITION_FIELD,
  BUILDER_ALT_TEXT_FIELD,
  BUILDER_IMAGE_SUB_FIELDS_CONTENT_MODEL,
} from '@ag-packages/builder-components/constants';

// Usage in inputs:
{
  name: 'image',
  type: 'object',
  subFields: BUILDER_IMAGE_SUB_FIELDS_CONTENT_MODEL,
}

// Provides:
// - media (file, required)
// - imageFit (enum: contain/cover)
// - imagePosition (enum: center/top/left/right/bottom/corners)
// - altText (text, required)
```

#### Responsive Image Helper Text

```typescript
import {
  DESKTOP_MEDIA_HELPER_TEXT,
  TABLET_MEDIA_HELPER_TEXT,
  MOBILE_MEDIA_HELPER_TEXT,
} from '@ag-packages/builder-components/constants';

// Usage:
{
  name: 'desktopImage',
  type: 'file',
  helperText: DESKTOP_MEDIA_HELPER_TEXT,
  // Shows: "Upload a media file (jpeg, jpg, png, gif) - visible on breakpoints >=1280px wide"
}
```

#### Fallback Image URL

```typescript
import { FALLBACK_WHITELABEL_IMAGE_URL } from '@ag-packages/builder-components/constants';

// Usage in component:
const ImageComponent = ({ media = FALLBACK_WHITELABEL_IMAGE_URL }) => { ... }
```

### From `packages/builder-components/utils/index.ts`

#### Create Image SubFields

```typescript
import { createBuilderImageSubFields } from '@ag-packages/builder-components/utils';

// Usage in inputs:
...createBuilderImageSubFields({
  imageFieldName: 'customImageName',  // Optional, defaults to 'media'
  imageFieldHelperText: 'Custom help text',  // Optional
})

// Returns array: [media, imageFit, imagePosition, altText]
```

#### Preview Detection

```typescript
import { isPreviewingInBuilder } from '@ag-packages/builder-components/utils';

// Usage in component:
const MyComponent = ({ builderState }) => {
  const isPreview = isPreviewingInBuilder(builderState);

  if (isPreview) {
    return <div>Preview Mode UI</div>;
  }

  return <div>Production UI</div>;
};
```

#### URL Type Checkers

```typescript
import {
  isBuilderImageUrl,
  isBuilderVideoUrl,
  isVimeoVideoUrl,
  isYoutubeVideoUrl,
  isExternalVideoUrl,
} from '@ag-packages/builder-components/utils';

// Usage:
if (isBuilderImageUrl(url)) {
  // Handle Builder CDN image
}
```

### From `apps/lead-gen-site/src/utils/builder-props.ts`

#### Validate Rich Text Content

```typescript
import { hasValidRichTextContent } from '@/utils/builder-props';

// Usage:
{heading && hasValidRichTextContent(heading) && (
  <RichTextRender htmlString={heading} />
)}
```

#### Clean Rich Text

```typescript
import { cleanRichText } from '@/utils/builder-props';

// Usage:
const cleanedHtml = cleanRichText(rawHtml);
// Removes empty paragraphs, adds inline classes
```

#### Transform SVG

```typescript
import { transformInlineSVG } from '@/utils/builder-props';

// Usage:
<InlineSVG
  src={iconUrl}
  preProcessor={(code) => transformInlineSVG(code, 1.5)}
/>
// Forces currentColor and sets stroke-width
```

### From `@ag-packages/utils`

#### Class Name Utility

```typescript
import { cn } from '@ag-packages/utils/cn';

// Usage:
<div className={cn('base-class', {
  'conditional-class': condition,
  'another-class': anotherCondition,
})} />
```

#### URL Utilities

```typescript
import { isExternalUrl } from '@ag-packages/utils/url';

// Usage:
<Link
  href={url}
  target={isExternalUrl(url) ? '_blank' : '_self'}
  rel={isExternalUrl(url) ? 'noopener noreferrer' : undefined}
/>
```

---

## Best Practices & Common Patterns

### 1. Component Naming Convention

- **Enum Name**: Use `SCREAMING_SNAKE_CASE`
  ```typescript
  HERO_BANNER = 'Hero Banner'
  ```
- **Display Name**: Use title case with spaces
  ```typescript
  'Hero Banner', 'Grid Column Container'
  ```
- **File/Folder Name**: Use `kebab-case`
  ```
  hero-banner/, grid-column-container/
  ```
- **Component Name**: Use `PascalCase`
  ```typescript
  const HeroBanner = () => { ... }
  ```
- **Registration Function**: Use `registerComponentName`
  ```typescript
  export const registerHeroBanner = () => { ... }
  ```

### 2. Always Validate Rich Text

Rich text fields can contain empty tags. Always validate before rendering:

```typescript
import { hasValidRichTextContent } from '@/utils/builder-props';

{heading && hasValidRichTextContent(heading) && (
  <RichTextRender typography="h2" htmlString={heading} />
)}
```

### 3. Default Values Best Practices

- **Always provide defaults** for non-required fields
- **Use realistic example content** in defaults
- **Match defaults to component purpose**

```typescript
{
  name: 'heading',
  type: 'richText',
  defaultValue: '<h2>Enter heading text here. Remove if not needed.</h2>',
  // NOT: defaultValue: '<h2></h2>' (too empty)
}
```

### 4. Helper Text Guidelines

- **Be specific** about what the field does
- **Mention constraints** (file types, Tailwind values, etc.)
- **Provide examples** when helpful

```typescript
{
  name: 'gap',
  type: 'number',
  defaultValue: 4,
  helperText: 'Column gap must match Tailwind spacing scale values (0-96)',
}
```

### 5. File Uploads

Always specify `allowedFileTypes` for file inputs:

```typescript
{
  name: 'image',
  type: 'file',
  allowedFileTypes: ['jpeg', 'jpg', 'png', 'gif'],  // Images
  helperText: 'Upload a media file (jpeg, jpg, png, gif)',
}

{
  name: 'icon',
  type: 'file',
  allowedFileTypes: ['svg'],  // SVG only
  helperText: 'Only accepts SVG files',
}
```

### 6. Button/Link Handling

Always check for external URLs and set appropriate attributes:

```typescript
import { isExternalUrl } from '@ag-packages/utils/url';

<Link
  href={buttonLink.link || ''}
  rel={isExternalUrl(buttonLink.link) ? 'noopener noreferrer' : undefined}
  target={isExternalUrl(buttonLink.link) ? '_blank' : '_self'}
>
  {buttonLink.label}
</Link>
```

### 7. Responsive Design Pattern

Use CSS variables for responsive values:

```typescript
// In component:
style={{
  '--col-num-xs': `repeat(${columns.small}, minmax(0, 1fr))`,
  '--col-num-sm': `repeat(${columns.medium}, minmax(0, 1fr))`,
  '--col-num-md': `repeat(${columns.large}, minmax(0, 1fr))`,
} as React.CSSProperties}

// In className:
className="grid grid-cols-[var(--col-num-xs)] sm:grid-cols-[var(--col-num-sm)] md:grid-cols-[var(--col-num-md)]"
```

### 8. Container Components

When creating containers that accept child blocks:

1. **Add `builderBlock` to Props type:**
   ```typescript
   type Props = {
     // ... other props
     builderBlock: BuilderElement;
   };
   ```

2. **Use `BuilderBlocks` component:**
   ```typescript
   <BuilderBlocks
     parentElementId={builderBlock?.id}
     dataPath="children" // or "columnList.0.blocks"
     blocks={children}
   />
   ```

3. **Define `uiBlocks` input:**
   ```typescript
   {
     name: 'children',
     type: 'uiBlocks',
     hideFromUI: true,
     defaultValue: [],
   }
   ```

### 9. Dynamic Imports

Always use dynamic imports for components in content-model.ts:

```typescript
import dynamic from 'next/dynamic';

const ComponentName = dynamic(() => import('./index'));
```

**Benefits:**
- Code splitting
- Reduced initial bundle size
- Better performance

### 10. TypeScript Props

Define explicit prop types with defaults:

```typescript
type Props = {
  // Required props (no ?)
  title: string;
  description: string;

  // Optional props with defaults
  gap?: number;
  textAlign?: 'start' | 'center' | 'end';

  // Optional props
  image?: string;

  // Builder-specific props
  builderBlock?: BuilderElement;
  builderState?: BuilderComponentState;
};

const Component: React.FC<Props> = ({
  title,
  description,
  gap = 4,  // Default in destructuring
  textAlign = 'start',
  image,
  builderBlock,
  builderState,
}) => { ... };
```

### 11. Image Component Pattern

Use Next.js Image component with proper attributes:

```typescript
import Image from 'next/image';

<Image
  src={media}
  alt={altText}
  fill  // For responsive containers
  className={cn({
    'object-cover': imageFit === 'cover',
    'object-contain': imageFit === 'contain',
  })}
  priority={isPriority}  // For above-the-fold images
/>
```

### 12. Custom Insert Menu Categories

Organize components into logical groups:

```typescript
const builderRegistry = () => {
  Builder.register('editor.settings', { customInsertMenu: true });

  const buildingBlockItems = [
    { name: BuilderBlockNames.TEXT_BANNER },
    // Small, reusable building blocks
  ];

  const contentBlockItems = [
    { name: BuilderBlockNames.HERO_BANNER },
    // Full-width content sections
  ];

  const formBlockItems = [
    { name: BuilderBlockNames.FORM_CONTACT_US },
    // Form components
  ];

  Builder.register('insertMenu', { name: 'Building Blocks', items: buildingBlockItems });
  Builder.register('insertMenu', { name: 'Content Blocks', items: contentBlockItems });
  Builder.register('insertMenu', { name: 'Form Blocks', items: formBlockItems });
};
```

### 13. Conditional Rendering

Use early returns for cleaner code:

```typescript
const Component = ({ items }) => {
  // Early return for no data
  if (!items || items.length === 0) {
    return null;
  }

  // Main rendering
  return (
    <div>
      {items.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
};
```

### 14. Builder.io Image Thumbnails

Add thumbnail images to make components easily identifiable:

```typescript
Builder.registerComponent(Component, {
  name: BuilderBlockNames.COMPONENT_NAME,
  models: [SITE_PAGE_MODEL_ID],
  image: 'https://cdn.builder.io/api/v1/image/assets%2F...', // Screenshot/preview
  inputs: [ ... ],
});
```

### 15. Testing Checklist

Before considering a component complete:

- [ ] Component appears in correct insert menu category
- [ ] All inputs are visible and functional in Builder.io editor
- [ ] Default values display correctly
- [ ] Conditional inputs show/hide as expected
- [ ] Rich text renders properly
- [ ] Images load and respect fit/position settings
- [ ] Buttons/links work with internal and external URLs
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Component renders correctly in Builder.io preview
- [ ] Component renders correctly on published page
- [ ] No console errors or warnings
- [ ] TypeScript types are correct (no `any`)

---

## Complete Workflow Summary

### Creating Any New Component:

1. **Add to enum** (`src/types/builder.ts`)
2. **Create folder** (`src/components/component-name/`)
3. **Create `content-model.ts`**
   - Import dependencies
   - Dynamic import component
   - Define registration function
   - Configure inputs array
   - Export registration function
4. **Create `index.tsx`**
   - Define TypeScript Props type
   - Implement component logic
   - Handle conditional rendering
   - Use utility functions
   - Export default component
5. **Register in builder-registry.ts**
   - Import registration function
   - Add to appropriate category array
   - Call registration function
6. **Test in Builder.io**
   - Restart dev server
   - Open Builder.io editor
   - Find component in insert menu
   - Test all inputs and features
   - Verify preview and published output

---

## Additional Resources

### File Locations Quick Reference

```
apps/lead-gen-site/
├── src/
│   ├── components/
│   │   ├── builder-registry.ts           # Central registry
│   │   ├── your-component/
│   │   │   ├── content-model.ts          # Builder config
│   │   │   └── index.tsx                 # Component
│   ├── types/
│   │   └── builder.ts                    # BuilderBlockNames enum
│   ├── constants/
│   │   └── site.ts                       # SITE_PAGE_MODEL_ID
│   └── utils/
│       └── builder-props.ts              # Utilities

packages/builder-components/
├── constants/
│   └── index.ts                          # Reusable field configs
├── utils/
│   └── index.ts                          # Shared utilities
└── types/
    └── index.ts                          # BuilderComponentState
```

### Common Imports Cheat Sheet

```typescript
// Content Model
import dynamic from 'next/dynamic';
import { Builder } from '@builder.io/react';
import { SITE_PAGE_MODEL_ID } from '@/constants/site';
import { BuilderBlockNames } from '@/types/builder';
import { BUILDER_BUTTON_SUB_FIELDS_CONTENT_MODEL } from '@ag-packages/builder-components/constants';
import { createBuilderImageSubFields } from '@ag-packages/builder-components/utils';

// Component
import { BuilderBlocks, type BuilderElement } from '@builder.io/react';
import { BuilderComponentState } from '@ag-packages/builder-components/types';
import { cn } from '@ag-packages/utils/cn';
import { isExternalUrl } from '@ag-packages/utils/url';
import { hasValidRichTextContent, transformInlineSVG } from '@/utils/builder-props';
import { isPreviewingInBuilder } from '@ag-packages/builder-components/utils';
```

---

## Conclusion

You now have a complete guide to creating Builder.io components in this codebase. This guide covers:

✅ Simple text-based components
✅ Components with images
✅ Components with buttons/links
✅ Components with arrays/lists
✅ Container components with nested children
✅ Components with default children
✅ Components with conditional inputs
✅ Components with SVG icons
✅ Multiple variants from the same component
✅ All input field types
✅ Utilities and constants
✅ Best practices and patterns

Follow these patterns consistently to create maintainable, type-safe, and user-friendly Builder.io components. Happy building!
