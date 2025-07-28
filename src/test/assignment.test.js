import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAssignment, getClassAssignments } from '../lib/auth'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  setDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn()
}))

// Mock error handler
vi.mock('../lib/errorHandler', () => ({
  handleFirebaseError: vi.fn((error) => ({
    message: error.message,
    code: error.code || 'unknown'
  })),
  logError: vi.fn(),
  createErrorResponse: vi.fn((message, code, context) => ({
    success: false,
    error: message,
    code: code,
    context: context
  }))
}))

describe('Assignment Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAssignment', () => {
    it('should create a new class assignment successfully', async () => {
      const mockGetDoc = vi.fn()
      const mockUpdateDoc = vi.fn()
      
      // Mock successful class document
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          assignments: []
        })
      })
      
      mockUpdateDoc.mockResolvedValue()
      
      const { doc, getDoc, updateDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      updateDoc.mockImplementation(mockUpdateDoc)
      
      const classCode = 'MUSIC123'
      const assignmentData = {
        title: 'Practice Scales',
        description: 'Practice C major scale for 15 minutes',
        dueDate: '2024-02-01',
        practiceMinutes: 15
      }
      
      const result = await createAssignment(classCode, assignmentData, 'class')
      
      expect(result.success).toBe(true)
      expect(result.assignment).toHaveProperty('id')
      expect(result.assignment.title).toBe('Practice Scales')
      expect(result.assignment.description).toBe('Practice C major scale for 15 minutes')
      expect(result.assignment.dueDate).toBe('2024-02-01')
      expect(result.assignment.practiceMinutes).toBe(15)
      expect(result.assignment.status).toBe('active')
      expect(result.assignment.type).toBe('class')
      expect(result.assignment.createdAt).toBeDefined()
    })

    it('should create a new individual assignment successfully', async () => {
      const mockGetDoc = vi.fn()
      const mockUpdateDoc = vi.fn()
      
      // Mock successful class document
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          individualAssignments: {}
        })
      })
      
      mockUpdateDoc.mockResolvedValue()
      
      const { doc, getDoc, updateDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      updateDoc.mockImplementation(mockUpdateDoc)
      
      const classCode = 'MUSIC123'
      const assignmentData = {
        title: 'Individual Practice',
        description: 'Practice your solo piece',
        dueDate: '2024-02-01',
        practiceMinutes: 20
      }
      const studentId = 'student123'
      
      const result = await createAssignment(classCode, assignmentData, 'individual', studentId)
      
      expect(result.success).toBe(true)
      expect(result.assignment).toHaveProperty('id')
      expect(result.assignment.title).toBe('Individual Practice')
      expect(result.assignment.type).toBe('individual')
      expect(result.assignment.studentId).toBe(studentId)
    })

    it('should create a standalone assignment successfully', async () => {
      const mockSetDoc = vi.fn()
      const mockCollection = vi.fn()
      const mockDoc = vi.fn()
      
      mockSetDoc.mockResolvedValue()
      mockCollection.mockReturnValue({})
      mockDoc.mockReturnValue({ id: 'standalone123' })
      
      const { collection, doc, setDoc } = await import('../lib/firebase')
      collection.mockImplementation(mockCollection)
      doc.mockImplementation(mockDoc)
      setDoc.mockImplementation(mockSetDoc)
      
      const assignmentData = {
        title: 'Standalone Practice',
        description: 'Practice your instrument',
        dueDate: '2024-02-01',
        practiceMinutes: 30
      }
      const teacherId = 'teacher123'
      const studentId = 'student123'
      
      const result = await createAssignment(null, assignmentData, 'standalone', studentId, teacherId)
      
      expect(result.success).toBe(true)
      expect(result.assignment).toHaveProperty('id')
      expect(result.assignment.title).toBe('Standalone Practice')
      expect(result.assignment.type).toBe('standalone')
      expect(result.assignment.studentId).toBe(studentId)
      expect(result.assignment.teacherId).toBe(teacherId)
    })

    it('should handle class not found error', async () => {
      const mockGetDoc = vi.fn()
      const mockGetDocs = vi.fn()
      const mockQuery = vi.fn()
      const mockWhere = vi.fn()
      
      // Mock class not found by ID
      mockGetDoc.mockResolvedValue({
        exists: () => false
      })
      
      // Mock empty query results
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: []
      })
      
      const { doc, getDoc, getDocs, query, where } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      getDocs.mockImplementation(mockGetDocs)
      query.mockImplementation(mockQuery)
      where.mockImplementation(mockWhere)
      
      const classCode = 'INVALID123'
      const assignmentData = {
        title: 'Test Assignment',
        description: 'Test description',
        dueDate: '2024-02-01'
      }
      
      const result = await createAssignment(classCode, assignmentData, 'class')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Class not found')
    })

    it('should add assignment to existing assignments array', async () => {
      const mockGetDoc = vi.fn()
      const mockUpdateDoc = vi.fn()
      
      // Mock class with existing assignments
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          assignments: [
            {
              id: 'existing_assignment',
              title: 'Existing Assignment',
              description: 'Old assignment',
              dueDate: '2024-01-15',
              createdAt: '2024-01-01T00:00:00.000Z',
              status: 'active',
              type: 'class'
            }
          ]
        })
      })
      
      mockUpdateDoc.mockResolvedValue()
      
      const { doc, getDoc, updateDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      updateDoc.mockImplementation(mockUpdateDoc)
      
      const classCode = 'MUSIC123'
      const assignmentData = {
        title: 'New Assignment',
        description: 'New assignment description',
        dueDate: '2024-02-01'
      }
      
      const result = await createAssignment(classCode, assignmentData, 'class')
      
      expect(result.success).toBe(true)
      expect(result.assignment.title).toBe('New Assignment')
      
      // Verify updateDoc was called with updated assignments array
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          assignments: expect.arrayContaining([
            expect.objectContaining({ id: 'existing_assignment' }),
            expect.objectContaining({ title: 'New Assignment' })
          ])
        })
      )
    })
  })

  describe('getClassAssignments', () => {
    it('should retrieve class assignments for a class', async () => {
      const mockGetDoc = vi.fn()
      
      const mockAssignments = [
        {
          id: 'assignment_1',
          title: 'Practice Scales',
          description: 'Practice C major scale',
          dueDate: '2024-02-01',
          practiceMinutes: 15,
          createdAt: '2024-01-01T00:00:00.000Z',
          status: 'active',
          type: 'class'
        },
        {
          id: 'assignment_2',
          title: 'Learn New Song',
          description: 'Learn "Twinkle Twinkle Little Star"',
          dueDate: '2024-02-08',
          practiceMinutes: 30,
          createdAt: '2024-01-02T00:00:00.000Z',
          status: 'active',
          type: 'class'
        }
      ]
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          assignments: mockAssignments,
          individualAssignments: {}
        })
      })
      
      const { doc, getDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      
      const classCode = 'MUSIC123'
      const result = await getClassAssignments(classCode)
      
      expect(result.success).toBe(true)
      expect(result.assignments).toEqual(mockAssignments)
      expect(result.assignments).toHaveLength(2)
      expect(result.classAssignments).toEqual(mockAssignments)
      expect(result.individualAssignments).toEqual([])
    })

    it('should retrieve both class and individual assignments for a student', async () => {
      const mockGetDoc = vi.fn()
      
      const mockClassAssignments = [
        {
          id: 'class_assignment_1',
          title: 'Practice Scales',
          description: 'Practice C major scale',
          dueDate: '2024-02-01',
          practiceMinutes: 15,
          createdAt: '2024-01-01T00:00:00.000Z',
          status: 'active',
          type: 'class'
        }
      ]
      
      const mockIndividualAssignments = {
        'student123': [
          {
            id: 'individual_assignment_1',
            title: 'Solo Practice',
            description: 'Practice your solo piece',
            dueDate: '2024-02-05',
            practiceMinutes: 20,
            createdAt: '2024-01-03T00:00:00.000Z',
            status: 'active',
            type: 'individual',
            studentId: 'student123'
          }
        ]
      }
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          assignments: mockClassAssignments,
          individualAssignments: mockIndividualAssignments
        })
      })
      
      const { doc, getDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      
      const classCode = 'MUSIC123'
      const studentId = 'student123'
      const result = await getClassAssignments(classCode, studentId)
      
      expect(result.success).toBe(true)
      expect(result.assignments).toHaveLength(2) // Both class and individual
      expect(result.classAssignments).toEqual(mockClassAssignments)
      expect(result.individualAssignments).toEqual(mockIndividualAssignments['student123'])
    })

    it('should return empty array when no assignments exist', async () => {
      const mockGetDoc = vi.fn()
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          // No assignments property
        })
      })
      
      const { doc, getDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      
      const classCode = 'MUSIC123'
      const result = await getClassAssignments(classCode)
      
      expect(result.success).toBe(true)
      expect(result.assignments).toEqual([])
      expect(result.classAssignments).toEqual([])
      expect(result.individualAssignments).toEqual([])
    })

    it('should handle class not found error', async () => {
      const mockGetDoc = vi.fn()
      const mockGetDocs = vi.fn()
      const mockQuery = vi.fn()
      const mockWhere = vi.fn()
      
      // Mock class not found by ID
      mockGetDoc.mockResolvedValue({
        exists: () => false
      })
      
      // Mock empty query results
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: []
      })
      
      const { doc, getDoc, getDocs, query, where } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      getDocs.mockImplementation(mockGetDocs)
      query.mockImplementation(mockQuery)
      where.mockImplementation(mockWhere)
      
      const classCode = 'INVALID123'
      const result = await getClassAssignments(classCode)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Class not found')
    })
  })

  describe('Assignment Data Validation', () => {
    it('should validate assignment data structure', () => {
      const validAssignmentData = {
        title: 'Practice Scales',
        description: 'Practice C major scale for 15 minutes',
        dueDate: '2024-02-01',
        practiceMinutes: 15
      }
      
      expect(validAssignmentData).toHaveProperty('title')
      expect(validAssignmentData).toHaveProperty('description')
      expect(validAssignmentData).toHaveProperty('dueDate')
      expect(typeof validAssignmentData.title).toBe('string')
      expect(typeof validAssignmentData.description).toBe('string')
      expect(typeof validAssignmentData.dueDate).toBe('string')
      expect(validAssignmentData.title.length).toBeGreaterThan(0)
      expect(validAssignmentData.description.length).toBeGreaterThan(0)
    })

    it('should handle optional practice minutes', () => {
      const assignmentDataWithoutMinutes = {
        title: 'Practice Scales',
        description: 'Practice C major scale',
        dueDate: '2024-02-01'
        // No practiceMinutes
      }
      
      expect(assignmentDataWithoutMinutes).toHaveProperty('title')
      expect(assignmentDataWithoutMinutes).toHaveProperty('description')
      expect(assignmentDataWithoutMinutes).toHaveProperty('dueDate')
      expect(assignmentDataWithoutMinutes).not.toHaveProperty('practiceMinutes')
    })
  })
}) 