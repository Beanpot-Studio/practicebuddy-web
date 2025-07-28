import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getClassRoster, getClassAssignments, createAssignment } from '../lib/auth.js'

// Mock Firebase
vi.mock('../lib/firebase.js', () => ({
  db: {},
  auth: {},
  storage: {}
}))

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn()
}))

// Mock error handler
vi.mock('../lib/errorHandler.js', () => ({
  logError: vi.fn(),
  handleFirebaseError: vi.fn((error) => ({ message: error.message, code: 'test-error' })),
  createErrorResponse: vi.fn((message, code, context) => ({ success: false, error: message, code, context }))
}))

describe('Class Fetching with ClassCode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClassRoster', () => {
    it('should fetch class roster using classCode', async () => {
      const mockClassCode = 'ABC123'
      const mockClassData = {
        name: 'Test Class',
        students: [
          { id: 'student1', name: 'John Doe', instrument: 'Guitar' },
          { id: 'student2', name: 'Jane Smith', instrument: 'Piano' }
        ]
      }

      // Import the mocked functions
      const { doc, getDoc } = await import('firebase/firestore')

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot
      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockClassData
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await getClassRoster(mockClassCode)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.students).toEqual(mockClassData.students)
    })

    it('should return error when class not found', async () => {
      const mockClassCode = 'INVALID123'

      // Import the mocked functions
      const { doc, getDoc } = await import('firebase/firestore')

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot for non-existent class
      const mockDocSnapshot = {
        exists: () => false,
        data: () => null
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await getClassRoster(mockClassCode)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.error).toBe('Class not found')
    })
  })

  describe('getClassAssignments', () => {
    it('should fetch class assignments using classCode', async () => {
      const mockClassCode = 'ABC123'
      const mockClassData = {
        name: 'Test Class',
        assignments: [
          {
            id: 'assignment1',
            title: 'Practice Scales',
            description: 'Practice C major scale',
            dueDate: '2024-01-15',
            practiceMinutes: 30
          },
          {
            id: 'assignment2',
            title: 'Learn New Song',
            description: 'Learn "Twinkle Twinkle Little Star"',
            dueDate: '2024-01-20',
            practiceMinutes: 45
          }
        ]
      }

      // Import the mocked functions
      const { doc, getDoc } = await import('firebase/firestore')

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot
      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockClassData
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await getClassAssignments(mockClassCode)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.assignments).toEqual(mockClassData.assignments)
    })

    it('should return error when class not found', async () => {
      const mockClassCode = 'INVALID123'

      // Import the mocked functions
      const { doc, getDoc } = await import('firebase/firestore')

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot for non-existent class
      const mockDocSnapshot = {
        exists: () => false,
        data: () => null
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await getClassAssignments(mockClassCode)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.error).toBe('Class not found')
    })
  })

  describe('createAssignment', () => {
    it('should create assignment using classCode', async () => {
      const mockClassCode = 'ABC123'
      const mockAssignmentData = {
        title: 'New Assignment',
        description: 'Practice for 30 minutes',
        dueDate: '2024-01-25',
        practiceMinutes: 30
      }

      const mockClassData = {
        name: 'Test Class',
        assignments: []
      }

      // Import the mocked functions
      const { doc, getDoc, updateDoc } = await import('firebase/firestore')

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot
      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockClassData
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      // Mock updateDoc
      updateDoc.mockResolvedValue()

      const result = await createAssignment(mockClassCode, mockAssignmentData)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)
      expect(updateDoc).toHaveBeenCalled()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.assignment).toHaveProperty('id')
      expect(result.assignment.title).toBe(mockAssignmentData.title)
      expect(result.assignment.description).toBe(mockAssignmentData.description)
      expect(result.assignment.dueDate).toBe(mockAssignmentData.dueDate)
      expect(result.assignment.practiceMinutes).toBe(mockAssignmentData.practiceMinutes)
      expect(result.assignment.status).toBe('active')
    })

    it('should return error when class not found', async () => {
      const mockClassCode = 'INVALID123'
      const mockAssignmentData = {
        title: 'New Assignment',
        description: 'Practice for 30 minutes',
        dueDate: '2024-01-25',
        practiceMinutes: 30
      }

      // Import the mocked functions
      const { doc, getDoc } = await import('firebase/firestore')

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot for non-existent class
      const mockDocSnapshot = {
        exists: () => false,
        data: () => null
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await createAssignment(mockClassCode, mockAssignmentData)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.error).toBe('Class not found')
    })
  })
}) 