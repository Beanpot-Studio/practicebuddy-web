// Cloudinary service for audio uploads and transformations

// Extract configuration from environment variables
const uploadPreset = import.meta.env.PUBLIC_CLOUDINARY_PRESET
const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME

// Upload audio to Cloudinary
export const uploadAudioToCloudinary = async (audioBlob, userId) => {
  try {
    
    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = `practice_temp_${Date.now()}_${Date.now() + Math.random()}`
    
    // Prepare upload parameters for unsigned upload
    // Note: format conversion should be handled by the upload preset configuration
    const uploadParams = {
      upload_preset: uploadPreset,
      resource_type: 'video', // Use video for audio compatibility
      folder: `practice-buddy/recordings/${userId}`,
      public_id: publicId
      // format parameter removed - handled by upload preset
    }

    
    // Create form data for unsigned upload
    const formData = new FormData()
    formData.append('file', audioBlob, 'recording.webm')
    
    // Add parameters for unsigned upload
    Object.entries(uploadParams).forEach(([key, value]) => {
      formData.append(key, value)
    })


    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      body: formData
    })


    if (!response.ok) {
      const errorText = await response.text()
      console.error('Upload failed. Status:', response.status)
      console.error('Error text:', errorText)
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      duration: result.duration,
      format: result.format
    }
  } catch (error) {
    throw error
  }
}



// Get optimized playback URL
export const getOptimizedPlaybackUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null
  
  // Add format and quality optimizations for playback
  return cloudinaryUrl.replace('/upload/', '/upload/f_mp3,q_auto/')
}

// Generate waveform URL for audio files
export const getWaveformUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) {
    return null
  }
  
  // For video resources (audio files), add waveform transformation and change extension to .png
  if (cloudinaryUrl.includes('/video/upload/')) {
    // Convert video to image with waveform transformation - make it wider for better detail
    return cloudinaryUrl.replace('/video/upload/', '/video/upload/w_800,h_100,fl_waveform,co_black,b_white,f_png/').replace(/\.webm$/, '.png')
  }
  
  // For image resources, just add waveform parameters
  if (cloudinaryUrl.includes('/image/upload/')) {
    return cloudinaryUrl.replace('/image/upload/', '/video/upload/w_800,h_100,fl_waveform,co_black,b_white,f_png/')
  }
  
  // Fallback for any other format
  return cloudinaryUrl.replace('/upload/', '/upload/w_800,h_100,fl_waveform,co_black,b_white,f_png/')
}

// Create audio player with error handling
export const createAudioPlayer = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null
  
  const audio = new Audio()
  audio.crossOrigin = 'anonymous' // Enable CORS for Cloudinary URLs
  audio.src = getOptimizedPlaybackUrl(cloudinaryUrl)
  
  return audio
} 