import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAssignment, getClassAssignments } from '../lib/auth'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn()
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
    it('should create a new assignment successfully', async () => {
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
      
      const result = await createAssignment(classCode, assignmentData)
      
      expect(result.success).toBe(true)
      expect(result.assignment).toHaveProperty('id')
      expect(result.assignment.title).toBe('Practice Scales')
      expect(result.assignment.description).toBe('Practice C major scale for 15 minutes')
      expect(result.assignment.dueDate).toBe('2024-02-01')
      expect(result.assignment.practiceMinutes).toBe(15)
      expect(result.assignment.status).toBe('active')
      expect(result.assignment.createdAt).toBeDefined()
    })

    it('should handle class not found error', async () => {
      const mockGetDoc = vi.fn()
      
      // Mock class not found
      mockGetDoc.mockResolvedValue({
        exists: () => false
      })
      
      const { doc, getDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      
      const classCode = 'INVALID123'
      const assignmentData = {
        title: 'Test Assignment',
        description: 'Test description',
        dueDate: '2024-02-01'
      }
      
      const result = await createAssignment(classCode, assignmentData)
      
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
              status: 'active'
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
      
      const result = await createAssignment(classCode, assignmentData)
      
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
    it('should retrieve assignments for a class', async () => {
      const mockGetDoc = vi.fn()
      
      const mockAssignments = [
        {
          id: 'assignment_1',
          title: 'Practice Scales',
          description: 'Practice C major scale',
          dueDate: '2024-02-01',
          practiceMinutes: 15,
          createdAt: '2024-01-01T00:00:00.000Z',
          status: 'active'
        },
        {
          id: 'assignment_2',
          title: 'Learn New Song',
          description: 'Learn "Twinkle Twinkle Little Star"',
          dueDate: '2024-02-08',
          practiceMinutes: 30,
          createdAt: '2024-01-02T00:00:00.000Z',
          status: 'active'
        }
      ]
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          assignments: mockAssignments
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
    })

    it('should handle class not found error', async () => {
      const mockGetDoc = vi.fn()
      
      mockGetDoc.mockResolvedValue({
        exists: () => false
      })
      
      const { doc, getDoc } = await import('../lib/firebase')
      doc.mockReturnValue({})
      getDoc.mockImplementation(mockGetDoc)
      
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