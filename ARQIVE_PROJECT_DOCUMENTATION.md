# Arqive - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Project Structure](#project-structure)
4. [Features & Functionality](#features--functionality)
5. [Authentication System](#authentication-system)
6. [File Management System](#file-management-system)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [UI Components](#ui-components)
10. [State Management](#state-management)
11. [Security Implementation](#security-implementation)
12. [Performance Optimizations](#performance-optimizations)
13. [Deployment Guide](#deployment-guide)
14. [Environment Variables](#environment-variables)
15. [Development Workflow](#development-workflow)
16. [Troubleshooting](#troubleshooting)
17. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Arqive** is a modern, secure file storage and management platform built with Next.js 15, TypeScript, and Appwrite. It provides enterprise-grade security for storing, organizing, and accessing files from anywhere with a beautiful, responsive user interface.

### Key Highlights
- **Tagline**: "Your digital world, safely Arqived"
- **Purpose**: Secure file storage with advanced organization and sharing capabilities
- **Target Users**: Individuals and teams needing reliable cloud storage
- **Storage Limit**: 20GB per user
- **File Size Limit**: 50MB per file

---

## Architecture & Tech Stack

### Frontend Technologies
```typescript
// Core Framework
- Next.js 15 (App Router)
- React 19
- TypeScript 5

// Styling & UI
- Tailwind CSS v4
- Radix UI Components
- Custom CSS Variables
- Responsive Design

// Fonts
- Space Grotesk (Primary - Modern, geometric)
- Inter (Secondary - Clean, readable)
- JetBrains Mono (Monospace - Code/technical)
```

### Backend Technologies
```typescript
// Backend-as-a-Service
- Appwrite (Authentication, Database, Storage)
- Node.js Server Actions
- API Routes (Next.js)

// Database
- Appwrite Database (NoSQL)
- Real-time subscriptions
- Query optimization
```

### Development Tools
```typescript
// Build & Development
- Turbopack (Fast development builds)
- ESLint (Code linting)
- PostCSS (CSS processing)

// Package Management
- npm (Package manager)
- Node.js 18+
```

---

## Project Structure

```
arqive/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages group
│   │   ├── sign-in/             # Sign in page
│   │   ├── sign-up/             # Sign up page
│   │   └── layout.tsx           # Auth layout wrapper
│   ├── (root)/                   # Main application group
│   │   ├── [type]/              # Dynamic file type pages
│   │   ├── layout.tsx           # Main app layout
│   │   └── page.tsx             # Dashboard homepage
│   ├── api/                     # API routes
│   │   └── store-metadata/      # File metadata storage
│   ├── context/                 # React contexts
│   │   ├── FileContext.tsx     # File state management
│   │   └── UserContext.tsx     # User state management
│   ├── globals.css              # Global styles & CSS variables
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── skeletons/               # Loading skeleton components
│   ├── ActionDropdown.tsx       # File actions menu
│   ├── AuthForm.tsx             # Authentication form
│   ├── Card.tsx                 # File card component
│   ├── Chart.tsx                # Storage usage chart
│   ├── FileUploader.tsx         # File upload component
│   ├── Header.tsx               # Application header
│   ├── Search.tsx               # Global search functionality
│   ├── Sidebar.tsx              # Navigation sidebar
│   └── ...                      # Other components
├── lib/                         # Utility libraries
│   ├── actions/                 # Server actions
│   │   ├── files.action.ts     # File operations
│   │   └── user.action.ts      # User operations
│   ├── appwrite/               # Appwrite configuration
│   │   ├── config.ts           # Environment config
│   │   └── account.ts          # Client setup
│   └── utils.ts                # Utility functions
├── types/                       # TypeScript definitions
│   └── index.d.ts              # Global type definitions
├── constants/                   # Application constants
│   └── index.ts                # Navigation, actions, etc.
└── public/                      # Static assets
    └── assets/                 # Icons, images, logos
```

---

## Features & Functionality

### 1. Authentication System
```typescript
// Dual Authentication Methods
- Email/Password authentication
- OTP (One-Time Password) via email
- Secure session management with HTTP-only cookies
- Email verification system
- User registration with avatar selection
```

### 2. File Management
```typescript
// File Operations
- Upload: Drag & drop, multiple files, progress tracking
- Download: Direct download links
- Rename: In-place file renaming
- Delete: Secure file deletion
- Share: Email-based file sharing
- Preview: Thumbnail generation

// File Types Supported
- Documents: PDF, DOC, DOCX, TXT, etc.
- Images: JPG, PNG, GIF, SVG, etc.
- Videos: MP4, MOV, AVI, etc.
- Audio: MP3, WAV, OGG, etc.
- Others: ZIP, RAR, etc.
```

### 3. Storage Management
```typescript
// Storage Features
- 20GB total storage per user
- Real-time usage tracking
- Visual storage analytics
- File categorization
- Storage quota enforcement
```

### 4. User Interface
```typescript
// UI Features
- Responsive design (mobile, tablet, desktop)
- Dark/Light mode support (planned)
- Smooth animations and micro-interactions
- Apple-level design aesthetics
- Real-time updates
- Loading states and skeletons
```

---

## Authentication System

### Authentication Flow

#### 1. Sign Up Process
```typescript
// components/AuthForm.tsx
const signUpFlow = {
  1: "User enters email, fullname, password",
  2: "Avatar selection from predefined options",
  3: "Account creation in Appwrite",
  4: "User document creation in database",
  5: "OTP sent to email for verification",
  6: "OTP verification and session creation"
}
```

#### 2. Sign In Process
```typescript
// Two methods available
const signInMethods = {
  password: {
    flow: "Email + Password → Session Creation",
    implementation: "signInWithPassword()"
  },
  otp: {
    flow: "Email → OTP Generation → OTP Verification → Session",
    implementation: "SignIn() + verifysecret()"
  }
}
```

#### 3. Session Management
```typescript
// lib/actions/user.action.ts
const sessionManagement = {
  creation: "HTTP-only cookies with secure flags",
  validation: "Server-side session verification",
  expiration: "Automatic session cleanup",
  security: "CSRF protection, secure transmission"
}
```

### Authentication Components

#### AuthForm Component
```typescript
// Handles both sign-in and sign-up
interface AuthFormProps {
  type: "sign-in" | "sign-up"
}

// Features:
- Form validation with Zod
- Real-time error handling
- Loading states
- Method switching (password/OTP)
- Avatar selection for sign-up
```

#### OTPModal Component
```typescript
// Email verification modal
interface OTPModalProps {
  email: string
  accountId: string
}

// Features:
- 6-digit OTP input
- Resend functionality
- Auto-focus and validation
- Error handling
- Success animations
```

---

## File Management System

### File Upload Process

#### 1. Client-Side Upload
```typescript
// components/FileUploader.tsx
const uploadProcess = {
  1: "File selection via drag-drop or click",
  2: "Client-side validation (size, type)",
  3: "Direct upload to Appwrite Storage",
  4: "Metadata extraction and processing",
  5: "Database document creation",
  6: "UI updates and notifications"
}
```

#### 2. File Validation
```typescript
// Validation rules
const fileValidation = {
  maxSize: "50MB per file",
  totalStorage: "20GB per user",
  allowedTypes: "All common file formats",
  securityChecks: "File type verification"
}
```

#### 3. Storage Architecture
```typescript
// Appwrite Storage Structure
const storageStructure = {
  bucket: "Single bucket for all files",
  fileNaming: "UUID-based unique identifiers",
  metadata: "Stored in database documents",
  urls: "Generated view and download URLs"
}
```

### File Operations

#### File Actions Dropdown
```typescript
// components/ActionDropdown.tsx
const fileActions = {
  rename: "In-place file renaming",
  details: "File information display",
  share: "Email-based sharing",
  download: "Direct download link",
  delete: "Secure file removal"
}
```

#### File Sharing System
```typescript
// Sharing implementation
const sharingSystem = {
  method: "Email-based access control",
  storage: "User emails in file document",
  permissions: "Read-only access for shared users",
  management: "Add/remove users dynamically"
}
```

---

## Database Schema

### Collections Structure

#### 1. Users Collection
```typescript
interface UserDocument {
  $id: string              // Auto-generated document ID
  accountId: string        // Appwrite account ID
  email: string           // User email (unique)
  fullname: string        // User's full name
  avatar: string          // Avatar image URL
  $createdAt: string      // Creation timestamp
  $updatedAt: string      // Last update timestamp
}
```

#### 2. Files Collection
```typescript
interface FileDocument {
  $id: string              // Auto-generated document ID
  type: FileType          // File category (document, image, etc.)
  name: string            // Original filename
  url: string             // Appwrite storage URL
  extension: string       // File extension
  size: number            // File size in bytes
  owner: string           // Owner user ID
  accountId: string       // Owner account ID
  users: string[]         // Shared user emails
  bucketFileId: string    // Appwrite storage file ID
  $createdAt: string      // Creation timestamp
  $updatedAt: string      // Last update timestamp
}
```

### Database Queries

#### File Retrieval
```typescript
// lib/actions/files.action.ts
const fileQueries = {
  ownership: "Query.equal('owner', [currentUser.$id])",
  sharing: "Query.contains('users', [currentUser.email])",
  filtering: "Query.equal('type', types)",
  searching: "Query.contains('name', searchText)",
  sorting: "Query.orderAsc/Desc(field)",
  pagination: "Query.limit(count)"
}
```

#### Storage Analytics
```typescript
// Storage usage calculation
const storageAnalytics = {
  totalUsage: "Sum of all file sizes by user",
  categoryBreakdown: "Usage by file type",
  recentActivity: "Latest file modifications",
  quotaTracking: "Remaining storage calculation"
}
```

---

## API Routes

### File Metadata Storage
```typescript
// app/api/store-metadata/route.ts
export async function POST(req: Request) {
  // Handles file metadata storage after upload
  const operations = {
    validation: "Required fields checking",
    quotaCheck: "Storage limit verification",
    documentCreation: "Database document creation",
    errorHandling: "Cleanup on failure",
    pathRevalidation: "Next.js cache invalidation"
  }
}
```

### Server Actions

#### User Actions
```typescript
// lib/actions/user.action.ts
const userActions = {
  CreateAccount: "User registration",
  SignIn: "OTP-based sign in",
  signInWithPassword: "Password-based sign in",
  verifysecret: "OTP verification",
  getCurrentUser: "Session validation",
  LogOut: "Session termination",
  sendEmailOTP: "OTP generation"
}
```

#### File Actions
```typescript
// lib/actions/files.action.ts
const fileActions = {
  uploadFiles: "File upload processing",
  getFiles: "File retrieval with filters",
  getTotalSpaceUsed: "Storage analytics",
  renameFile: "File renaming",
  deleteFile: "File deletion",
  updateFileUsers: "Sharing management"
}
```

---

## UI Components

### Component Architecture

#### 1. Layout Components
```typescript
// Structural components
const layoutComponents = {
  "app/layout.tsx": "Root layout with fonts",
  "app/(root)/layout.tsx": "Main app layout",
  "app/(auth)/layout.tsx": "Authentication layout",
  "components/Sidebar.tsx": "Navigation sidebar",
  "components/Header.tsx": "Top navigation bar",
  "components/MobileNavigation.tsx": "Mobile menu"
}
```

#### 2. Feature Components
```typescript
// Core functionality components
const featureComponents = {
  "components/FileUploader.tsx": "File upload interface",
  "components/Search.tsx": "Global search functionality",
  "components/Card.tsx": "File display cards",
  "components/Chart.tsx": "Storage usage visualization",
  "components/ActionDropdown.tsx": "File actions menu"
}
```

#### 3. UI Components (Shadcn/ui)
```typescript
// Reusable UI primitives
const uiComponents = {
  "components/ui/button.tsx": "Button component",
  "components/ui/input.tsx": "Input field",
  "components/ui/dialog.tsx": "Modal dialogs",
  "components/ui/dropdown-menu.tsx": "Dropdown menus",
  "components/ui/form.tsx": "Form components",
  // ... and more
}
```

### Styling System

#### CSS Architecture
```css
/* app/globals.css */
:root {
  /* Color System */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more color variables */
  
  /* Font System */
  --font-space-grotesk: "Space Grotesk", system-ui, sans-serif;
  --font-inter: "Inter", system-ui, sans-serif;
  --font-jetbrains-mono: "JetBrains Mono", monospace;
}
```

#### Utility Classes
```css
/* Custom utility classes */
.flex-center { @apply flex items-center justify-center; }
.h1 { @apply text-[34px] leading-[42px] font-bold font-primary; }
.sidebar { @apply hidden h-screen w-[90px] flex-col; }
/* ... more utilities */
```

---

## State Management

### Context Providers

#### 1. User Context
```typescript
// app/context/UserContext.tsx
const UserContext = createContext<Models.Document | null>(null);

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children, value }) => (
  <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>
);
```

#### 2. File Context
```typescript
// app/context/FileContext.tsx
interface FileContextType {
  files: Models.Document[];
  refreshFiles: () => Promise<void>;
  setFiles: React.Dispatch<React.SetStateAction<Models.Document[]>>;
}
```

### State Management Patterns

#### Server State
```typescript
// Server actions handle server state
const serverState = {
  fetching: "Server actions with caching",
  mutations: "Optimistic updates",
  revalidation: "Next.js path revalidation",
  errorHandling: "Try-catch with user feedback"
}
```

#### Client State
```typescript
// React hooks for client state
const clientState = {
  forms: "React Hook Form with Zod validation",
  ui: "useState for component state",
  modals: "Local state for dialog management",
  loading: "Loading states for async operations"
}
```

---

## Security Implementation

### Authentication Security
```typescript
const authSecurity = {
  sessions: "HTTP-only cookies with secure flags",
  passwords: "Appwrite built-in hashing",
  otp: "Time-limited email verification",
  csrf: "Built-in Next.js CSRF protection"
}
```

### File Security
```typescript
const fileSecurity = {
  upload: "File type validation and size limits",
  storage: "Appwrite secure cloud storage",
  access: "User-based access control",
  sharing: "Email-based permission system"
}
```

### Data Validation
```typescript
// Input validation with Zod
const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  filename: z.string().min(1).max(255)
});
```

---

## Performance Optimizations

### Frontend Optimizations
```typescript
const frontendOptimizations = {
  bundling: "Turbopack for fast development builds",
  codesplitting: "Next.js automatic code splitting",
  imageOptimization: "Next.js Image component",
  lazyLoading: "Dynamic imports for components",
  caching: "Next.js built-in caching strategies"
}
```

### Backend Optimizations
```typescript
const backendOptimizations = {
  queries: "Optimized Appwrite queries with indexes",
  caching: "Server-side caching with revalidation",
  streaming: "Streaming responses for large data",
  compression: "Automatic response compression"
}
```

### Loading States
```typescript
// Skeleton components for better UX
const loadingStates = {
  "components/skeletons/DashboardSkeleton.tsx": "Dashboard loading",
  "components/skeletons/FileListSkeleton.tsx": "File list loading",
  "components/skeletons/CardSkeleton.tsx": "File card loading"
}
```

---

## Deployment Guide

### Environment Setup
```bash
# Required environment variables
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE=your_database_id
NEXT_PUBLIC_APPWRITE_USERS=your_users_collection_id
NEXT_PUBLIC_APPWRITE_FILES=your_files_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET=your_bucket_id
NEXT_APPWRITE_SECRET=your_api_secret_key
```

### Appwrite Configuration

#### 1. Project Setup
```typescript
// Create Appwrite project
const appwriteSetup = {
  1: "Create new project in Appwrite Console",
  2: "Configure authentication methods",
  3: "Set up database and collections",
  4: "Create storage bucket",
  5: "Configure permissions and security rules"
}
```

#### 2. Database Collections
```typescript
// Users collection attributes
const usersCollection = {
  accountId: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  fullname: { type: "string", required: true },
  avatar: { type: "string", required: true }
}

// Files collection attributes
const filesCollection = {
  type: { type: "string", required: true },
  name: { type: "string", required: true },
  url: { type: "string", required: true },
  extension: { type: "string", required: true },
  size: { type: "integer", required: true },
  owner: { type: "string", required: true },
  accountId: { type: "string", required: true },
  users: { type: "array", required: true },
  bucketFileId: { type: "string", required: true }
}
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Deployment steps
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push
4. Custom domain setup (optional)
```

#### Other Platforms
```typescript
const deploymentOptions = {
  netlify: "Static site deployment with serverless functions",
  railway: "Full-stack deployment with database",
  digitalOcean: "App Platform deployment",
  aws: "Amplify hosting with CI/CD"
}
```

---

## Environment Variables

### Required Variables
```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE=your_database_id
NEXT_PUBLIC_APPWRITE_USERS=your_users_collection_id
NEXT_PUBLIC_APPWRITE_FILES=your_files_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET=your_bucket_id
NEXT_APPWRITE_SECRET=your_api_secret_key
NEXT_PUBLIC_APPWRITE_OTP=your_otp_collection_id
```

### Variable Descriptions
```typescript
const environmentVariables = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: "Appwrite server endpoint URL",
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: "Unique project identifier",
  NEXT_PUBLIC_APPWRITE_DATABASE: "Database ID for collections",
  NEXT_PUBLIC_APPWRITE_USERS: "Users collection ID",
  NEXT_PUBLIC_APPWRITE_FILES: "Files collection ID",
  NEXT_PUBLIC_APPWRITE_BUCKET: "Storage bucket ID",
  NEXT_APPWRITE_SECRET: "Server-side API key (keep secret)",
  NEXT_PUBLIC_APPWRITE_OTP: "OTP collection ID (if used)"
}
```

---

## Development Workflow

### Getting Started
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/arqive.git
cd arqive

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials

# 4. Run development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:3000
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Code Organization Best Practices
```typescript
const bestPractices = {
  components: "One component per file, clear naming",
  types: "Centralized type definitions",
  utils: "Reusable utility functions",
  constants: "Application-wide constants",
  actions: "Server actions grouped by feature",
  styling: "Consistent utility classes and variables"
}
```

---

## Troubleshooting

### Common Issues

#### 1. Authentication Issues
```typescript
const authTroubleshooting = {
  "Session not found": {
    cause: "Missing or expired session cookie",
    solution: "Check cookie settings and session expiration"
  },
  "OTP not received": {
    cause: "Email delivery issues or spam folder",
    solution: "Check email configuration and spam filters"
  },
  "Invalid credentials": {
    cause: "Wrong email/password combination",
    solution: "Verify user exists and password is correct"
  }
}
```

#### 2. File Upload Issues
```typescript
const uploadTroubleshooting = {
  "File too large": {
    cause: "File exceeds 50MB limit",
    solution: "Compress file or split into smaller parts"
  },
  "Storage quota exceeded": {
    cause: "User has reached 20GB limit",
    solution: "Delete old files or upgrade storage"
  },
  "Upload failed": {
    cause: "Network issues or server problems",
    solution: "Check connection and retry upload"
  }
}
```

#### 3. Performance Issues
```typescript
const performanceTroubleshooting = {
  "Slow loading": {
    cause: "Large file lists or poor network",
    solution: "Implement pagination and optimize queries"
  },
  "Memory issues": {
    cause: "Large file uploads or memory leaks",
    solution: "Optimize file handling and cleanup"
  }
}
```

### Debug Mode
```typescript
// Enable debug logging
const debugMode = {
  client: "console.log statements in development",
  server: "Server action error logging",
  network: "Browser dev tools network tab",
  appwrite: "Appwrite console logs and metrics"
}
```

---

## Future Enhancements

### Planned Features
```typescript
const plannedFeatures = {
  ui: {
    darkMode: "Complete dark theme implementation",
    mobileApp: "React Native mobile application",
    advancedSearch: "Full-text search with filters",
    filePreview: "In-browser file preview for more types"
  },
  
  functionality: {
    folderSystem: "Hierarchical folder organization",
    fileVersioning: "Version control for files",
    collaborativeEditing: "Real-time document collaboration",
    advancedSharing: "Link sharing with permissions"
  },
  
  integrations: {
    cloudSync: "Google Drive, Dropbox integration",
    socialAuth: "Google, GitHub, Apple sign-in",
    webhooks: "External service integrations",
    api: "Public API for third-party access"
  },
  
  enterprise: {
    teamManagement: "Organization and team features",
    adminDashboard: "Administrative controls",
    auditLogs: "Activity tracking and compliance",
    sso: "Single sign-on integration"
  }
}
```

### Technical Improvements
```typescript
const technicalImprovements = {
  performance: {
    caching: "Advanced caching strategies",
    cdn: "Content delivery network integration",
    optimization: "Bundle size optimization",
    monitoring: "Performance monitoring and analytics"
  },
  
  security: {
    encryption: "End-to-end encryption for files",
    compliance: "GDPR, HIPAA compliance features",
    audit: "Security audit logging",
    mfa: "Multi-factor authentication"
  },
  
  scalability: {
    microservices: "Service-oriented architecture",
    database: "Database sharding and optimization",
    storage: "Distributed storage system",
    monitoring: "Application monitoring and alerting"
  }
}
```

---

## Conclusion

Arqive represents a modern approach to file storage and management, combining security, usability, and performance. The project demonstrates best practices in:

- **Modern Web Development**: Next.js 15, React 19, TypeScript
- **User Experience**: Responsive design, smooth animations, intuitive interface
- **Security**: Secure authentication, file access control, data protection
- **Performance**: Optimized loading, efficient queries, smart caching
- **Scalability**: Modular architecture, clean code organization

The comprehensive documentation above covers every aspect of the project, from initial setup to advanced features, making it easy for developers to understand, contribute to, and extend the platform.

For questions or contributions, please refer to the project repository and follow the established development workflow.

---

**Arqive** - Your digital world, safely Arqived. 🔒