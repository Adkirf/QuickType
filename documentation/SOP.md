1. Setup
npx shadcn@latest init
npm install firebase

Globals -> color theme (grey scale, modern blue accent), h1,h2,h3, p
- create overview.md with project structure

2. Basic User Flow
- create full screen layout, fixed header, content, and footer
- header takes up as much space its content requires, content and footer fill the rest of the screen space aviable.
- create header with logo on the left training in the middle, and profile on the right. 
- create basic footer with links to privacy policy, terms of service, and contact us. 
- create pages for landing, profile and training, which are populat the content.

3. Firebase Integration
- implement /utils/firestore.ts
- implement/utils/auth.ts
- implement /utils/conif.ts
- implement /utils/storage.ts
- ensure efficient use of firesbase calls, only one instance to make calls. 
- create firebase rules: only authenticated users can read read storage and read&write to firestore. 
- Implement Firebase authentication (sign up, login, logout, delete) & AuthProvider
- Implement Firebase profile (id, image, username, games, avg. scr)

4. Storage SOP
- use the firebase/storage.ts file to download the files
- creeate the necessary logic to process the retrieved data
- display the markdown file in the training-page.tsx file



4. UI/UX
components: landing, profile, training

5. Analytics
Evaluation algorithm

6. Outlook
Recommendation algorithm
pvp
multilanguage
