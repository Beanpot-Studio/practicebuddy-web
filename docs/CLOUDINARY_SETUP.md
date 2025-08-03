# Cloudinary Setup Guide

This document explains how to set up Cloudinary for audio recording uploads and playback in the Practice Buddy application.

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Cloudinary Configuration
PUBLIC_CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
PUBLIC_CLOUDINARY_PRESET=recordings

# Server-side Cloudinary credentials (for API routes)
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Cloudinary Dashboard Setup

### 1. Create Upload Preset

1. Go to your Cloudinary Dashboard
2. Navigate to Settings > Upload
3. Scroll down to "Upload presets"
4. Click "Add upload preset"
5. Configure the preset:
   - **Name**: `recordings`
   - **Signing Mode**: `Signed`
   - **Folder**: `practice-buddy/recordings`
   - **Resource Type**: `Video` (for audio compatibility)
   - **Format**: `mp3`
   - **Access Mode**: `public`

### 2. Get API Credentials

1. In your Cloudinary Dashboard, go to Settings > Access Keys
2. Copy your:
   - **API Key**
   - **API Secret**
   - **Cloud Name**

### 3. Configure Environment Variables

Replace the placeholder values in your `.env` file:

```env
PUBLIC_CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
PUBLIC_CLOUDINARY_PRESET=recordings
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## How It Works

### Upload Process

1. **Audio Recording**: User records audio using MediaRecorder API (max 60 seconds)
2. **Cloudinary Upload**: Audio blob is uploaded to Cloudinary using signed upload
3. **Format Conversion**: Cloudinary automatically converts to MP3 format
4. **Storage**: Audio is stored in `practice-buddy/recordings/{userId}/` folder

### Playback Process

1. **Optimized URL**: Cloudinary URL is transformed for optimal playback (`f_mp3,q_auto`)
2. **Waveform Generation**: Cloudinary generates waveform visualization (`fl_waveform`)
3. **Audio Player**: HTML5 Audio element plays the optimized URL

### Deletion Process

1. **API Route**: Server-side API route handles secure deletion
2. **Signed Request**: Deletion request is signed with API credentials
3. **Cleanup**: Audio file is permanently deleted from Cloudinary

## File Structure

```
src/
├── lib/
│   └── cloudinary.js          # Cloudinary service functions
├── pages/api/cloudinary/
│   └── delete.js              # Server-side deletion API
└── components/StudentDashboard/
    └── AudioWaveform.vue      # Waveform display component
```

## Key Functions

### `uploadAudioToCloudinary(audioBlob, userId)`
- Uploads audio blob to Cloudinary
- Returns upload result with public ID and URL
- Handles signed upload authentication

### `getOptimizedPlaybackUrl(cloudinaryUrl)`
- Transforms URL for optimal audio playback
- Adds format and quality optimizations

### `getWaveformUrl(cloudinaryUrl)`
- Generates waveform visualization URL
- Creates black waveform on white background

### `createAudioPlayer(cloudinaryUrl)`
- Creates HTML5 Audio element
- Enables CORS for Cloudinary URLs
- Handles playback controls

## Error Handling

The system includes comprehensive error handling for:
- Upload failures
- Playback errors
- Network issues
- Authentication problems

## Security

- **Signed Uploads**: All uploads use signed authentication
- **Server-side Deletion**: Deletion requires server-side API route
- **CORS Support**: Audio elements include CORS headers
- **Environment Variables**: Sensitive credentials stored in environment variables

## Testing

To test the Cloudinary integration:

1. Ensure environment variables are set correctly
2. Start a practice session
3. Record audio (max 60 seconds)
4. Verify upload to Cloudinary
5. Test playback and waveform display
6. Verify deletion functionality

## Troubleshooting

### Common Issues

1. **"Unknown API key"**: Check `PUBLIC_CLOUDINARY_URL` format
2. **"Invalid Signature"**: Verify API secret and parameter ordering
3. **Upload fails**: Ensure upload preset is signed and configured correctly
4. **Playback errors**: Check CORS settings and URL format
5. **Waveform not displaying**: Verify Cloudinary transformation parameters

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are loaded
3. Test Cloudinary credentials in dashboard
4. Check network requests in browser dev tools
5. Verify upload preset configuration 