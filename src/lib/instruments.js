export const instruments = [
    { value: 'banjo', name: 'Banjo', image: 'banjo.png' },
    { value: 'bells', name: 'Bells', image: 'bells.png' },
    { value: 'cello', name: 'Cello', image: 'cello.png' },
    { value: 'clarinet', name: 'Clarinet', image: 'clarinet.png' },
    { value: 'electric-guitar', name: 'Electric Guitar', image: 'electric-guitar.png' },
    { value: 'flute', name: 'Flute', image: 'flute.png' },
    { value: 'guitar', name: 'Guitar', image: 'guitar.png' },
    { value: 'harp', name: 'Harp', image: 'harp.png' },
    { value: 'horn', name: 'Horn', image: 'horn.png' },
    { value: 'mandolin', name: 'Mandolin', image: 'mandolin.png' },
    { value: 'marimba', name: 'Marimba', image: 'marimba.png' },
    { value: 'oboe', name: 'Oboe', image: 'oboe.png' },
    { value: 'organ', name: 'Organ', image: 'organ.png' },
    { value: 'percussion', name: 'Drums', image: 'percussion.png' },
    { value: 'piano', name: 'Piano', image: 'piano.png' },
    { value: 'saxophone', name: 'Saxophone', image: 'saxophone.png' },
    { value: 'trombone', name: 'Trombone', image: 'trombone.png' },
    { value: 'trumpet', name: 'Trumpet', image: 'trumpet.png' },
    { value: 'viola', name: 'Viola', image: 'viola.png' },
    { value: 'violin', name: 'Violin', image: 'violin.png' },
    { value: 'voice', name: 'Voice', image: 'voice.png' },
    { value: 'other', name: 'Other', image: 'any.png' }  
  ]

// Helper function to get instrument by value
export const getInstrumentByValue = (value) => {
  return instruments.find(instrument => instrument.value === value)
}

// Helper function to get instrument image by value
export const getInstrumentImage = (value) => {
  const instrument = getInstrumentByValue(value)
  return instrument ? instrument.image : 'theory.png'
}

// Helper function to get instrument name by value
export const getInstrumentName = (value) => {
  const instrument = getInstrumentByValue(value)
  return instrument ? instrument.name : ''
} 