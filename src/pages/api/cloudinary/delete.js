// API route for secure Cloudinary deletion
export async function POST({ request }) {
  try {
    const { publicId } = await request.json()
    
    if (!publicId) {
      return new Response(JSON.stringify({ error: 'publicId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get environment variables for Cloudinary credentials
    const apiKey = import.meta.env.CLOUDINARY_API_KEY
    const apiSecret = import.meta.env.CLOUDINARY_API_SECRET
    const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME

    if (!apiKey || !apiSecret || !cloudName) {
      return new Response(JSON.stringify({ error: 'Cloudinary credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create signature for deletion
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await createSignature({
      public_id: publicId,
      resource_type: 'video',
      timestamp: timestamp.toString()
    }, apiSecret)

    // Delete from Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/video/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_id: publicId,
        resource_type: 'video',
        timestamp: timestamp,
        signature: signature
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: `Cloudinary deletion failed: ${errorText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in Cloudinary delete API:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Create signature for Cloudinary API
async function createSignature(params, apiSecret) {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {})

  // Build string to sign
  const stringToSign = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  // Create SHA-1 signature
  const encoder = new TextEncoder()
  const data = encoder.encode(stringToSign + apiSecret)
  
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
} 