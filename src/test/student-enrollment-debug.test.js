import { describe, it, expect, vi, beforeEach } from 'vitest'
import { joinClass, addStudentToClassRoster } from '../lib/auth.js'

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

describe('Student Enrollment Debug', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  describe('addStudentToClassRoster', () => {
    it('should add student to class roster successfully', async () => {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore')
      
      const mockClassCode = 'ABC123'
      const mockStudentId = 'student123'
      const mockStudentName = 'John Doe'
      const mockInstrument = 'Piano'

      // Mock existing class data
      const mockClassData = {
        name: 'Test Class',
        teacherId: 'teacher123',
        students: [
          { studentId: 'existing_student', name: 'Jane Smith', instrument: 'Guitar' }
        ],
        assignments: []
      }

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

      const result = await addStudentToClassRoster(mockClassCode, mockStudentId, mockStudentName, mockInstrument)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
        students: [
          { studentId: 'existing_student', name: 'Jane Smith', instrument: 'Guitar' },
          {
            studentId: mockStudentId,
            name: mockStudentName,
            instrument: mockInstrument,
            joinedAt: expect.any(String),
            practiceMinutes: 0,
            assignments: []
          }
        ],
        studentCount: 2,
        updatedAt: expect.any(String)
      })

      // Verify the result
      expect(result.success).toBe(true)
    })

    it('should not add duplicate student', async () => {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore')
      
      const mockClassCode = 'ABC123'
      const mockStudentId = 'student123'
      const mockStudentName = 'John Doe'
      const mockInstrument = 'Piano'

      // Mock existing class data with the student already in it
      const mockClassData = {
        name: 'Test Class',
        teacherId: 'teacher123',
        students: [
          { studentId: mockStudentId, name: mockStudentName, instrument: mockInstrument }
        ],
        assignments: []
      }

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot
      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockClassData
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await addStudentToClassRoster(mockClassCode, mockStudentId, mockStudentName, mockInstrument)

      // Verify that updateDoc was NOT called (since student already exists)
      expect(updateDoc).not.toHaveBeenCalled()

      // Verify the result
      expect(result.success).toBe(true)
    })

    it('should handle empty students array', async () => {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore')
      
      const mockClassCode = 'ABC123'
      const mockStudentId = 'student123'
      const mockStudentName = 'John Doe'
      const mockInstrument = 'Piano'

      // Mock existing class data with no students
      const mockClassData = {
        name: 'Test Class',
        teacherId: 'teacher123',
        students: [], // Empty array
        assignments: []
      }

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

      const result = await addStudentToClassRoster(mockClassCode, mockStudentId, mockStudentName, mockInstrument)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
        students: [
          {
            studentId: mockStudentId,
            name: mockStudentName,
            instrument: mockInstrument,
            joinedAt: expect.any(String),
            practiceMinutes: 0,
            assignments: []
          }
        ],
        studentCount: 1,
        updatedAt: expect.any(String)
      })

      // Verify the result
      expect(result.success).toBe(true)
    })
  })

  describe('joinClass', () => {
    it('should join class and update user document', async () => {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore')
      
      const mockClassCode = 'ABC123'
      const mockStudentId = 'student123'
      const mockStudentName = 'John Doe'
      const mockInstrument = 'Piano'

      // Mock existing class data
      const mockClassData = {
        name: 'Test Class',
        teacherId: 'teacher123',
        students: [],
        assignments: []
      }

      // Mock the document references
      const mockClassDocRef = { id: mockClassCode }
      const mockUserDocRef = { id: mockStudentId }
      doc
        .mockReturnValueOnce(mockClassDocRef) // For class document
        .mockReturnValueOnce(mockUserDocRef)  // For user document

      // Mock the class document snapshot
      const mockClassDocSnapshot = {
        exists: () => true,
        data: () => mockClassData
      }
      getDoc.mockResolvedValue(mockClassDocSnapshot)

      // Mock updateDoc
      updateDoc.mockResolvedValue()

      const result = await joinClass(mockClassCode, mockStudentId, mockStudentName, mockInstrument)

      // Verify the class document was accessed
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockClassDocRef)

      // Verify the user document was updated
      expect(doc).toHaveBeenCalledWith({}, 'users', mockStudentId)
      expect(updateDoc).toHaveBeenCalledWith(mockUserDocRef, {
        classCode: mockClassCode,
        teacherId: mockClassData.teacherId,
        updatedAt: expect.any(String)
      })

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.classData).toEqual(mockClassData)
    })

    it('should handle class not found', async () => {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore')
      
      const mockClassCode = 'INVALID123'
      const mockStudentId = 'student123'
      const mockStudentName = 'John Doe'
      const mockInstrument = 'Piano'

      // Mock the document reference
      const mockDocRef = { id: mockClassCode }
      doc.mockReturnValue(mockDocRef)

      // Mock the document snapshot for non-existent class
      const mockDocSnapshot = {
        exists: () => false,
        data: () => null
      }
      getDoc.mockResolvedValue(mockDocSnapshot)

      const result = await joinClass(mockClassCode, mockStudentId, mockStudentName, mockInstrument)

      // Verify the function was called with correct parameters
      expect(doc).toHaveBeenCalledWith({}, 'classes', mockClassCode)
      expect(getDoc).toHaveBeenCalledWith(mockDocRef)

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.error).toBe('Class not found. Please check your class code.')
    })
  })
}) 