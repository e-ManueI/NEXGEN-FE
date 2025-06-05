This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Schema

To get access view to the db schema: Go to [this link](https://dbdiagram.io/d/NexGen-Materials-681124ec1ca52373f5df7260)

## Project Structure

```bash
NEXTGEN-FE/
├── app/
│   ├── (routes)/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── confirmation-page/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── doc-ingestion/
│   │   │   │   └── page.tsx
│   │   │   ├── predictions/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── 403/
│   │       └── page.tsx
│   ├── api/
│   │   └── Next.js API routes here, e.g., internal endpoints
│   ├── _actions/       # Server Actions
│   ├── _db/            # Database schema, enums
│   │   └── enum/       # (e.g., UserType enum)
│   ├── _store/         # Client-side state management (e.g., Zustand stores like uploadStore.ts)
│   ├── _types/         # TypeScript definition files (*.d.ts)
│   ├── _config/        # Configuration files
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Services for API calls
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Root page (homepage)
│   └── globals.css
├── components/
│   ├── containers/     # Larger, composed components (e.g., dashboard sections, form containers)
│   │   ├── dashboard/
│   │   │   ├── agent-data/
│   │   │   │   ├── upload-card.tsx
│   │   │   │   ├── ingested-table.tsx
│   │   │   │   └── upload-sonner-manager.tsx
│   │   │   └── predictions/
│   │   │       └── prediction-playground/
│   │   │           └── base-playground.tsx
│   │   └── web/
│   │       └── signup/
│   │           └── register-stepper/
│   │               └── three_brine-uploader.tsx
│   ├── ui/             # Base UI components (likely shadcn/ui)
│   └── hooks/          # UI-related hooks
├── lib/
│   ├── auth.ts         # NextAuth configuration
│   ├── email.ts        # Email sending utilities
│   ├── routes.ts       # Centralized API and APP route definitions
│   ├── utils.ts        # General utility functions
│   ├── constants.ts    # Constants for the app
│   ├── date-utils.ts   # Date utilities
│   ├── api-response.ts # Utilities for standardizing API responses
│   └── zod/            # Zod schemas for validation
├── public/             # Static assets (images, fonts, etc.)
├── drizzle/            # Drizzle ORM configuration and migrations
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── middleware.ts       # Next.js middleware for auth and routing
├── next.config.ts      # Next.js configuration
├── package.json        # Package dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Environment Variables
To get access view to the env variables: Go to .env.example file.

## API Endpoints
Based on the codebase, particularly lib/routes.ts and how services/hooks interact with APIs, we can infer the following about the API structure. The frontend code primarily defines client-side routes and how it consumes backend APIs. The actual backend API endpoints are in the Next.js API routes (app/api/) where they are used extensively for a Backend-For-Frontend (BFF) pattern.

The content of lib/routes.ts gives us a very clear map of the API endpoints the frontend is designed to interact with.
1. Admin Endpoints (API.admin):
    - API.admin.users: (/api/admin/users)
        - Purpose: For fetching a list of users, creating new users, or other bulk user operations available to administrators.
    - API.admin.userDetail(id: string): (/api/admin/users/${id}).
        - Purpose: For fetching, updating, or deleting a specific user by their ID.
    - API.admin.analytics: (/api/admin/users/analytics).
        - Purpose: To fetch analytics data related to users, for an admin users dashboard.

2. Internal Endpoints (API.internal):
    - API.internal.docIngestion: (/api/internal/doc-ingestion)
        - Purpose: This is the endpoint used by the UploadCard component to upload PDF files for document ingestion and processing.
    - API.internal.docIngestionUpload: (/api/internal/doc-ingestion/upload)
        - Purpose: This is the endpoint used by the UploadCard component to upload PDF files for document ingestion and processing.
    - API.internal.predictions(id: string): (/api/internal/predictions/${id})
        - Purpose: To fetch details of a specific prediction, potentially internal or raw prediction data.
    - API.internal.reviewedPredictions(id: string): (/api/internal/reviewed-predictions/${id}/versions)
        - Purpose: To get different reviewed versions of a specific prediction. This is for a workflow where predictions can be reviewed and versioned.
    - API.internal.reviewedPredictionVersion(predictionId: string, reviewedId: string): (/api/internal/reviewed-predictions/${predictionId}/versions/${reviewedId})
        - Purpose: To fetch a specific version of a reviewed prediction.
    - API.internal.reviewedPredictionsApprove: (/api/internal/reviewed-predictions/approve/)
        - Purpose: To approve a reviewed prediction.

3. Client Endpoints (API.client):
    - API.client.mnda: (/api/client/policies/mnda)
        - Purpose: Likely related to fetching or submitting a Mutual Non-Disclosure Agreement (MNDA). This is hinted at by the mnda: "/signup/mnda" client-side route.
    - API.client.mndaStatus: (/api/client/policies/mnda/status)
        - Purpose: To check the status of an MNDA for a client.

4. Predictions Endpoints (API.predictions):
    - API.predictions.root: (/api/predictions)
        - Purpose: Base endpoint for predictions, possibly for fetching a list of all predictions (with appropriate filters).
    - API.predictions.byUser(userId: string): (/api/predictions?user=${userId})
        - Purpose: To fetch predictions made by a specific user.
    - API.predictions.generate(role: string): (/api/predictions/generate-predictions?role=${role})
        - Purpose: To trigger the generation of new predictions, potentially with behavior varying by user role. This is likely used by the prediction playground.
    - API.predictions.details(id: string): (/api/predictions/${id})
        - Purpose: To fetch the details of a specific prediction, possibly the user-facing version.

5. Analytics Endpoints (API.analytics):
    - API.analytics.predictionStats(timeRange: string): (/api/admin/analytics/prediction-stats?timeRange=${timeRange})
        - Purpose: To fetch statistics about predictions within a given timeRange, likely for an admin analytics dashboard.

6. Auth Endpoints (API.auth):
    - API.auth.resetPassword: (/api/auth/reset-password)
        - Purpose: To handle password reset requests (e.g., submitting a new password with a reset token).
    - API.auth.forgotPassword: (/api/auth/forgot-password)
        - Purpose: To initiate the forgot password process (e.g., submitting an email to receive a reset link).