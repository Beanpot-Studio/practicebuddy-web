# Firebase Setup Guide for Practice Buddy

This guide will help you set up Firebase authentication and Firestore for the Practice Buddy application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "practice-buddy")
4. Follow the setup wizard (you can disable Google Analytics for now)

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 3. Set up Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location close to your users
5. Click "Done"

## 4. Get Your Firebase Configuration

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "Practice Buddy Web")
6. Click "Register app"
7. Copy the configuration object

## 5. Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
PUBLIC_FIREBASE_API_KEY=your-api-key-here
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Replace the values with your actual Firebase configuration.

## 6. Set up Firestore Security Rules

In your Firestore Database, go to the "Rules" tab and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can read and write their own practices
      match /practices/{practiceId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Students can read and write their own data
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    
    // Classes can be read by authenticated users
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Practices collection - teachers can see all practices from students in their classes
    match /practices/{studentId}/sessions/{practiceId} {
      // Students can read/write their own practices
      allow read, write: if request.auth != null && request.auth.uid == studentId;
      
      // Teachers can read/write practices for students in their classes
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/classes/{classId}) &&
        get(/databases/$(database)/documents/classes/{classId}).data.teacherId == request.auth.uid &&
        exists(/databases/$(database)/documents/classes/{classId}/students/$(studentId));
    }
    
    // AI requests and responses (for future features)
    match /ai_requests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    match /ai_responses/{requestId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Create Initial Data Structure

You'll need to create some initial data in Firestore for the app to work:

### Create a Test Class

1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `classes`
4. Document ID: `TEST123` (or any code you want to use)
5. Add these fields:
   - `teacherId`: `test-teacher-id`
   - `className`: `Test Music Class`
   - `createdAt`: `2024-01-01T00:00:00.000Z`

### Create a Test Teacher

1. Create another collection: `users`
2. Document ID: `test-teacher-id`
3. Add these fields:
   - `email`: `teacher@test.com`
   - `displayName`: `Test Teacher`
   - `role`: `teacher`
   - `school`: `Test Music School`
   - `createdAt`: `2024-01-01T00:00:00.000Z`

## 8. Test the Application

1. Start the development server: `npm run dev`
2. Try registering a new teacher account
3. Try logging in with the test teacher account
4. Try logging in as a student with the test class code

## 9. Production Considerations

Before deploying to production:

1. **Secure Firestore Rules**: Update the security rules to be more restrictive
2. **Enable Authentication Providers**: Consider adding Google, Apple, or other sign-in methods
3. **Set up Custom Domain**: Configure a custom domain for authentication
4. **Enable App Check**: Add App Check for additional security
5. **Set up Monitoring**: Enable Firebase Performance Monitoring and Crashlytics
6. **Configure Hosting**: Set up Firebase Hosting for production deployment

## 10. Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**: This usually means Firebase is being initialized multiple times. Check that you're only importing the Firebase config once.

2. **"Permission denied"**: Check your Firestore security rules and make sure they allow the operations you're trying to perform.

3. **"Invalid API key"**: Make sure your environment variables are correctly set and the API key is valid.

4. **"User not found"**: For student login, make sure the class code exists in Firestore and the student name matches exactly.

### Development Tips:

- Use Firebase Emulator Suite for local development
- Check the browser console for detailed error messages
- Use Firebase Console to monitor authentication and database activity
- Test with different user roles and scenarios

## 11. Next Steps

Once basic authentication is working, consider adding:

- Password reset functionality
- Email verification
- User profile management
- Class management for teachers
- Student progress tracking
- Real-time updates with Firestore listeners
- File uploads with Firebase Storage
- Push notifications with Firebase Cloud Messaging 