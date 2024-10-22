# Firebase Integration SOP

This SOP outlines the steps to implement Firebase integration into our Next.js 13 project with app router.

## 1. Setup Firebase Configuration

- [ ] 1.1. Create a new file: `/src/lib/firebase/config.ts`
- [ ] 1.2. Initialize Firebase app with your project's configuration
- [ ] 1.3. Export necessary Firebase services (auth, firestore, storage)

## 2. Implement Firestore Utility

- [ ] 2.1. Create a new file: `/src/lib/firebase/firestore.ts`
- [ ] 2.2. Implement functions for CRUD operations on Firestore
- [ ] 2.3. Ensure efficient use of Firebase calls by creating a single instance

## 3. Implement Authentication Utility

- [ ] 3.1. Create a new file: `/src/lib/firebase/auth.ts`
- [ ] 3.2. Implement functions for sign up, login, logout, and delete user
- [ ] 3.3. Create an AuthProvider component for managing authentication state

## 4. Implement Storage Utility

- [ ] 4.1. Create a new file: `/src/lib/firebase/storage.ts`
- [ ] 4.2. Implement functions for downloading files from Firebase Storage

## 5. Set up Firebase Security Rules

- [ ] 5.1. Create a new .txt file with the rules to allow only authenticated users to read storage and read + write to firestore. 

## 6. Implement User Profile

- [ ] 6.1. Create a new collection in Firestore for user profiles
- [ ] 6.2. Implement functions to create, read, update, and delete user profiles
- [ ] 6.3. Store profile information: id, image, username, games, avg. score

## 7. Implement Games Collection

- [ ] 7.1. Create a new collection in Firestore for games
- [ ] 7.2. Implement functions to create, read, update, and delete game records
- [ ] 7.3. Store game information: id, userId, docId, [speed, accuracy]

## 8. Update Existing Components

- [ ] 8.1. Modify the `app/components/AuthProvider.tsx` to pass down the user information to its context
- [ ] 8.2. Modify `app/layout.tsx` to include the AuthProvider
- [ ] 8.3. Update `app/profile/page.tsx` to use Firebase authentication and display user profile
- [ ] 8.4. Update `app/training/page.tsx` to store game results in Firestore

Remember to use shadcn/ui components, globals.css variables, and Tailwind CSS for styling wherever applicable. Utilize existing code and maintain consistency with the current project structure.
