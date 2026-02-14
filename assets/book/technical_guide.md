# Prep Pilot - Technical Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Root Level Configuration](#root-level-configuration)
4. [App Layer (Next.js Pages & Routing)](#app-layer-nextjs-pages--routing)
5. [Backend Layer (Database & Business Logic)](#backend-layer-database--business-logic)
6. [Components Layer (UI Components)](#components-layer-ui-components)
7. [Utilities & Helpers](#utilities--helpers)
8. [Authentication & Security](#authentication--security)
9. [External Integrations](#external-integrations)

---

## 📖 Project Overview

**Prep Pilot** is an AI-powered interview preparation web application built with Next.js. It helps users practice with AI-generated interview questions, receive structured AI feedback, and track their progress over time.

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS, HeroUI
- **Backend**: Node.js API routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js 4 (credentials, GitHub, Google)
- **AI**: OpenAI API for question generation and feedback
- **Media**: Cloudinary for image uploads
- **Payments**: Stripe for subscription management
- **Email**: Nodemailer for transactional emails
- **Notifications**: React Hot Toast for user feedback

---

## 🏛️ Architecture

The project follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         Frontend Layer (UI)             │
│  Components, Pages, Client Components   │
├─────────────────────────────────────────┤
│      Actions & API Routes Layer         │
│  Server Actions, API Endpoints          │
├─────────────────────────────────────────┤
│      Backend/Business Logic Layer       │
│  Controllers, Models, Services          │
├─────────────────────────────────────────┤
│      Data Layer (Database)              │
│  MongoDB + Mongoose Schemas             │
└─────────────────────────────────────────┘
```

---

## ⚙️ Root Level Configuration

### `package.json`

**Purpose**: Node.js package manifest defining project metadata, dependencies, and scripts.

**Key Scripts**:

- `npm run dev` - Starts development server on port 3000
- `npm run build` - Builds production bundle
- `npm run start` - Runs production server
- `npm run lint` - Runs ESLint

**Core Dependencies**:

- `next` - React framework with file-based routing
- `react`, `react-dom` - UI library
- `@heroui/react` - Component library (buttons, cards, modals, tables, etc.)
- `mongoose` - MongoDB ODM
- `next-auth` - Authentication
- `openai` - AI API client
- `stripe` - Payment processing
- `nodemailer` - Email service
- `cloudinary` - Cloud storage for images

### `tsconfig.json`

**Purpose**: TypeScript configuration with path aliases for cleaner imports.

**Key Aliases**:

- `@/` - Root directory
- `@/components` - React components
- `@/actions` - Server actions
- `@/backend` - Backend logic
- `@/helpers` - Utility functions

### `next.config.ts`

**Purpose**: Next.js build and runtime configuration.

### `tailwind.config.ts` & `postcss.config.mjs`

**Purpose**: Tailwind CSS styling framework setup for utility-first CSS.

### `eslint.config.mjs`

**Purpose**: Code linting configuration using ESLint.

### `tsconfig.json`

**Purpose**: TypeScript compiler configuration with path aliases for imports.

### `hero.ts`

**Purpose**: HeroUI theme customization and configuration.

### `proxy.ts`

**Purpose**: Proxy configuration for development API calls.

---

## 🌐 App Layer (Next.js Pages & Routing)

### `app/layout.tsx`

**Purpose**: Root layout component wrapping all pages.

**Responsibilities**:

- Sets up HTML metadata (title, description)
- Imports Google fonts (Geist Sans, Geist Mono)
- Wraps content with providers (theme, auth, UI library)
- Initializes Toaster for toast notifications
- Creates page structure: Navbar → Main Content → Footer

**Key Elements**:

```tsx
- Toaster: Toast notification container
- Providers: Wraps children with HeroUI, NextThemes, SessionProvider
- Navbar: Navigation bar
- Main: Content area (flex-grow for sticky footer)
- Footer: Site footer
```

### `app/providers.tsx`

**Purpose**: Central provider configuration for client-side context and theming.

**Providers**:

1. **HeroUIProvider** - Component library styles and navigation integration
2. **NextThemeProvider** - Dark/light theme toggle support
3. **SessionProvider** - NextAuth session management

### `app/page.tsx`

**Purpose**: Home/landing page (root `/` route).

**Content**:

- Marketing hero section
- Landing page statistics charts
- Testimonials
- Pricing section
- Call-to-action buttons

### `app/globals.css`

**Purpose**: Global CSS styles applied to entire application.

**Contains**:

- Tailwind CSS directives
- Global font imports
- CSS variables for theming
- Utility classes

### `app/login/page.tsx`

**Purpose**: User login page route.

**Features**:

- Email/password login form
- OAuth options (GitHub, Google)
- Form validation
- Error toast notifications

### `app/register/page.tsx`

**Purpose**: User registration page route.

**Features**:

- Sign-up form with name, email, password
- Password validation
- Success redirect to login
- Error handling

### `app/subscribe/page.tsx`

**Purpose**: Subscription/payment page route.

**Features**:

- Stripe payment form
- Subscription plan display
- Session update after successful payment
- Error handling and user feedback

### `app/password/forgot/` & `app/password/reset/`

**Purpose**: Password recovery flow pages.

**Forgot Flow**:

- Email verification
- Reset token generation
- Email dispatch

**Reset Flow**:

- Token validation
- New password entry
- Database update

### `app/not-found.tsx`

**Purpose**: Custom 404 error page when routes don't exist.

**UI**:

- Large 404 heading
- Helpful message
- Link back to home

### `app/app/` Directory

**Purpose**: Protected app routes (user dashboard area).

**Structure**:

```
/app
  /app/layout.tsx       - App layout with sidebar + breadcrumbs
  /app/dashboard/       - User dashboard
  /app/interviews/      - Interview list and conduct
  /app/results/         - View interview results
  /app/invoices/        - Billing history
  /app/me/              - User profile management
```

### `app/app/layout.tsx`

**Purpose**: Layout for protected dashboard routes.

**Features**:

- Sidebar navigation (left)
- Breadcrumb trail (top)
- Page title from route
- Two-column layout

### `app/admin/` Directory

**Purpose**: Admin-only routes.

**Routes**:

- `/admin/dashboard` - Stats overview
- `/admin/users` - User management
- `/admin/interviews` - Interview management

### `app/api/` Directory

**Purpose**: API route handlers for backend endpoints.

**Structure**:

```
/api
  /auth/           - Authentication endpoints
  /interviews/     - Interview CRUD operations
  /invoices/       - Invoice management
  /payment/        - Stripe webhooks
  /dashboard/      - Statistics endpoints
```

### `app/admin/error.tsx` & `app/app/error.tsx`

**Purpose**: Error boundary components for handling unexpected errors.

**Shows**:

- Large error heading
- Error message
- Go back button
- Reset function to retry

### `app/admin/loading.tsx` & `app/app/loading.tsx`

**Purpose**: Loading skeleton shown while page data is being fetched.

**Displays**: Full-screen spinner with "Loading..." label

---

## 💾 Backend Layer (Database & Business Logic)

### `backend/config/dbConnect.ts`

**Purpose**: MongoDB connection management.

**Functions**:

- Establishes Mongoose connection to MongoDB
- Handles connection errors
- Caches connection to prevent multiple connections
- Environment-based configuration

### `backend/models/user.model.ts`

**Purpose**: User data schema and business logic.

**IUser Interface**:

```
- _id: Unique identifier
- name: User's full name
- email: Unique email address
- password: Hashed password (optional for OAuth)
- roles: Array of roles (user, admin, etc.)
- profilePicture: Cloudinary image reference
- authProvider: Array of auth methods (Google, GitHub, credentials)
- subscription: Stripe subscription details
  - subscriptionId: Stripe subscription ID
  - status: active/cancelled/past_due
  - currentPeriodEnd: Next billing date
- resetPasswordToken: Token for password recovery
- resetPasswordExpire: Token expiration date
```

**Schema Validations**:

- Email must be unique
- Password automatically hashed using bcryptjs before saving
- Name is required
- Subscription object tracks billing state

### `backend/models/interview.model.ts`

**Purpose**: Interview and question data schema.

**IInterview Interface**:

```
- _id: Unique identifier
- user: Reference to User who created this interview
- industry: Job industry (e.g., "Tech", "Finance")
- type: Interview type (e.g., "Behavioral", "Technical", "Case Study")
- topic: Specific topic within industry
- role: Job role applying for
- numOfQuestions: Total questions in interview
- answers: Count of answered questions
- difficulty: Hard/Medium/Easy
- duration: Total time in minutes
- durationLeft: Remaining time
- status: pending/completed
- questions: Array of IQuestion objects
```

**IQuestion Interface**:

```
- _id: Question ID
- question: Question text
- answer: User's answer
- completed: Boolean flag
- result: Feedback object
  - overallScore: 0-10
  - clarity: Score
  - completeness: Score
  - relevance: Score
  - suggestions: AI feedback text
```

**Validations**:

- Industry must be from predefined list
- Topic must match selected industry
- Duration must be positive number
- Status transitions are controlled

### `backend/controllers/auth.controller.ts`

**Purpose**: Authentication and user management business logic.

**Key Functions**:

- `register()` - Create new user account
- `updateUserProfile()` - Update name and profile picture
- `updatePassword()` - Change user password
- `forgotPassword()` - Generate password reset token and email
- `resetPassword()` - Validate token and reset password
- `getDashboardStats()` - Get admin dashboard statistics

**Error Handling**:

- Wrapped with `catchAsyncErrors` middleware
- Returns error objects with messages
- Database connection errors caught

### `backend/controllers/interview.controller.ts`

**Purpose**: Interview creation, execution, and result processing.

**Key Functions**:

- `createInterview()` - Generate AI questions for new interview
- `deleteUserInterview()` - Remove interview record
- `updateInterviewDetails()` - Save answer and progress
- `getInterviewStats()` - Aggregate user statistics for dashboard
- `getInterviewResults()` - Retrieve detailed results after completion

**AI Integration**:

- Calls OpenAI API to generate questions
- Processes questions with AI feedback
- Stores results in database

### `backend/controllers/payment.controller.ts`

**Purpose**: Stripe payment and subscription management.

**Key Functions**:

- `createSubscription()` - Initialize Stripe subscription
- `handleStripeWebhook()` - Process Stripe events (payment, cancellation)
- Update user subscription status in database

### `backend/middleware/catchAsyncErrors.ts`

**Purpose**: Error handling wrapper for async functions.

**Functionality**:

- Wraps controller functions
- Catches thrown errors
- Extracts error message and status code
- Returns standardized error format
- Prevents unhandled promise rejections

**Error Format**:

```typescript
{
  error: {
    message: "Error description",
    statusCode: 400 | 500
  }
}
```

### `backend/types/interview.types.ts`

**Purpose**: TypeScript interfaces for interview-related data.

**Exports**:

- `InterviewBody` - Request payload for creating interviews
- `UpdateInterviewBody` - Request for updating interview

### `backend/utils/cloudinary.ts`

**Purpose**: Image upload and deletion with Cloudinary.

**Functions**:

- `upload_file()` - Upload image to Cloudinary
- `delete_file()` - Remove image by ID
- Returns image URL and public ID for database storage

### `backend/utils/sendEmail.ts`

**Purpose**: Transactional email sending via Nodemailer.

**Configuration**:

- Uses SMTP server (Gmail, SendGrid, etc.)
- Sends HTML emails
- Used for password reset, notifications

**Email Types**:

- Password reset emails with secure token link
- Welcome emails
- Subscription confirmations

### `backend/utils/emailTemplate.ts`

**Purpose**: HTML email templates.

**Contains**:

- `resetPasswordHTMLTemplate()` - Password reset email
- Styled HTML with branding
- Secure token link generation

### `backend/utils/auth.ts`

**Purpose**: Authentication utility functions.

**Functions**:

- `getAuthHeader()` - Extract authorization header from cookies
- `comparePassword()` - Verify password against hash
- Used in protected route handlers

### `backend/utils/stripe.ts`

**Purpose**: Stripe API integration.

**Functions**:

- Initialize Stripe client
- Create subscription
- Cancel subscription
- Retrieve customer details

### `backend/utils/apiFilters.ts`

**Purpose**: Query filtering and pagination for MongoDB.

**Features**:

- Builds MongoDB filter queries
- Pagination (limit, skip)
- Sorting
- Search across fields

### `backend/openai/openai.ts`

**Purpose**: OpenAI API integration for question generation and feedback.

**Functions**:

- `generateQuestions()` - Generate interview questions
  - Takes: industry, topic, role, difficulty, count, duration
  - Returns: Array of question strings
  - Token limit to control costs

- `generateFeedback()` - Analyze answer and provide feedback
  - Takes: question, user answer
  - Returns: Scores (clarity, relevance, completeness) + suggestions

**Prompt Engineering**:

- Detailed system prompts for consistency
- Token estimation for cost control
- Specific formatting instructions to AI

---

## 🎨 Components Layer (UI Components)

### `components/Home.tsx`

**Purpose**: Landing page content component.

**Sections**:

- Hero banner with CTA buttons
- Landing statistics
- Testimonials
- Interview process cards
- Pricing section

### `components/auth/` Directory

**Purpose**: Authentication-related UI components.

#### `Login.tsx`

- Email/password form
- OAuth buttons (GitHub, Google)
- Form validation
- Error toast notifications
- Redirect on success

#### `Register.tsx`

- Registration form (name, email, password)
- Input validation
- Success feedback and redirect

#### `ForgotPassword.tsx`

- Email input for password recovery
- Send reset email functionality
- Loading states

#### `ResetPassword.tsx`

- Token validation
- New password form
- Password strength requirements
- Success confirmation

#### `UpdateProfile.tsx`

- User name update
- Profile picture upload (Cloudinary)
- Avatar preview
- Delete old image on update

#### `UpdatePassword.tsx`

- Current and new password inputs
- Password strength validation
- Session update after change

### `components/interview/` Directory

**Purpose**: Interview-related UI components.

#### `Interview.tsx`

**Main interview conductor component**.

**Key Features**:

- Question display with progress bar
- Timer countdown with alerts
- Answer input textarea
- Navigate previous/next questions
- Skip question option
- Save and exit functionality
- Auto-save answers to localStorage
- Handle interview timeout

**State Management**:

```typescript
- currentQuestionIndex: Track current question
- answer: Current answer text
- allAnswers: Dictionary of all answers by question ID
- timeLeft: Countdown timer
- loading: API call status
- showTimeAlert: Show when time is running out
```

**LocalStorage Integration**:

- Save answers locally to prevent loss
- Restore on page reload
- Clear on interview completion

#### `NewInterview.tsx`

- Interview configuration form
- Select industry, type, topic, role, difficulty
- Number of questions input
- Duration selection
- Form submission to create interview
- Loading state during creation

#### `ListInterview.tsx`

- Table of user interviews
- Filter by status (pending, completed)
- Start/View buttons
- Pagination
- Search/sort functionality

#### `PromptInput.tsx`

- Simple textarea for answer input
- Custom styling
- Placeholder text

#### `PromptInputWithBottomActions.tsx`

- Textarea with speech-to-text capability
- Microphone button with error handling
- Clear button
- Character count

### `components/dashboard/` Directory

**Purpose**: User dashboard and statistics.

#### `Dashboard.tsx`

- Stats overview display
- Date picker for filtering stats
- Conditional rendering for empty states
- No data message when stats unavailable

#### `DashboardStats.tsx`

- Card-based statistics display
- Total interviews, completion rate, subscription status
- Icons and color coding for categories
- Responsive grid layout

#### `DashboardStatsChart.tsx`

- Line chart visualization of interview trends
- Date range filtering
- Uses Recharts library
- Shows interviews created per day

### `components/result/` Directory

**Purpose**: Interview results and feedback display.

#### `ResultDetails.tsx`

- Full interview results page
- Displays stats, questions, and answers
- Pagination through questions
- Shows feedback for each question
- Industry and role information

#### `ResultStats.tsx`

- Radial progress charts for scores
- Overall score, questions answered, duration
- Uses Recharts RadialBarChart
- Color-coded metrics

#### `ResultScore.tsx`

- Card-based score display
- Overall score, clarity, relevance, completeness
- Numeric values 0-10
- Grid layout

#### `ListResults.tsx`

- Table of completed interviews
- View results button
- Filter by completion status
- Pagination
- Shows interview details and scores

#### `QuestionCard.tsx`

- Individual question result display
- Question text
- User's answer
- AI feedback and suggestions
- Score breakdown

### `components/payment/` Directory

**Purpose**: Subscription and billing components.

#### `Subscribe.tsx`

- Stripe payment form integration
- Email and card input
- Process subscription
- Update session after success
- Error handling
- Loading state on button

#### `Unsubscribe.tsx`

- Cancel subscription form
- Confirmation dialog
- Update session state
- Show success/error messages

### `components/invoices/` Directory

**Purpose**: Billing and invoice management.

#### `ListInvoices.tsx`

- Table of invoices
- Download PDF button links
- Filter and pagination
- Empty state when no invoices
- Date formatting

### `components/admin/` Directory

**Purpose**: Admin panel components.

#### `Dashboard.tsx`

- Admin statistics overview
- Total users, revenue, active subscriptions
- Date range filtering
- Show key metrics

#### `ListUsers.tsx`

- Admin user management table
- Filter by subscription status
- View user details
- Pagination
- Responsive table

### `components/layout/` Directory

**Purpose**: Shared layout components.

#### `header/Navbar.tsx`

- Navigation bar with logo
- Links to main sections
- User menu (profile, logout)
- Session-based rendering
- Skeleton loading while session loads
- Subscribe button for free users
- Responsive hamburger menu

#### `header/HeaderAnnouncement.tsx`

- Promotional banner
- Shows for unsubscribed users
- Call-to-action link
- Dismissible

#### `header/HeaderUser.tsx`

- User profile dropdown
- Logout option
- Profile image display
- Session menu

#### `sidebar/AppSidebar.tsx`

- Left sidebar navigation
- Links to dashboard sections
- Active route highlighting
- Collapsible on mobile

#### `footer/Footer.tsx`

- Site footer
- Links and info
- Copyright notice

#### `breadcrumb/BreadCrumb.tsx`

- Navigation breadcrumb trail
- Shows current page location
- Links to parent pages
- Improves UX for deep pages

#### `loader/Loader.tsx`

- Full-screen spinner overlay
- Centered loading indicator
- "Loading..." label
- Semi-transparent background

#### `not-found/NotFound.tsx`

- 404 error page UI
- Large 404 heading
- Helpful message
- Link to home

#### `pagination/Pagination.tsx`

- Table pagination controls
- Page number inputs
- Previous/next buttons
- Rows per page selector

#### `testimonials/Testimonials.tsx`

- User testimonials display
- Card-based layout
- User images and quotes
- Rating display

#### `pricing/Pricing.tsx`

- Pricing plans display
- Feature lists per plan
- CTA buttons
- Plan comparison

#### `landing-page-stats/LandingPageStats.tsx`

- Landing page statistics cards
- Radial progress charts
- Shows key metrics
- Responsive grid

### `components/form/` Directory

**Purpose**: Form utilities and components.

#### `genericSubmitHandler.ts`

**Custom hook for form submission handling**.

**Purpose**: Centralized form submission logic reused across all forms.

**Features**:

- Tracks loading state
- Extracts FormData from form element
- Converts FormData to object
- Calls async callback
- Handles errors with try-catch
- Sets loading to false in finally block

**Usage**:

```typescript
const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
  // Process form data
  // Show success/error toasts
});

<form onSubmit={handleSubmit}>...</form>
```

**Benefits**:

- Consistent loading UI across all forms
- Centralized error handling
- Prevents double submission
- Type-safe form data

### `components/date-picker/` Directory

**Purpose**: Date selection components.

#### `StatsDatePicker.tsx`

- Date range picker
- Filter dashboard stats by date
- Apply button for filtering
- Calendar UI

---

## 🛠️ Utilities & Helpers

### `helpers/helper.ts`

**Purpose**: General utility functions used across app.

**Functions**:

| Function                        | Purpose                         |
| ------------------------------- | ------------------------------- |
| `getPageIconAndPath(pathname)`  | Map route to icon and color     |
| `formatTime(seconds)`           | Convert seconds to MM:SS format |
| `paginate(data, page, perPage)` | Slice array for pagination      |
| `getTotalPages(total, perPage)` | Calculate total pages           |
| `updateSearchParams()`          | Manage URL query parameters     |
| `getFirstDayOfMonth()`          | Get first day of current month  |
| `getToday()`                    | Get today's date                |

### `helpers/auth.ts`

**Purpose**: Authentication-related helpers.

**Functions**:

- `getAuthHeader()` - Extract and format auth header from cookies
- `isUserSubscribed()` - Check subscription status

### `helpers/interview.ts`

**Purpose**: Interview-specific helpers.

**Functions**:

- `getFirstIncompleteQuestionIndex()` - Find first unanswered question
- `getAllAnswersFromLocalStorage()` - Retrieve saved answers
- `getAnswerFromLocalStorage()` - Get specific answer
- `saveAnswerToLocalStorage()` - Store answer locally
- `calculateAverageScore()` - Compute average of question scores
- `calculateDuration()` - Calculate time spent vs time left

### `helpers/pageTitles.ts`

**Purpose**: Page metadata for routing.

**Exports**:

- `appPages` - Array of app routes with titles and breadcrumbs
- Used by `usePageTitle()` hook

### `constants/data.ts`

**Purpose**: Constant data shared across app.

**Contains**:

- Industry categories
- Interview types (Behavioral, Technical, etc.)
- Difficulty levels
- Topic mappings per industry
- Sample testimonials

### `constants/constants.ts`

**Purpose**: Global constants.

**Contains**:

- User roles
- Subscription statuses
- Interview statuses
- Error messages

### `constants/pages.ts`

**Purpose**: Route metadata.

**Exports**:

- Page paths
- Breadcrumb trails
- Page titles
- Route icons

### `config/site.ts`

**Purpose**: Site-wide configuration.

**Contains**:

- Site name and description
- Social links
- Navigation menu structure

### `config/Logo.tsx`

**Purpose**: Logo component reused throughout site.

### `types/next.d.ts`

**Purpose**: Custom Next.js type definitions.

**Extends**:

- NextAuth session types
- Custom JWT token types

### `hooks/usePageTitle.tsx`

**Purpose**: Custom hook to get page title and breadcrumbs.

**Returns**:

- `title` - Current page title
- `breadcrumbs` - Navigation breadcrumb array

**Used By**: App layout to display breadcrumb trail

---

## 🔐 Authentication & Security

### NextAuth Configuration

**Location**: `app/api/auth/[...nextauth]/`

**Providers**:

1. **Credentials** - Email/password (custom login)
2. **Google OAuth** - Sign in with Google
3. **GitHub OAuth** - Sign in with GitHub

**Features**:

- Session-based authentication
- JWT tokens
- Role-based access control
- Protected routes via middleware

### Password Security

- Passwords hashed with bcryptjs (rounds: 10)
- Never stored in plain text
- Reset tokens with expiration
- Secure token generation using crypto

### Protected Routes

- Middleware checks session for `/app/*` routes
- Admin routes check for admin role
- Redirect to login if unauthorized

---

## 🔌 External Integrations

### OpenAI Integration (`backend/openai/openai.ts`)

**Purpose**: Generate interview questions and feedback.

**Models Used**:

- `gpt-4o-mini` - Cost-effective, fast responses

**Calls**:

1. **Generate Questions**
   - Input: Industry, topic, role, difficulty, count
   - Output: Newline-separated questions
   - Token limit: ~1500 tokens per question

2. **Generate Feedback**
   - Input: Question, user answer
   - Output: JSON with scores and suggestions

### Stripe Integration (`backend/utils/stripe.ts`)

**Purpose**: Payment processing and subscription management.

**Features**:

- Create subscriptions
- Cancel subscriptions
- Webhook validation
- Customer management
- Invoice generation

**Webhook Events Handled**:

- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Payment confirmation

### Cloudinary Integration (`backend/utils/cloudinary.ts`)

**Purpose**: Image uploads and storage.

**Features**:

- Upload images (profile pictures)
- Delete images by public ID
- Automatic resizing and optimization
- CDN delivery

### Nodemailer Integration (`backend/utils/sendEmail.ts`)

**Purpose**: Transactional emails.

**Features**:

- HTML email templates
- SMTP configuration
- Password reset emails
- Welcome emails

### MongoDB (`backend/models/`)

**Purpose**: Primary database for app data.

**Collections**:

- `users` - User accounts
- `interviews` - Interview records
- `_sessions` (NextAuth) - Session tokens

**Connection**:

- Mongoose ODM
- Connection pooling
- Validation at schema level

---

## 📁 Server Actions

### `actions/auth.action.ts`

**Purpose**: Authentication server-side operations.

**Exports**:

- `registerUser()` - Create account
- `loginUser()` - Verify credentials (in NextAuth)
- `updateUserProfile()` - Update profile
- `updatePassword()` - Change password
- `forgotPassword()` - Send reset email

### `actions/interview.action.ts`

**Purpose**: Interview operations server-side.

**Exports**:

- `newInterview()` - Create interview
- `deleteInterview()` - Remove interview
- `updateInterview()` - Save progress and answers

### `actions/payment.action.ts`

**Purpose**: Payment operations server-side.

**Exports**:

- `createSubscription()` - Start subscription
- `cancelSubscription()` - End subscription

---

## 📊 Data Flow Patterns

### Interview Creation Flow

```
1. User selects params (industry, topic, role, etc) → NewInterview form
2. Form submitted → newInterview() action
3. Action calls createInterview() controller
4. Controller calls OpenAI API to generate questions
5. Questions saved to MongoDB
6. Interview record returned to frontend
7. Redirect to Interview component for conducting
```

### Interview Conduction Flow

```
1. Interview component mounts with interview data
2. Load first incomplete question
3. User types answer in textarea
4. Save to localStorage on change
5. Next button saves answer to DB via updateInterview()
6. Move to next question
7. On exit/complete, final save to DB
```

### Result Viewing Flow

```
1. User completes interview
2. Interview marked as completed
3. OpenAI generates feedback for each answer
4. Scores stored in result object
5. User can view ResultDetails page
6. Shows questions, answers, AI feedback
```

---

## 🔄 State Management Patterns

### Client-Side State

- **React Hooks**: useState for local component state
- **LocalStorage**: Persist interview answers
- **Session**: NextAuth session for user data
- **URL Search Params**: For filtering and pagination

### Server-Side State

- **Database**: MongoDB for persistent data
- **Sessions**: NextAuth for user sessions
- **JWT Tokens**: In cookies for authentication

---

## 🎯 Key Features Implementation

### Form Handling

- Uses `useGenericSubmitHandler` hook
- FormData parsing from form element
- Async callback for business logic
- Loading state on submit button
- Toast notifications for feedback

### Loading States

- Page-level: `loading.tsx` files show spinner
- Component-level: `isLoading` on buttons
- Skeleton screens: For navbar user avatar
- Progress bars: In Interview component

### Error Handling

- Error boundaries: `error.tsx` pages catch crashes
- Toast notifications: For user-facing errors
- Standardized error responses: `{ error: { message, statusCode } }`
- Try-catch in async operations

### Empty States

- Check data length before rendering lists
- Show helpful messages when no data
- Conditional rendering for different states
- Disable buttons when no data available

---

## 📝 Development Guidelines

### Adding New Features

1. Create MongoDB schema if new data type
2. Build controller function for business logic
3. Create server action wrapper
4. Build React component(s) for UI
5. Add API route if needed
6. Add error handling and loading states
7. Add tests

### Adding New Pages

1. Create file in `app/` directory
2. Use dynamic segments for params: `[id]`
3. Create layout wrapper if needed
4. Add to breadcrumb configuration
5. Add navigation links

### Component Structure

```typescript
"use client" // if needs interactivity

import types
import components
import hooks
import utils

export default function Component() {
  // State
  // Effects
  // Handlers
  // Render
}
```

---

## 🚀 Deployment

Deployed on **Vercel** with:

- Automatic deployments from git
- Environment variables configured
- MongoDB Atlas for database
- Email service for notifications
- Stripe for payments
- Cloudinary for images

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org)
- [MongoDB Docs](https://docs.mongodb.com)
- [Stripe API](https://stripe.com/docs/api)
- [OpenAI API](https://platform.openai.com/docs)
- [NextAuth.js](https://next-auth.js.org)
- [HeroUI Components](https://heroui.com)

---

**Last Updated**: February 14, 2026
