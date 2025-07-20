# Pre-Launch Screen Setup

## Overview
Practice Buddy now includes a beautiful pre-launch screen that collects email addresses when the app is in pre-launch mode.

## How to Enable Pre-Launch Mode

### Option 1: Environment Variable (Recommended for Production)
Create a `.env` file in the root directory with:
```
PUBLIC_STATUS=pre-launch
```

### Option 2: Test Button (Development Only)
When the app is running, you'll see a yellow "🚀 Test Pre-Launch" button in the bottom-right corner. Click it to test the pre-launch screen.

## Features

### Pre-Launch Screen Includes:
- 🎵 **Beautiful animated background** with musical notes
- 📧 **Email collection form** with validation
- 👥 **Role selection** (Student, Teacher, Parent, Other)
- 🎼 **Instrument field** (optional)
- 🌟 **Feature preview** cards
- 📊 **Social proof** statistics
- ✅ **Success confirmation** after submission

### Form Fields:
1. **Email Address** (required, validated)
2. **Role** (Student, Teacher, Parent, Other)
3. **Primary Instrument** (optional)

### Data Storage:
- Currently stores signups in `localStorage` for demo purposes
- In production, you'd want to send this data to your backend/Firebase

## Testing

### To Test the Pre-Launch Screen:
1. **Start the development server**: `npm run dev`
2. **Click the yellow "🚀 Test Pre-Launch" button** in the bottom-right corner
3. **Fill out the form** and submit
4. **Click "← Back to App"** to return to the main application

### To Test with Environment Variable:
1. **Create a `.env` file** with `PUBLIC_STATUS=pre-launch`
2. **Restart the development server**
3. **The pre-launch screen will show automatically**

## Production Deployment

### For Production:
1. **Set the environment variable** on your hosting platform:
   - Vercel: Add `PUBLIC_STATUS=pre-launch` to environment variables
   - Netlify: Add `PUBLIC_STATUS=pre-launch` to environment variables
   - Firebase Hosting: Add to your build environment

2. **Remove test buttons** before deploying:
   - Remove the "🚀 Test Pre-Launch" button from `MusicApp.vue`
   - Remove the "← Back to App" button from `PreLaunchScreen.vue`

3. **Connect to backend** for email storage:
   - Replace localStorage with Firebase Firestore
   - Add email validation and spam protection
   - Set up email notifications

## Customization

### Styling:
- The pre-launch screen uses the same design system as the main app
- Colors and styling can be modified in `PreLaunchScreen.vue`
- Background animations can be adjusted

### Content:
- Update the feature descriptions in the cards
- Modify the social proof statistics
- Change the form fields as needed

### Functionality:
- Add more form fields (name, phone, etc.)
- Integrate with email marketing services (Mailchimp, ConvertKit, etc.)
- Add analytics tracking

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PUBLIC_STATUS` | Controls app mode | `pre-launch` or `live` |
| `PUBLIC_FIREBASE_API_KEY` | Firebase configuration | Your Firebase API key |

## Troubleshooting

### Pre-launch screen not showing:
1. Check that `PUBLIC_STATUS=pre-launch` is set correctly
2. Restart the development server after changing environment variables
3. Check browser console for any errors

### Form not submitting:
1. Check browser console for validation errors
2. Ensure all required fields are filled
3. Verify email format is correct

### Styling issues:
1. Ensure Tailwind CSS is properly configured
2. Check that custom CSS classes are defined
3. Verify responsive design on different screen sizes 