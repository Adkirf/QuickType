Folder Structure

reservation-book/
├── public/
│   └── locales/
│       └── english.json
│       └── spanish.json

├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
│       └── utils/
│           └── index.ts



[] Create an english.json file in the public/locales folder with all translated text @public/locales
[] Create imports the english.json file and store it as a variable in an array
[] Create and utils function in the utils file that takes in a lang: string and returns translations[lang as keyof typeof translations] || en; 
[] Create a LanguageSelector component that takes in a function to change the selectedLanguage state from the AuthContext.  
[] Implement the selected language and translator-helper-funtion in the AuthProvider to make it accessible accross the app
[ ] Go through all affected files on by one and replace hardcoded text with translated text using the translator-helper-funtion from the AuthProvider
[ ] Create a new spanish.json with all text values from @english.json translated to spanish. 
[ ] Keep updated prompt: "Review the @languageSOP to translate the hardcoded text in ... using the @AuthProvider and update the lanagues.jsons" 