// Cloudinary service for audio uploads and transformations

// Extract configuration from environment variables
const uploadPreset = import.meta.env.PUBLIC_CLOUDINARY_PRESET
const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME

// Upload audio to Cloudinary
export const uploadAudioToCloudinary = async (audioBlob, userId) => {
  try {
    console.log('Starting upload to Cloudinary...')
    console.log('Audio blob size:', audioBlob.size)
    
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

    console.log('Upload parameters:', uploadParams)
    
    // Create form data for unsigned upload
    const formData = new FormData()
    formData.append('file', audioBlob, 'recording.webm')
    
    // Add parameters for unsigned upload
    Object.entries(uploadParams).forEach(([key, value]) => {
      formData.append(key, value)
    })

    console.log('Uploading to Cloudinary with unsigned upload preset:', uploadPreset)

    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      body: formData
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Upload failed. Status:', response.status)
      console.error('Error text:', errorText)
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Upload successful:', result)
    console.log('Upload result details:')
    console.log('- public_id:', result.public_id)
    console.log('- secure_url:', result.secure_url)
    console.log('- resource_type:', result.resource_type)
    console.log('- format:', result.format)
    console.log('- duration:', result.duration)
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      duration: result.duration,
      format: result.format
    }
  } catch (error) {
    console.error('Error uploading audio to Cloudinary:', error)
    throw error
  }
}

// Delete audio from Cloudinary
export const deleteAudioFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    })

    if (!response.ok) {
      throw new Error(`Failed to delete audio: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting audio from Cloudinary:', error)
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