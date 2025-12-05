# Complete Next.js/React/TypeScript Learning Guide
## Based on Blueprint Lead-Gen-Site Codebase Analysis

This comprehensive guide will teach you everything you need to know to develop React/Next.js applications professionally, based on the actual patterns used in the `/apps/lead-gen-site` codebase.

---

## Table of Contents

1. [Fundamentals (Start Here)](#1-fundamentals-start-here)
2. [Intermediate Concepts](#2-intermediate-concepts)
3. [Advanced Patterns](#3-advanced-patterns)
4. [Professional Development Practices](#4-professional-development-practices)
5. [Codebase Directory Structure Guide](#5-codebase-directory-structure-guide)
6. [Practical Examples from the Codebase](#6-practical-examples-from-the-codebase)

---

## 1. Fundamentals (Start Here)

### 1.1 JavaScript/TypeScript Basics You Need

#### **Variables & Types**
Learn these TypeScript concepts used throughout the codebase:

```typescript
// String types with literal unions (used in types/site.ts)
type SiteId = 'blueprint' | 'gtp';

// Object types (used everywhere)
interface JobType {
  job_reference: string;
  job_title: string;
  location: string;
  posted_date: string;
}

// Array types
const jobs: JobType[] = [];

// Optional properties (used in navigation types)
interface NavigationItem {
  title: string;
  url?: string; // Optional field
  subItems?: NavigationItem[];
}

// Type inference (TypeScript figures it out)
const count = 5; // TypeScript knows this is a number
```

**What to learn:**
- ✅ Basic types: `string`, `number`, `boolean`, `null`, `undefined`
- ✅ Arrays and objects
- ✅ Type annotations vs inference
- ✅ Interfaces vs Type aliases
- ✅ Optional properties (`?:`)
- ✅ Union types (`string | number`)
- ✅ Template literal types

**Resources:**
- TypeScript Handbook: Basic Types
- TypeScript Deep Dive (free book)

---

#### **Functions & Arrow Functions**
Every React component in the codebase uses arrow functions:

```typescript
// Component function (used in all 30+ components)
const HeroBanner: React.FC<HeroBannerProps> = ({
  displayInFullHeight,
  description,
  primaryButton
}) => {
  return (
    <div className="hero-banner">
      {description && <p>{description}</p>}
    </div>
  );
};

// Async functions (used in server actions)
const submitContactUsFormAction = async (
  value: ContactUsFormType
): Promise<{ success: boolean }> => {
  const result = await sendEmail(value);
  return { success: result.success };
};

// Callback functions (used in forms)
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  console.log('Form submitted');
};
```

**What to learn:**
- ✅ Arrow function syntax `() => {}`
- ✅ Function parameters and return types
- ✅ `async/await` for asynchronous code
- ✅ Callbacks and event handlers
- ✅ Destructuring parameters `({ name, age }) => {}`

---

#### **Array Methods (Critical for React)**
The codebase heavily uses these for filtering jobs, mapping components:

```typescript
// .map() - Used to render lists (jobs-page.tsx, search results)
const jobCards = jobs.map((job) => (
  <JobCard key={job.job_reference} job={job} />
));

// .filter() - Used in SearchFilterProvider
const filteredJobs = jobs.filter((job) =>
  job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
);

// .find() - Used to get single job by reference
const job = jobs.find((j) => j.job_reference === jobRef);

// .reduce() - Used to group navigation items
const grouped = items.reduce((acc, item) => {
  acc[item.category] = [...(acc[item.category] || []), item];
  return acc;
}, {});

// .some() - Check if any item matches
const hasAppliedFilters = Object.values(selectedAttributes).some(
  (arr) => arr.length > 0
);

// Chaining methods (used in job filtering)
const results = jobs
  .filter((job) => job.location === 'London')
  .map((job) => job.job_title)
  .sort();
```

**What to learn:**
- ✅ `.map()` - Transform arrays
- ✅ `.filter()` - Select subset of items
- ✅ `.find()` - Get first matching item
- ✅ `.reduce()` - Aggregate data
- ✅ `.some()` / `.every()` - Boolean checks
- ✅ Method chaining

**Practice:** Filter and display a list of jobs by location.

---

#### **Object Manipulation**
Used extensively for form data, API responses:

```typescript
// Destructuring (used in every component)
const { firstName, lastName, email } = formData;

// Spread operator (used in state updates)
const updatedForm = { ...formData, email: 'new@email.com' };

// Object.keys(), Object.values() (used in filter logic)
const hasFilters = Object.values(selectedAttributes).some(arr => arr.length > 0);

// Dynamic property access
const value = formData[fieldName]; // fieldName is a variable
```

**What to learn:**
- ✅ Destructuring `{ name, age } = person`
- ✅ Spread operator `{ ...obj }`
- ✅ Object.keys(), Object.values(), Object.entries()
- ✅ Dynamic properties `obj[key]`

---

### 1.2 React Fundamentals

#### **Components & JSX**
Every file in [src/components/](src/components/) is a React component:

```typescript
// Functional Component (used everywhere)
const ContactUsForm: React.FC<GenericFormProps> = ({ scrollRef }) => {
  return (
    <form className="contact-form">
      <input type="text" name="firstName" />
      <button type="submit">Submit</button>
    </form>
  );
};

// JSX Rules:
// 1. Return single parent element
// 2. Close all tags <input />
// 3. Use className instead of class
// 4. camelCase attributes (onClick, onChange)
// 5. Embed JavaScript with {}
```

**What to learn:**
- ✅ JSX syntax and rules
- ✅ Component structure (import, define, export)
- ✅ Props (passing data to components)
- ✅ Children prop
- ✅ Conditional rendering `{condition && <Component />}`
- ✅ List rendering with `.map()`

**Example from codebase:** [src/components/forms/contact-us-form/index.tsx](src/components/forms/contact-us-form/index.tsx)

---

#### **Props & Component Composition**
See [src/components/builder-registered-components/](src/components/builder-registered-components/):

```typescript
// Props interface (every component has one)
interface HeroBannerProps {
  displayInFullHeight: boolean;
  description: string;
  primaryButton?: {
    label: string;
    url: string;
  };
  backgroundImage: string;
}

// Using props
const HeroBanner: React.FC<HeroBannerProps> = ({
  displayInFullHeight,
  description,
  primaryButton,
  backgroundImage
}) => {
  return (
    <section className={displayInFullHeight ? 'h-screen' : 'h-auto'}>
      <img src={backgroundImage} alt="" />
      <p>{description}</p>
      {primaryButton && (
        <a href={primaryButton.url}>{primaryButton.label}</a>
      )}
    </section>
  );
};

// Component composition (nesting components)
const JobsPage = () => (
  <div>
    <SearchInput />
    <JobList jobs={jobs} />
    <Footer />
  </div>
);
```

**What to learn:**
- ✅ Defining prop types with TypeScript
- ✅ Optional props `prop?:`
- ✅ Default props
- ✅ Destructuring props
- ✅ Component composition patterns

---

#### **State Management with useState**
Used in forms, search filters (see [src/components/search/search-input.tsx](src/components/search/search-input.tsx)):

```typescript
import { useState } from 'react';

const SearchInput = () => {
  // Declare state variable
  const [searchTerm, setSearchTerm] = useState('');

  // Update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <input
      value={searchTerm}
      onChange={handleChange}
      placeholder="Search jobs..."
    />
  );
};

// State with objects (used in forms)
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: ''
});

// Update object state (important: use spread)
const updateField = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

**What to learn:**
- ✅ `useState()` hook basics
- ✅ State update functions
- ✅ State with primitives vs objects
- ✅ Immutable updates (spread operator)
- ✅ Controlled vs uncontrolled components

**Practice:** Build a search filter that updates a list as you type.

---

#### **Side Effects with useEffect**
Used for data fetching, DOM manipulation:

```typescript
import { useEffect, useState } from 'react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  // Runs after component mounts
  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    }
    fetchJobs();
  }, []); // Empty array = run once on mount

  return <div>{jobs.map(job => <JobCard key={job.id} job={job} />)}</div>;
};

// With dependencies (re-run when searchTerm changes)
useEffect(() => {
  const filtered = jobs.filter(job =>
    job.title.includes(searchTerm)
  );
  setFilteredJobs(filtered);
}, [searchTerm, jobs]); // Re-run when these change
```

**What to learn:**
- ✅ `useEffect()` hook
- ✅ Dependency array `[]`
- ✅ Cleanup functions
- ✅ Common use cases (fetching, subscriptions, DOM)

---

### 1.3 Next.js Basics

#### **File-Based Routing (App Router)**
The codebase uses Next.js App Router (see [src/app/](src/app/)):

```
src/app/
├── layout.tsx                    # Root layout (wraps all pages)
├── [[...page]]/page.tsx          # Catch-all route (Builder.io pages)
├── job-seeker/
│   └── jobs/
│       ├── page.tsx              # Route: /job-seeker/jobs
│       └── [jobRef]/
│           └── page.tsx          # Dynamic route: /job-seeker/jobs/ABC123
├── robots.ts                     # Route: /robots.txt
├── sitemap.ts                    # Route: /sitemap.xml
└── site.webmanifest/route.ts     # Route: /site.webmanifest
```

**Routing patterns used:**
- Static routes: `about/page.tsx` → `/about`
- Dynamic routes: `[jobRef]/page.tsx` → `/job-seeker/jobs/ABC123`
- Catch-all: `[[...page]]/page.tsx` → Matches any URL path

**What to learn:**
- ✅ File-based routing structure
- ✅ `page.tsx` = route component
- ✅ `layout.tsx` = wrapper layout
- ✅ Dynamic segments `[param]`
- ✅ Catch-all routes `[...slug]` and optional `[[...slug]]`

---

#### **Server Components vs Client Components**
Next.js 15 defaults to Server Components:

```typescript
// SERVER COMPONENT (default)
// src/app/job-seeker/jobs/page.tsx
// ✅ No 'use client' directive
// ✅ Can fetch data directly
// ✅ Renders on server, sends HTML
const JobsPage = async () => {
  // Fetch data on server
  const jobs = await getJobList();

  return (
    <div>
      <h1>Job Listings</h1>
      <JobListClient jobs={jobs} />
    </div>
  );
};

// CLIENT COMPONENT
// src/components/search/search-input.tsx
'use client'; // ⚡ Required for interactivity

import { useState } from 'react';

const SearchInput = () => {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
```

**When to use each:**
- **Server Component:** Default, data fetching, static content
- **Client Component:** Interactivity (onClick, useState, useEffect)

**What to learn:**
- ✅ Server vs Client components
- ✅ `'use client'` directive
- ✅ Data fetching in Server Components
- ✅ Passing data from Server to Client components

---

#### **Layouts & Metadata**
See [src/app/layout.tsx](src/app/layout.tsx):

```typescript
// Root Layout (wraps entire app)
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch data once for all pages
  const [websiteConfig, navigation] = await Promise.all([
    getWebsiteConfigEntryForSite(),
    getSiteNavigation(),
  ]);

  return (
    <html lang="en">
      <body>
        <Header navigation={navigation} />
        {children} {/* Page content goes here */}
        <Footer config={websiteConfig} />
      </body>
    </html>
  );
}

// Metadata for SEO (same file)
export async function generateMetadata(): Promise<Metadata> {
  const config = await getWebsiteConfigEntryForSite();

  return {
    title: config.seoTitle || config.companyName,
    description: config.seoDescription,
    icons: {
      icon: '/favicon.ico',
    },
  };
}
```

**What to learn:**
- ✅ Layout files
- ✅ Nested layouts
- ✅ `generateMetadata()` function
- ✅ SEO optimization

---

### 1.4 Tailwind CSS Fundamentals

Every component uses Tailwind (utility-first CSS):

```typescript
// Instead of writing CSS:
// .hero-banner { display: flex; padding: 20px; background: blue; }

// Use utility classes:
const HeroBanner = () => (
  <div className="flex p-5 bg-blue-500">
    <h1 className="text-4xl font-bold text-white">Hero Title</h1>
    <p className="text-lg text-gray-200 mt-4">Description text</p>
  </div>
);

// Responsive design (used throughout codebase)
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>

// Conditional classes (used in active states)
<a className={`nav-link ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
  Link
</a>

// Template literals for dynamic classes
const buttonClass = `px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`;
```

**Common Tailwind patterns in codebase:**
- Layout: `flex`, `grid`, `container`, `mx-auto`
- Spacing: `p-4`, `mt-2`, `gap-4`
- Typography: `text-xl`, `font-bold`, `leading-tight`
- Colors: `bg-blue-500`, `text-white`, `border-gray-300`
- Responsive: `md:`, `lg:`, `xl:` prefixes

**What to learn:**
- ✅ Utility-first CSS concept
- ✅ Common utilities (spacing, colors, typography)
- ✅ Responsive design with breakpoints
- ✅ Hover/focus states
- ✅ Custom theme configuration

**Resources:**
- Tailwind CSS Documentation (official)
- Tailwind UI (component examples)

---

## 2. Intermediate Concepts

### 2.1 Advanced TypeScript

#### **Generics**
Used in utility functions and components:

```typescript
// Generic type (reusable for any type)
type ApiResponse<T> = {
  data: T;
  success: boolean;
  error?: string;
};

// Usage
const jobResponse: ApiResponse<JobType> = {
  data: { job_reference: '123', job_title: 'Developer' },
  success: true,
};

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'John' },
  success: true,
};

// Generic function
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstJob = getFirstItem(jobs); // Type: JobType | undefined
```

**What to learn:**
- ✅ Generic syntax `<T>`
- ✅ Generic functions
- ✅ Generic interfaces
- ✅ Constraints `<T extends SomeType>`

---

#### **Utility Types**
Used throughout for type transformations:

```typescript
// Partial - Make all properties optional
type PartialJob = Partial<JobType>;
// { job_reference?: string; job_title?: string; ... }

// Pick - Select specific properties
type JobPreview = Pick<JobType, 'job_reference' | 'job_title'>;
// { job_reference: string; job_title: string; }

// Omit - Exclude specific properties
type JobWithoutRef = Omit<JobType, 'job_reference'>;
// All JobType fields except job_reference

// Record - Create object type with specific keys
type JobStatusMap = Record<string, 'active' | 'closed'>;
// { [key: string]: 'active' | 'closed' }

// Example from codebase (types/job.ts)
type JobAttrributesListType = {
  location: string[];
  job_type: string[];
  industry: string[];
};
```

**What to learn:**
- ✅ `Partial<T>`, `Required<T>`
- ✅ `Pick<T, K>`, `Omit<T, K>`
- ✅ `Record<K, V>`
- ✅ `Readonly<T>`
- ✅ `ReturnType<T>`, `Parameters<T>`

---

#### **Type Guards & Narrowing**
Used for runtime type safety:

```typescript
// Type guard function (used in file validation)
function isFile(value: unknown): value is File {
  return value instanceof File;
}

// Usage
const handleUpload = (file: File | null) => {
  if (isFile(file)) {
    // TypeScript knows file is File here
    console.log(file.name);
  }
};

// Discriminated unions (used in form submission results)
type SubmissionResult =
  | { success: true; message: string }
  | { success: false; error: string };

const handleResult = (result: SubmissionResult) => {
  if (result.success) {
    // TypeScript knows result has 'message' property
    console.log(result.message);
  } else {
    // TypeScript knows result has 'error' property
    console.log(result.error);
  }
};
```

**What to learn:**
- ✅ Type predicates `value is Type`
- ✅ `typeof` and `instanceof` checks
- ✅ Discriminated unions
- ✅ Type narrowing

---

### 2.2 React Context API

Used in [src/provider/search-filter-provider.tsx](src/provider/search-filter-provider.tsx):

```typescript
// 1. Create context
const SearchFilterContext = createContext<SearchFilterContextType | undefined>(
  undefined
);

// 2. Create provider component
export const SearchFilterProvider: React.FC<SearchFilterProviderProps> = ({
  children,
  jobsData,
  attributesList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({
    location: [],
    job_type: [],
    industry: [],
  });

  // Memoized filtered jobs
  const filteredJobs = useMemo(() => {
    return jobsData.filter(job =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobsData, searchTerm]);

  const value = {
    searchTerm,
    setSearchTerm,
    selectedAttributes,
    setSelectedAttributes,
    filteredJobs,
  };

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  );
};

// 3. Create custom hook for consuming context
export const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error('useSearchFilter must be used within SearchFilterProvider');
  }
  return context;
};

// 4. Use in component
const SearchInput = () => {
  const { searchTerm, setSearchTerm } = useSearchFilter();

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
```

**What to learn:**
- ✅ `createContext()`
- ✅ Context Provider pattern
- ✅ `useContext()` hook
- ✅ Custom context hooks
- ✅ When to use Context vs props

---

### 2.3 Custom Hooks

Pattern used for reusable logic:

```typescript
// Example: useDebounce hook (common pattern)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Only search after user stops typing for 500ms
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
};

// Example: useLocalStorage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}
```

**What to learn:**
- ✅ Custom hook naming (`use` prefix)
- ✅ Extracting reusable logic
- ✅ Composing hooks
- ✅ Common patterns (useDebounce, useLocalStorage, useFetch)

---

### 2.4 useMemo & useCallback

Used for performance optimization (see [src/provider/search-filter-provider.tsx](src/provider/search-filter-provider.tsx)):

```typescript
import { useMemo, useCallback } from 'react';

// useMemo - Memoize expensive calculations
const SearchFilterProvider = ({ jobsData, searchTerm }) => {
  // Only recalculate when jobsData or searchTerm changes
  const filteredJobs = useMemo(() => {
    console.log('Filtering jobs...');
    return jobsData.filter(job =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobsData, searchTerm]); // Dependencies

  return <JobList jobs={filteredJobs} />;
};

// useCallback - Memoize functions
const JobList = ({ jobs }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);

  // Memoize function so it's not recreated every render
  const handleJobSelect = useCallback((jobId: string) => {
    setSelectedJobs(prev => [...prev, jobId]);
  }, []); // Empty dependencies = never changes

  return (
    <div>
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onSelect={handleJobSelect} // Same function reference
        />
      ))}
    </div>
  );
};
```

**When to use:**
- `useMemo`: Expensive calculations (filtering large arrays, complex computations)
- `useCallback`: Passing functions to memoized child components

**What to learn:**
- ✅ `useMemo()` for values
- ✅ `useCallback()` for functions
- ✅ Dependency arrays
- ✅ Performance optimization strategies

---

### 2.5 Form Handling with TanStack React Form

The codebase uses TanStack React Form (see [src/components/forms/](src/components/forms/)):

```typescript
import { useForm, useStore } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

// 1. Define Zod schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
});

type ContactFormType = z.infer<typeof contactFormSchema>;

// 2. Create validators
const onChange = zodValidator({
  schema: contactFormSchema
});

const onSubmit = zodValidator({
  schema: contactFormSchema,
  async: true,
});

// 3. Use form hook
const ContactForm = () => {
  const [submissionResult, setSubmissionResult] = useState(null);

  const form = useForm({
    validators: { onChange, onSubmit },
    defaultValues: {
      firstName: '',
      email: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      const result = await submitContactUsFormAction(value);
      setSubmissionResult(result);
    },
  });

  // Access form state
  const isValid = useStore(form.store, (state) => state.isValid);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Field component */}
      <form.Field name="firstName">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <span>{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={!isValid || isSubmitting}>
        Submit
      </button>
    </form>
  );
};
```

**What to learn:**
- ✅ TanStack React Form setup
- ✅ Zod schema validation
- ✅ Field-level validation
- ✅ Form state management
- ✅ Error handling
- ✅ Submit handling

**Resources:**
- TanStack React Form docs
- Zod documentation

---

### 2.6 API Integration & Data Fetching

#### **Server-Side Fetching (Preferred)**
See [src/utils/api/](src/utils/api/):

```typescript
// utils/api/idibu/job.ts
export const getJobList = async (): Promise<JobType[]> => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_IDIBU_JSON_ENDPOINT!,
    {
      cache: 'no-store', // Don't cache (always fresh data)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  const data = await response.json();
  return data?.jobs?.job ?? [];
};

// Usage in Server Component
const JobsPage = async () => {
  const jobs = await getJobList();

  return <JobList jobs={jobs} />;
};

// Parallel fetching (used in layout.tsx)
const [websiteConfig, navigation, jobs] = await Promise.all([
  getWebsiteConfigEntryForSite(),
  getSiteNavigation(),
  getJobList(),
]);
```

**Fetch options used in codebase:**
- `cache: 'no-store'` - Don't cache (dynamic data)
- `cache: 'force-cache'` - Cache indefinitely (static data)
- `next: { revalidate: 3600 }` - Revalidate after 1 hour

---

#### **Builder.io SDK Integration**
See [src/utils/api/builder/queries.ts](src/utils/api/builder/queries.ts):

```typescript
import { builder } from '@builder.io/sdk';

// Initialize SDK
builder.init(process.env.BUILDER_IO_API_KEY!);

// Fetch page content by URL
export const getPageModelEntryByUrl = async (urlPath: string[]) => {
  const page = await builder
    .get('site-page', {
      userAttributes: {
        urlPath: '/' + urlPath.join('/')
      },
      options: {
        enrich: true,      // Expand references
        cache: false,      // Fresh data
        cachebust: true,   // Bypass CDN cache
      },
    })
    .promise();

  return page as BuilderPageModel;
};

// Get all navigation items
export const getSiteNavigation = async () => {
  const data = await builder.getAll('blueprint-navigation', {
    options: { enrich: true },
    query: {
      'data.codeId': {
        $in: ['primary', 'footer-column-1', 'footer-column-2']
      },
    },
  });

  return data as NavigationModel[];
};
```

**What to learn:**
- ✅ REST API calls with `fetch()`
- ✅ Async/await pattern
- ✅ Error handling
- ✅ TypeScript with API responses
- ✅ Environment variables
- ✅ SDK integration (Builder.io example)

---

### 2.7 Environment Variables

See [env.schema.ts](apps/lead-gen-site/env.schema.ts) and [.env.sample](apps/lead-gen-site/.env.sample):

```typescript
// env.schema.ts - Validates environment variables at build time
import { z } from 'zod';

const envSchema = z.object({
  // Required variables
  SITE_ID: z.enum(['blueprint', 'gtp']),
  BASE_URL: z.string().url(),
  BUILDER_IO_API_KEY: z.string().min(1),

  // Optional variables
  GTM_ID: z.string().optional(),

  // Email configuration
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
});

// Validate on app start
export const env = envSchema.parse(process.env);

// Usage in code
import { env } from './env.schema';

const apiKey = env.BUILDER_IO_API_KEY; // Type-safe!
```

**Next.js environment variable rules:**
- `NEXT_PUBLIC_*` - Available in browser (client components)
- No prefix - Server-only (API keys, secrets)

**.env file structure:**
```bash
# .env.local (git-ignored)
SITE_ID=blueprint
BASE_URL=http://localhost:3000
BUILDER_IO_API_KEY=your_key_here
NEXT_PUBLIC_IDIBU_JSON_ENDPOINT=https://api.idibu.com/jobs
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
```

**What to learn:**
- ✅ Environment variable naming
- ✅ `NEXT_PUBLIC_` prefix
- ✅ Accessing via `process.env`
- ✅ Validation with Zod
- ✅ `.env.local` vs `.env`

---

### 2.8 Error Handling

Patterns used throughout codebase:

```typescript
// Try-catch for async operations (server actions)
const submitFormAction = async (data: FormData) => {
  try {
    const result = await sendEmail(data);
    return { success: true };
  } catch (error) {
    console.error('Form submission failed:', error);
    return { success: false, error: 'Failed to submit form' };
  }
};

// Optional chaining & nullish coalescing
const jobTitle = job?.job_title ?? 'Untitled Job';
const location = data?.location?.name || 'Unknown';

// Type guards for validation
function isValidFile(file: unknown): file is File {
  return file instanceof File && file.size <= 3 * 1024 * 1024; // 3MB
}

// Zod error handling (form validation)
const result = contactFormSchema.safeParse(formData);

if (!result.success) {
  // Get first error for each field
  const errors = result.error.flatten().fieldErrors;
  return { success: false, errors };
}

// Builder.io preview fallback
const page = await getPageModelEntryByUrl(urlPath);

if (!page) {
  return notFound(); // Show 404 page
}
```

**What to learn:**
- ✅ Try-catch blocks
- ✅ Optional chaining `?.`
- ✅ Nullish coalescing `??`
- ✅ Type guards
- ✅ Error boundaries (React)
- ✅ Validation error handling

---

## 3. Advanced Patterns

### 3.1 Server Actions

Next.js Server Actions for form submissions (see [src/app/actions/form.ts](src/app/actions/form.ts)):

```typescript
'use server'; // Directive for server-only code

import { z } from 'zod';
import nodemailer from 'nodemailer';
import { contactUsFormSchema } from '@/types/forms/contact-us';

// Server action function
export async function submitContactUsFormAction(
  value: ContactUsFormType
): Promise<{ success: boolean }> {
  // 1. Validate data (server-side, don't trust client)
  const result = contactUsFormSchema.safeParse(value);

  if (!result.success) {
    return { success: false };
  }

  // 2. Perform server-side operation (send email)
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'contact@example.com',
      subject: 'New Contact Form Submission',
      html: `
        <p>Name: ${result.data.firstName} ${result.data.lastName}</p>
        <p>Email: ${result.data.email}</p>
        <p>Message: ${result.data.message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false };
  }
}

// Usage in Client Component
'use client';

const ContactForm = () => {
  const handleSubmit = async (formData: ContactUsFormType) => {
    const result = await submitContactUsFormAction(formData);

    if (result.success) {
      alert('Form submitted successfully!');
    }
  };
};
```

**File upload handling (JobSeeker form):**
```typescript
export async function submitJobseekerFormAction(formData: FormData) {
  const file = formData.get('cvUpload') as File | null;

  if (file) {
    // Validate file type via magic bytes (security)
    const buffer = Buffer.from(await file.arrayBuffer());
    const isValid = isPDF_DOC_DOCX(buffer);

    if (!isValid) {
      return { success: false, error: 'Invalid file type' };
    }

    // Process file (save, upload to S3, etc.)
  }
}
```

**What to learn:**
- ✅ `'use server'` directive
- ✅ Server actions vs API routes
- ✅ Form data handling
- ✅ File uploads
- ✅ Server-side validation
- ✅ Progressive enhancement

---

### 3.2 Dynamic Routing & Params

See [src/app/job-seeker/jobs/[jobRef]/page.tsx](src/app/job-seeker/jobs/[jobRef]/page.tsx):

```typescript
// Dynamic route: /job-seeker/jobs/[jobRef]
// Example URL: /job-seeker/jobs/JOB123

interface JobDetailPageProps {
  params: Promise<{ jobRef: string }>; // Route parameter
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Query params
}

const JobDetailPage = async ({ params, searchParams }: JobDetailPageProps) => {
  // Await params (Next.js 15+ requirement)
  const { jobRef } = await params;
  const query = await searchParams;

  // Fetch job by reference
  const job = await getJobDetailsByReference(jobRef);

  if (!job) {
    return notFound(); // Show 404
  }

  return (
    <div>
      <h1>{job.job_title}</h1>
      <p>{job.job_description}</p>
    </div>
  );
};

export default JobDetailPage;

// Generate static params at build time (optional optimization)
export async function generateStaticParams() {
  const jobs = await getJobList();

  return jobs.map((job) => ({
    jobRef: job.job_reference,
  }));
}
```

**Catch-all route example:**
```typescript
// [[...page]]/page.tsx
// Matches: /, /about, /about/team, /about/team/member

interface PageProps {
  params: Promise<{ page?: string[] }>;
}

const Page = async ({ params }: PageProps) => {
  const { page = [] } = await params; // Default to []

  const urlPath = '/' + page.join('/');
  const pageData = await getPageModelEntryByUrl(page);

  return <BuilderContent content={pageData} />;
};
```

**What to learn:**
- ✅ Dynamic route segments `[param]`
- ✅ Catch-all routes `[...slug]`
- ✅ Optional catch-all `[[...slug]]`
- ✅ `generateStaticParams()`
- ✅ `notFound()` function

---

### 3.3 Metadata Generation (SEO)

See [src/app/layout.tsx](src/app/layout.tsx) and [src/app/job-seeker/jobs/[jobRef]/page.tsx](src/app/job-seeker/jobs/[jobRef]/page.tsx):

```typescript
import type { Metadata } from 'next';

// Static metadata (layout.tsx)
export async function generateMetadata(): Promise<Metadata> {
  const config = await getWebsiteConfigEntryForSite();

  return {
    title: config.seoTitle || config.companyName,
    description: config.seoDescription,
    keywords: config.seoKeywords,
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      images: [config.ogImage],
    },
  };
}

// Dynamic metadata (job detail page)
export async function generateMetadata({
  params
}: JobDetailPageProps): Promise<Metadata> {
  const { jobRef } = await params;
  const job = await getJobDetailsByReference(jobRef);

  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  return {
    title: `${job.job_title} - Job Listing`,
    description: job.job_description.substring(0, 160),
    openGraph: {
      title: job.job_title,
      description: job.job_description,
      type: 'website',
    },
  };
}
```

**What to learn:**
- ✅ `generateMetadata()` function
- ✅ Static vs dynamic metadata
- ✅ Open Graph tags
- ✅ Twitter cards
- ✅ Icons and manifests

---

### 3.4 Sitemap & Robots.txt

#### **Dynamic Sitemap** ([src/app/sitemap.ts](src/app/sitemap.ts))
```typescript
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL!;

  // Get all Builder.io pages
  const pages = await getAllSitePages();

  const pageUrls = pages.map((page) => ({
    url: `${baseUrl}${page.data.url}`,
    lastModified: new Date(page.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: page.data.url === '/' ? 1.0 : 0.8,
  }));

  // Get all job listings
  const jobs = await getJobList();

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/job-seeker/jobs/${job.job_reference}`,
    lastModified: new Date(job.posted_date),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...pageUrls, ...jobUrls];
}
```

#### **Robots.txt** ([src/app/robots.ts](src/app/robots.ts))
```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  };
}
```

**What to learn:**
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ SEO best practices

---

### 3.5 Builder.io CMS Integration

The codebase uses Builder.io as a headless CMS:

#### **Component Registration**
See [src/components/builder-registered-components/](src/components/builder-registered-components/):

```typescript
// hero-banner/content-model.ts
import { Builder } from '@builder.io/sdk';

export const registerHeroBanner = () =>
  Builder.registerComponent(HeroBanner, {
    name: 'Hero Banner',
    models: ['site-page'], // Which Builder models can use this

    inputs: [
      {
        name: 'displayInFullHeight',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Display banner at full screen height',
      },
      {
        name: 'description',
        type: 'longText',
        required: true,
      },
      {
        name: 'primaryButton',
        type: 'object',
        subFields: [
          { name: 'label', type: 'string', required: true },
          { name: 'url', type: 'string', required: true },
          { name: 'variant', type: 'string', enum: ['primary', 'secondary'] },
        ],
      },
      {
        name: 'backgroundImage',
        type: 'file',
        allowedFileTypes: ['jpeg', 'png', 'webp'],
      },
    ],

    // Image for Builder.io UI
    image: 'https://cdn.builder.io/api/v1/image/assets/...',
  });

// Register all components (builder-components.ts)
registerHeroBanner();
registerCtaBanner();
registerTestimonialCarousel();
// ... 20+ more
```

#### **Rendering Builder Content**
```typescript
// [[...page]]/page.tsx
import { Content } from '@builder.io/sdk-react';

const Page = async ({ params }: PageProps) => {
  const { page = [] } = await params;
  const content = await getPageModelEntryByUrl(page);

  return (
    <Content
      model="site-page"
      content={content}
      apiKey={process.env.BUILDER_IO_API_KEY}
    />
  );
};
```

**What to learn:**
- ✅ Headless CMS concept
- ✅ Builder.io SDK
- ✅ Component registration
- ✅ Visual editor integration
- ✅ Content modeling

---

### 3.6 Performance Optimization

#### **Code Splitting with Dynamic Imports**
See [src/components/builder-registered-components/builder-components.ts](src/components/builder-registered-components/builder-components.ts):

```typescript
import { Builder } from '@builder.io/sdk';
import dynamic from 'next/dynamic';

// Lazy load components (only load when needed)
const HeroBanner = dynamic(() =>
  import('./hero-banner').then(mod => mod.HeroBanner)
);

const TestimonialCarousel = dynamic(() =>
  import('./testimonial-carousel').then(mod => mod.TestimonialCarousel)
);

// Register lazily-loaded components
Builder.registerComponent(HeroBanner, {
  name: 'Hero Banner',
  // ...config
});
```

#### **Memoization for Expensive Calculations**
```typescript
const SearchFilterProvider = ({ jobsData }) => {
  // Only recalculate when dependencies change
  const filteredJobs = useMemo(() => {
    return jobsData
      .filter(job => job.location === selectedLocation)
      .sort((a, b) => a.job_title.localeCompare(b.job_title));
  }, [jobsData, selectedLocation]);

  return <JobList jobs={filteredJobs} />;
};
```

#### **Image Optimization**
```typescript
import Image from 'next/image';

// Automatic optimization, lazy loading, responsive images
<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  width={1920}
  height={1080}
  priority // Load immediately (above fold)
/>

<Image
  src={job.company_logo}
  alt={job.company_name}
  width={200}
  height={100}
  loading="lazy" // Lazy load (below fold)
/>
```

**What to learn:**
- ✅ Code splitting with `dynamic()`
- ✅ Memoization (`useMemo`, `useCallback`)
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Bundle analysis

---

### 3.7 Advanced Form Patterns

#### **File Upload with Validation**
See [src/components/forms/job-seeker-form/index.tsx](src/components/forms/job-seeker-form/index.tsx):

```typescript
import { isPDF_DOC_DOCX } from '@/utils/file';

// Custom file input field component
const FormUploadField = ({ field, label }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Client-side validation
      if (file.size > 3 * 1024 * 1024) {
        alert('File too large (max 3MB)');
        return;
      }

      // Check file type via magic bytes
      const reader = new FileReader();
      reader.onload = async (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        const isValid = isPDF_DOC_DOCX(new Uint8Array(buffer));

        if (!isValid) {
          alert('Invalid file type. Please upload PDF, DOC, or DOCX.');
          return;
        }

        field.handleChange(file);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      {field.state.meta.errors && (
        <span>{field.state.meta.errors[0]}</span>
      )}
    </div>
  );
};

// Magic byte validation (utils/file.ts)
export function isPDF_DOC_DOCX(buffer: Uint8Array): boolean {
  // PDF: %PDF (0x25 0x50 0x44 0x46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 &&
      buffer[2] === 0x44 && buffer[3] === 0x46) {
    return true;
  }

  // DOCX: ZIP (0x50 0x4B 0x03 0x04)
  if (buffer[0] === 0x50 && buffer[1] === 0x4B &&
      buffer[2] === 0x03 && buffer[3] === 0x04) {
    return true;
  }

  // DOC: OLE (0xD0 0xCF 0x11 0xE0)
  if (buffer[0] === 0xD0 && buffer[1] === 0xCF &&
      buffer[2] === 0x11 && buffer[3] === 0xE0) {
    return true;
  }

  return false;
}
```

#### **Conditional Field Validation**
```typescript
// Schema with conditional validation
const jobseekerFormSchema = z.object({
  position: z.string().min(1),
  otherPosition: z.string().optional(),
}).refine(
  (data) => {
    // If position is 'other', otherPosition must be filled
    if (data.position === 'other') {
      return !!data.otherPosition?.trim();
    }
    return true;
  },
  {
    message: 'Please specify your position',
    path: ['otherPosition'],
  }
);
```

**What to learn:**
- ✅ File upload handling
- ✅ File type validation (magic bytes)
- ✅ Conditional validation
- ✅ Multi-step forms
- ✅ FormData API

---

### 3.8 Advanced Filtering & Search

See [src/provider/search-filter-provider.tsx](src/provider/search-filter-provider.tsx):

```typescript
// Multi-criteria cascading filter
const filteredJobs = useMemo(() => {
  let results = jobsData;

  // 1. Text search filter
  if (searchTerm) {
    results = results.filter(job =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 2. Location filter (OR logic within category)
  if (selectedAttributes.location.length > 0) {
    results = results.filter(job =>
      selectedAttributes.location.includes(job.location)
    );
  }

  // 3. Job type filter
  if (selectedAttributes.job_type.length > 0) {
    results = results.filter(job =>
      selectedAttributes.job_type.includes(job.job_type)
    );
  }

  // 4. Industry filter
  if (selectedAttributes.industry.length > 0) {
    results = results.filter(job =>
      selectedAttributes.industry.includes(job.industry)
    );
  }

  // 5. Sort results
  const sortField = sortOrder.field; // 'job_title' | 'posted_date'
  const sortDirection = sortOrder.direction; // 'asc' | 'desc'

  results.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return results;
}, [jobsData, searchTerm, selectedAttributes, sortOrder]);

// Extract unique attribute values for filters
export const extractJobAttributes = (jobs: JobType[]): JobAttributesListType => {
  const attributes = {
    location: new Set<string>(),
    job_type: new Set<string>(),
    industry: new Set<string>(),
  };

  jobs.forEach(job => {
    if (job.location) attributes.location.add(job.location);
    if (job.job_type) attributes.job_type.add(job.job_type);
    if (job.industry) attributes.industry.add(job.industry);
  });

  return {
    location: Array.from(attributes.location).sort(),
    job_type: Array.from(attributes.job_type).sort(),
    industry: Array.from(attributes.industry).sort(),
  };
};
```

**What to learn:**
- ✅ Multi-criteria filtering
- ✅ Set data structure for unique values
- ✅ Sorting algorithms
- ✅ Filter state management
- ✅ Performance with large datasets

---

## 4. Professional Development Practices

### 4.1 TypeScript Configuration

See [tsconfig.json](apps/lead-gen-site/tsconfig.json):

```json
{
  "extends": "@ag-packages/typescript-config/nextjs.json",
  "compilerOptions": {
    "strict": true,              // Enable all strict checks
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,

    // Path aliases
    "paths": {
      "@/*": ["./src/*"],
      "@ag-packages/*": ["../../packages/*"]
    },

    "plugins": [
      { "name": "next" }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Key settings explained:**
- `strict: true` - Maximum type safety
- `paths` - Import aliases (`@/components` instead of `../../components`)
- `jsx: preserve` - Let Next.js handle JSX transformation

**What to learn:**
- ✅ TypeScript configuration
- ✅ Path aliases
- ✅ Strict mode options
- ✅ Compiler flags

---

### 4.2 ESLint Configuration

See [.eslintrc.js](apps/lead-gen-site/.eslintrc.js):

```javascript
module.exports = {
  extends: ['@ag-packages/eslint-config/next'],
  rules: {
    // Customize rules
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'react/no-unescaped-entities': 'off',
  },
};
```

**Common rules in professional projects:**
- No unused variables
- Consistent import order
- React hooks dependencies
- Accessibility rules

**What to learn:**
- ✅ ESLint setup
- ✅ Rule configuration
- ✅ Extending configs
- ✅ Prettier integration

---

### 4.3 Git Workflow & Pre-commit Hooks

See [.husky/pre-commit](apps/lead-gen-site/.husky/pre-commit):

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run linting
pnpm lint

# Run type checking
pnpm tsc --noEmit

# Run tests
pnpm test
```

**Professional Git practices:**
1. Feature branches: `feature/add-job-filter`
2. Commit messages: `feat: add job sorting dropdown`
3. Pull requests with reviews
4. CI/CD pipelines

**What to learn:**
- ✅ Git basics (commit, branch, merge)
- ✅ Conventional commits
- ✅ Pre-commit hooks (Husky)
- ✅ Code review process

---

### 4.4 Project Structure & Architecture

```
/apps/lead-gen-site/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── [[...page]]/          # CMS pages
│   │   ├── job-seeker/jobs/      # Job features
│   │   ├── actions/              # Server actions
│   │   ├── robots.ts             # SEO
│   │   └── sitemap.ts            # SEO
│   │
│   ├── components/               # React components
│   │   ├── builder-registered-components/  # CMS components
│   │   ├── forms/                # Form components
│   │   ├── search/               # Search features
│   │   ├── navigation/           # Nav components
│   │   └── ...
│   │
│   ├── provider/                 # Context providers
│   │   └── search-filter-provider.tsx
│   │
│   ├── utils/                    # Utility functions
│   │   ├── api/                  # API clients
│   │   │   ├── builder/          # Builder.io
│   │   │   └── idibu/            # Job API
│   │   ├── file.ts               # File utilities
│   │   ├── format.ts             # Formatting
│   │   └── navigation.ts         # Nav utilities
│   │
│   ├── types/                    # TypeScript types
│   │   ├── job.ts
│   │   ├── forms/
│   │   ├── builder.ts
│   │   └── ...
│   │
│   ├── constants/                # App constants
│   │   └── site.ts
│   │
│   └── svg/                      # SVG assets
│
├── public/                       # Static files
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── ...
│
├── tests/                        # Test files
│   └── unit/
│
├── .storybook/                   # Storybook config
├── scripts/                      # Build scripts
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── .env.sample                   # Environment template
```

**Organizational principles:**
- **Colocation:** Keep related files close (component + styles + tests)
- **Separation of concerns:** Components, utilities, types in separate folders
- **Feature-based:** Group by feature (job-seeker, navigation)
- **Reusability:** Shared components and utilities

**What to learn:**
- ✅ Folder structure best practices
- ✅ File naming conventions
- ✅ Import organization
- ✅ Code organization patterns

---

### 4.5 Testing (Jest)

See [tests/unit/file.spec.ts](apps/lead-gen-site/tests/unit/file.spec.ts):

```typescript
import { describe, it, expect } from '@jest/globals';
import { isPDF_DOC_DOCX } from '@/utils/file';

describe('File validation', () => {
  it('should validate PDF files', () => {
    const pdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
    expect(isPDF_DOC_DOCX(pdfBuffer)).toBe(true);
  });

  it('should reject invalid files', () => {
    const invalidBuffer = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    expect(isPDF_DOC_DOCX(invalidBuffer)).toBe(false);
  });
});

// Component testing example
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SearchInput', () => {
  it('should update search term on input', async () => {
    render(<SearchInput />);

    const input = screen.getByPlaceholderText('Search jobs...');
    await userEvent.type(input, 'developer');

    expect(input).toHaveValue('developer');
  });
});
```

**What to learn:**
- ✅ Jest basics
- ✅ React Testing Library
- ✅ Unit testing
- ✅ Integration testing
- ✅ Test-driven development (TDD)

---

### 4.6 Monorepo with Workspaces

The codebase is part of a monorepo (pnpm workspaces):

```
/
├── apps/
│   ├── lead-gen-site/          # This app
│   └── other-app/
│
├── packages/
│   ├── ui/                      # Shared UI components (@ag-packages/ui)
│   ├── styles/                  # Shared styles (@ag-packages/styles)
│   ├── typescript-config/       # Shared TS config
│   ├── eslint-config/           # Shared ESLint config
│   └── jest-config/             # Shared Jest config
│
├── pnpm-workspace.yaml
└── package.json
```

**Benefits:**
- Share code across apps
- Consistent tooling
- Single dependency tree
- Atomic commits

**What to learn:**
- ✅ Monorepo concept
- ✅ pnpm workspaces
- ✅ Shared packages
- ✅ Dependency management

---

## 5. Codebase Directory Structure Guide

### 5.1 `/src/app/` - Next.js App Router

**Purpose:** Defines routes, pages, and layouts.

**Key files:**
- [layout.tsx](src/app/layout.tsx) - Root layout (wraps all pages)
- [[[...page]]/page.tsx](src/app/[[...page]]/page.tsx) - Catch-all for CMS pages
- [job-seeker/jobs/page.tsx](src/app/job-seeker/jobs/page.tsx) - Job listing page
- [job-seeker/jobs/[jobRef]/page.tsx](src/app/job-seeker/jobs/[jobRef]/page.tsx) - Job detail page
- [actions/form.ts](src/app/actions/form.ts) - Server actions for forms
- [robots.ts](src/app/robots.ts) - robots.txt generation
- [sitemap.ts](src/app/sitemap.ts) - XML sitemap generation

**When to modify:**
- Adding new pages/routes
- Changing layout structure
- Updating metadata/SEO
- Creating server actions

---

### 5.2 `/src/components/` - React Components

**Purpose:** All React components.

**Subdirectories:**

#### **builder-registered-components/**
Components registered with Builder.io CMS (24 components):
- Visual editor components
- Hero banners, CTAs, testimonials
- Form blocks
- Grid containers, feature cards

**When to add:** Creating new CMS-editable components

---

#### **forms/**
Form components using TanStack React Form:
- [contact-us-form/](src/components/forms/contact-us-form/)
- [job-seeker-form/](src/components/forms/job-seeker-form/)
- [employer-form/](src/components/forms/employer-form/)
- Shared field components

**When to modify:** Adding/changing forms

---

#### **search/**
Job search functionality:
- [search-input.tsx](src/components/search/search-input.tsx) - Text search
- [search-sidebar-attributes-desktop.tsx](src/components/search/search-sidebar-attributes-desktop.tsx) - Filter sidebar
- [applied-attribute-filters.tsx](src/components/search/applied-attribute-filters.tsx) - Selected filters display
- [job-sort.tsx](src/components/search/job-sort.tsx) - Sort dropdown

**When to modify:** Changing search/filter behavior

---

#### **navigation/**
Site navigation:
- [header-navigation.tsx](src/components/navigation/header-navigation.tsx)
- [footer-navigation.tsx](src/components/navigation/footer-navigation.tsx)
- [mobile-menu.tsx](src/components/navigation/mobile-menu.tsx)

**When to modify:** Changing navigation structure

---

### 5.3 `/src/provider/` - React Context Providers

**Purpose:** Global state management.

**Key file:**
- [search-filter-provider.tsx](src/provider/search-filter-provider.tsx) - Job search state

**When to add:** Creating new global state (auth, theme, etc.)

---

### 5.4 `/src/utils/` - Utility Functions

**Purpose:** Reusable helper functions.

**Subdirectories:**

#### **api/**
API integration:
- [builder/queries.ts](src/utils/api/builder/queries.ts) - Builder.io API calls
- [idibu/job.ts](src/utils/api/idibu/job.ts) - Job API integration

**When to modify:** Adding new API endpoints

---

#### **Other utilities:**
- [file.ts](src/utils/file.ts) - File validation (magic bytes)
- [format.ts](src/utils/format.ts) - Date formatting
- [navigation.ts](src/utils/navigation.ts) - Navigation helpers
- [builder-props.ts](src/utils/builder-props.ts) - Rich text processing

**When to add:** Creating reusable functions

---

### 5.5 `/src/types/` - TypeScript Types

**Purpose:** Type definitions and interfaces.

**Key files:**
- [job.ts](src/types/job.ts) - Job data types
- [builder.ts](src/types/builder.ts) - Builder.io types
- [navigation.ts](src/types/navigation.ts) - Navigation types
- [forms/](src/types/forms/) - Form schemas (Zod)
- [api/builder/types.ts](src/types/api/builder/types.ts) - API response types

**When to add:** Creating new data structures

---

### 5.6 `/src/constants/` - Application Constants

**Purpose:** Static configuration values.

**Key file:**
- [site.ts](src/constants/site.ts) - Site-specific constants (page URLs, IDs)

**When to modify:** Adding new constants

---

### 5.7 `/public/` - Static Assets

**Purpose:** Images, fonts, icons served directly.

**Common files:**
- `favicon.ico`
- `apple-touch-icon.png`
- `site.webmanifest`
- Images, PDFs, etc.

**When to add:** Adding static files (not imported in components)

---

### 5.8 `/tests/` - Test Files

**Purpose:** Unit and integration tests.

**Structure:**
- `unit/` - Unit tests
- `integration/` - Integration tests
- Mirrors `src/` structure

**When to add:** Writing tests for components/utilities

---

### 5.9 Configuration Files (Root)

**Key files:**
- [next.config.ts](apps/lead-gen-site/next.config.ts) - Next.js configuration
- [tailwind.config.ts](apps/lead-gen-site/tailwind.config.ts) - Tailwind CSS config
- [tsconfig.json](apps/lead-gen-site/tsconfig.json) - TypeScript config
- [package.json](apps/lead-gen-site/package.json) - Dependencies & scripts
- [.eslintrc.js](apps/lead-gen-site/.eslintrc.js) - ESLint rules
- [env.schema.ts](apps/lead-gen-site/env.schema.ts) - Environment validation
- [.env.sample](apps/lead-gen-site/.env.sample) - Environment template

**When to modify:**
- Adding dependencies (package.json)
- Configuring build (next.config.ts)
- Updating TypeScript settings (tsconfig.json)
- Changing linting rules (.eslintrc.js)

---

## 6. Practical Examples from the Codebase

### 6.1 Building a Search Filter (Full Example)

Let's build the job search feature step-by-step:

#### **Step 1: Define Types** ([src/types/job.ts](src/types/job.ts))
```typescript
export interface JobType {
  job_reference: string;
  job_title: string;
  location: string;
  job_type: string;
  industry: string;
  posted_date: string;
  job_description: string;
}

export type JobAttributesListType = {
  location: string[];
  job_type: string[];
  industry: string[];
};

export type JobSortOrder = {
  field: 'job_title' | 'posted_date';
  direction: 'asc' | 'desc';
};
```

---

#### **Step 2: Create Context Provider** ([src/provider/search-filter-provider.tsx](src/provider/search-filter-provider.tsx))
```typescript
'use client';

import { createContext, useContext, useState, useMemo } from 'react';

type SearchFilterContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAttributes: {
    location: string[];
    job_type: string[];
    industry: string[];
  };
  setSelectedAttributes: (attrs: any) => void;
  filteredJobs: JobType[];
  sortOrder: JobSortOrder;
  setSortOrder: (order: JobSortOrder) => void;
};

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(
  undefined
);

export const SearchFilterProvider: React.FC<{
  children: React.ReactNode;
  jobsData: JobType[];
  attributesList: JobAttributesListType;
}> = ({ children, jobsData, attributesList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({
    location: [],
    job_type: [],
    industry: [],
  });
  const [sortOrder, setSortOrder] = useState<JobSortOrder>({
    field: 'posted_date',
    direction: 'desc',
  });

  // Memoized filtering
  const filteredJobs = useMemo(() => {
    let results = jobsData;

    // Text search
    if (searchTerm) {
      results = results.filter(job =>
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Attribute filters
    if (selectedAttributes.location.length > 0) {
      results = results.filter(job =>
        selectedAttributes.location.includes(job.location)
      );
    }

    if (selectedAttributes.job_type.length > 0) {
      results = results.filter(job =>
        selectedAttributes.job_type.includes(job.job_type)
      );
    }

    if (selectedAttributes.industry.length > 0) {
      results = results.filter(job =>
        selectedAttributes.industry.includes(job.industry)
      );
    }

    // Sort
    results.sort((a, b) => {
      const aVal = a[sortOrder.field];
      const bVal = b[sortOrder.field];

      if (sortOrder.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return results;
  }, [jobsData, searchTerm, selectedAttributes, sortOrder]);

  const value = {
    searchTerm,
    setSearchTerm,
    selectedAttributes,
    setSelectedAttributes,
    filteredJobs,
    sortOrder,
    setSortOrder,
  };

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error('useSearchFilter must be used within SearchFilterProvider');
  }
  return context;
};
```

---

#### **Step 3: Create Search Input Component** ([src/components/search/search-input.tsx](src/components/search/search-input.tsx))
```typescript
'use client';

import { useSearchFilter } from '@/provider/search-filter-provider';

export const SearchInput = () => {
  const { searchTerm, setSearchTerm } = useSearchFilter();

  return (
    <div className="search-input">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search job titles..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
```

---

#### **Step 4: Create Filter Sidebar** ([src/components/search/search-sidebar-attributes-desktop.tsx](src/components/search/search-sidebar-attributes-desktop.tsx))
```typescript
'use client';

import { useSearchFilter } from '@/provider/search-filter-provider';

export const SearchSideBarAttributesDesktop: React.FC<{
  attributesList: JobAttributesListType;
}> = ({ attributesList }) => {
  const { selectedAttributes, setSelectedAttributes } = useSearchFilter();

  const handleAttributeChange = (
    category: keyof JobAttributesListType,
    value: string
  ) => {
    setSelectedAttributes(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      return { ...prev, [category]: updated };
    });
  };

  return (
    <aside className="w-64 p-4 bg-gray-50">
      {/* Location filters */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Location</h3>
        {attributesList.location.map(loc => (
          <label key={loc} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.location.includes(loc)}
              onChange={() => handleAttributeChange('location', loc)}
              className="mr-2"
            />
            {loc}
          </label>
        ))}
      </div>

      {/* Job Type filters */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Job Type</h3>
        {attributesList.job_type.map(type => (
          <label key={type} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.job_type.includes(type)}
              onChange={() => handleAttributeChange('job_type', type)}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>

      {/* Industry filters */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Industry</h3>
        {attributesList.industry.map(ind => (
          <label key={ind} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.industry.includes(ind)}
              onChange={() => handleAttributeChange('industry', ind)}
              className="mr-2"
            />
            {ind}
          </label>
        ))}
      </div>
    </aside>
  );
};
```

---

#### **Step 5: Create Job List Component**
```typescript
'use client';

import { useSearchFilter } from '@/provider/search-filter-provider';

export const JobList = () => {
  const { filteredJobs } = useSearchFilter();

  if (filteredJobs.length === 0) {
    return <p className="text-center text-gray-500">No jobs found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredJobs.map(job => (
        <div key={job.job_reference} className="border rounded-lg p-4 hover:shadow-lg">
          <h3 className="font-bold text-lg">{job.job_title}</h3>
          <p className="text-gray-600">{job.location}</p>
          <p className="text-sm text-gray-500">{job.job_type}</p>
          <a
            href={`/job-seeker/jobs/${job.job_reference}`}
            className="text-blue-600 hover:underline mt-2 block"
          >
            View Details →
          </a>
        </div>
      ))}
    </div>
  );
};
```

---

#### **Step 6: Integrate in Page** ([src/app/job-seeker/jobs/page.tsx](src/app/job-seeker/jobs/page.tsx))
```typescript
import { getJobList, extractJobAttributes } from '@/utils/api/idibu/job';
import { SearchFilterProvider } from '@/provider/search-filter-provider';
import { SearchInput } from '@/components/search/search-input';
import { SearchSideBarAttributesDesktop } from '@/components/search/search-sidebar-attributes-desktop';
import { JobList } from '@/components/job-list';

const JobsPage = async () => {
  // Fetch data on server
  const jobs = await getJobList();
  const attributes = extractJobAttributes(jobs);

  return (
    <SearchFilterProvider jobsData={jobs} attributesList={attributes}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Job Listings</h1>

        <div className="mb-4">
          <SearchInput />
        </div>

        <div className="flex gap-8">
          <SearchSideBarAttributesDesktop attributesList={attributes} />
          <div className="flex-1">
            <JobList />
          </div>
        </div>
      </div>
    </SearchFilterProvider>
  );
};

export default JobsPage;
```

---

### 6.2 Building a Form with Validation (Full Example)

Let's build the Contact Us form:

#### **Step 1: Define Schema** ([src/types/forms/contact-us.ts](src/types/forms/contact-us.ts))
```typescript
import { z } from 'zod';

export const contactUsFormSchema = z.object({
  firstName: z.string().regex(/^[a-zA-Z ]*$/, 'Letters only').min(1, 'Required'),
  lastName: z.string().regex(/^[a-zA-Z ]*$/, 'Letters only').min(1, 'Required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string()
    .min(1, 'Required')
    .refine(val => val.replace(/\D/g, '').length >= 10, '10+ digits required'),
  country: z.string().min(1, 'Please select a country'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactUsFormType = z.infer<typeof contactUsFormSchema>;
```

---

#### **Step 2: Create Server Action** ([src/app/actions/form.ts](src/app/actions/form.ts))
```typescript
'use server';

import nodemailer from 'nodemailer';
import { contactUsFormSchema, ContactUsFormType } from '@/types/forms/contact-us';

export async function submitContactUsFormAction(
  value: ContactUsFormType
): Promise<{ success: boolean; error?: string }> {
  // Server-side validation
  const result = contactUsFormSchema.safeParse(value);

  if (!result.success) {
    return { success: false, error: 'Invalid form data' };
  }

  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'contact@example.com',
      subject: 'New Contact Form Submission',
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${result.data.firstName} ${result.data.lastName}</p>
        <p><strong>Email:</strong> ${result.data.email}</p>
        <p><strong>Phone:</strong> ${result.data.mobileNumber}</p>
        <p><strong>Country:</strong> ${result.data.country}</p>
        <p><strong>Message:</strong></p>
        <p>${result.data.message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: 'Failed to send message' };
  }
}
```

---

#### **Step 3: Create Form Component** ([src/components/forms/contact-us-form/index.tsx](src/components/forms/contact-us-form/index.tsx))
```typescript
'use client';

import { useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { contactUsFormSchema } from '@/types/forms/contact-us';
import { submitContactUsFormAction } from '@/app/actions/form';

const onChange = zodValidator({ schema: contactUsFormSchema });
const onSubmit = zodValidator({ schema: contactUsFormSchema, async: true });

export const ContactUsForm = () => {
  const [submissionResult, setSubmissionResult] = useState<'success' | 'fail' | null>(null);

  const form = useForm({
    validators: { onChange, onSubmit },
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      country: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      const result = await submitContactUsFormAction(value);

      if (result.success) {
        setSubmissionResult('success');
        form.reset();
      } else {
        setSubmissionResult('fail');
      }
    },
  });

  const isValid = useStore(form.store, (state) => state.isValid);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Contact Us</h2>

      {submissionResult === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Message sent successfully!
        </div>
      )}

      {submissionResult === 'fail' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to send message. Please try again.
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* First Name */}
        <form.Field name="firstName">
          {(field) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <span className="text-red-600 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Last Name */}
        <form.Field name="lastName">
          {(field) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <span className="text-red-600 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <span className="text-red-600 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Mobile Number */}
        <form.Field name="mobileNumber">
          {(field) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <span className="text-red-600 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Country */}
        <form.Field name="country">
          {(field) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Country *
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a country</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
              {field.state.meta.errors && (
                <span className="text-red-600 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Message */}
        <form.Field name="message">
          {(field) => (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Message *
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <span className="text-red-600 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};
```

---

## 7. Learning Path & Next Steps

### Beginner (Weeks 1-4)
1. **JavaScript fundamentals** (1 week)
   - Variables, functions, arrays, objects
   - Array methods (.map, .filter, .find)
   - ES6+ features (arrow functions, destructuring, spread)

2. **TypeScript basics** (1 week)
   - Type annotations
   - Interfaces vs types
   - Basic generics

3. **React fundamentals** (2 weeks)
   - Components and JSX
   - Props and state (useState)
   - Event handling
   - List rendering
   - useEffect hook

### Intermediate (Weeks 5-10)
4. **Next.js App Router** (2 weeks)
   - File-based routing
   - Server vs Client Components
   - Data fetching
   - Layouts and metadata

5. **Tailwind CSS** (1 week)
   - Utility classes
   - Responsive design
   - Custom configuration

6. **Advanced React** (2 weeks)
   - Context API
   - Custom hooks
   - useMemo & useCallback
   - Form handling

7. **API Integration** (1 week)
   - Fetch API
   - Server Actions
   - Error handling

### Advanced (Weeks 11-16)
8. **Advanced TypeScript** (1 week)
   - Utility types
   - Type guards
   - Advanced generics

9. **Performance Optimization** (1 week)
   - Code splitting
   - Memoization
   - Image optimization

10. **Testing** (2 weeks)
    - Jest basics
    - React Testing Library
    - Integration tests

11. **Professional Practices** (2 weeks)
    - Git workflow
    - ESLint/Prettier
    - Project structure
    - Documentation

### Practice Projects
1. **Simple job board** (Use this codebase as reference)
2. **Blog with CMS** (Practice Builder.io integration)
3. **E-commerce product listing** (Practice filtering/search)
4. **Multi-step form** (Practice form validation)

---

## 8. Recommended Resources

### Official Documentation
- [React Docs](https://react.dev) - New official React documentation
- [Next.js Docs](https://nextjs.org/docs) - Official Next.js documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Official TypeScript guide
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Tailwind utility reference

### Video Courses
- **freeCodeCamp** - Free React & Next.js courses on YouTube
- **Net Ninja** - React, Next.js, TypeScript playlists
- **Traversy Media** - Practical project tutorials
- **Web Dev Simplified** - Concept explanations

### Interactive Learning
- **TypeScript Playground** - Practice TypeScript online
- **CodeSandbox** - Build React projects in browser
- **Frontend Mentor** - Practice projects with designs

### Books
- **"Learning React" by Alex Banks & Eve Porcello** - React fundamentals
- **"TypeScript Handbook"** (free online) - TypeScript guide
- **"You Don't Know JS"** (free online) - JavaScript deep dive

### Community
- **React Discord** - Ask questions, get help
- **Next.js Discord** - Next.js specific help
- **Stack Overflow** - Search for solutions

---

## Conclusion

This codebase demonstrates professional Next.js/React/TypeScript development with:
- ✅ Server-first architecture (Next.js 15 App Router)
- ✅ Type-safe development (TypeScript strict mode + Zod)
- ✅ Modern form handling (TanStack React Form)
- ✅ Headless CMS integration (Builder.io)
- ✅ Performance optimization (memoization, code splitting)
- ✅ Professional tooling (ESLint, Prettier, Husky)
- ✅ Monorepo architecture (shared packages)

**Start with the fundamentals, practice building small features, and gradually work your way to advanced patterns. Study this codebase as a reference for professional React/Next.js development!**

Good luck on your learning journey! 🚀
