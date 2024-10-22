# Standard Operating Procedure: Retrieve and Display Markdown Files from Firebase Storage

## Overview
This SOP outlines the process of implementing a new feature to retrieve markdown files from the local storage and display them in the training page of our Next.js 13 App router.

## Steps

### 1. Update Firebase Storage Configuration
1.1. Open `lib/firebase/storage.ts`.
1.2. Implement a new function to retrieve markdown files from the assets/papers folder.
1.3. Ensure error handling and proper typing are in place.

### 2. Create Utility Functions for Markdown Processing
2.1. Create a function markddownToHmtl in the lib/utils.ts file.
2.2. Implement logic to process the retrieved markdown data.
2.3. Include error handling and type checking.

### 3. Update Project Types
3.1. Open `lib/projectTypes.ts`.
3.2. Add new types related to markdown files and local Storage operations.

### 4. Implement UI Components
4.1. Open `components/training-page.tsx`.
4.2. Create a new component for displaying markdown content.
4.3. Implement state management for loading and displaying markdown files.
4.4. Use shadcn/ui components where applicable.
4.5. Ensure responsive design using Tailwind CSS.
4.6 Use globals.css variables wherever possible.

### 5. Update Training Page
5.1. Open `app/training/page.tsx`.
5.2. Integrate the new markdown display component.
5.3. Implement logic to fetch and pass markdown data to the component.

### 6. Error Handling and Loading States
6.1. Implement proper error handling throughout the feature.
6.2. Add loading states to improve user experience.

## Notes
- Adhere to the existing project structure and coding standards.
- Utilize Next.js 13 app router features where applicable.
- Prioritize reusability and maintainability in your implementation.
