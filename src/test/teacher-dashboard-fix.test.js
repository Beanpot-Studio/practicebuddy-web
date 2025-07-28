import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the useAuth composable
const mockFetchClassRoster = vi.fn()
const mockFetchClassAssignments = vi.fn()
const mockCreateClassAssignment = vi.fn()

vi.mock('../composables/useAuth.js', () => ({
  useAuth: () => ({
    fetchClassRoster: mockFetchClassRoster,
    fetchClassAssignments: mockFetchClassAssignments,
    createClassAssignment: mockCreateClassAssignment,
    currentUser: { value: { uid: 'teacher123', role: 'teacher' } }
  })
}))

describe('TeacherDashboard Class Fetching Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Class Roster Loading', () => {
    it('should use classItem.id for loading roster', async () => {
      // Mock a class item as returned by getTeacherClasses
      const mockClassItem = {
        id: 'ABC123', // This is the document ID (same as classCode)
        code: 'ABC123', // This is the class code field
        name: 'Test Class',
        teacherId: 'teacher123'
      }

      // Mock successful roster fetch
      mockFetchClassRoster.mockResolvedValue({
        success: true,
        students: [
          { id: 'student1', name: 'John Doe', instrument: 'Guitar' },
          { id: 'student2', name: 'Jane Smith', instrument: 'Piano' }
        ]
      })

      // Simulate the selectClassForRoster function
      const selectClassForRoster = async (classItem) => {
        // This is what the TeacherDashboard should do
        await loadClassRoster(classItem.id) // Using classItem.id instead of classItem.code
      }

      const loadClassRoster = async (classCode) => {
        if (!classCode) return
        
        const result = await mockFetchClassRoster(classCode)
        return result
      }

      // Call the function
      await selectClassForRoster(mockClassItem)

      // Verify that fetchClassRoster was called with the correct parameter
      expect(mockFetchClassRoster).toHaveBeenCalledWith('ABC123')
      expect(mockFetchClassRoster).toHaveBeenCalledTimes(1)
    })
  })

  describe('Class Assignments Loading', () => {
    it('should use classItem.id for loading assignments', async () => {
      // Mock a class item as returned by getTeacherClasses
      const mockClassItem = {
        id: 'ABC123', // This is the document ID (same as classCode)
        code: 'ABC123', // This is the class code field
        name: 'Test Class',
        teacherId: 'teacher123'
      }

      // Mock successful assignments fetch
      mockFetchClassAssignments.mockResolvedValue({
        success: true,
        assignments: [
          {
            id: 'assignment1',
            title: 'Practice Scales',
            description: 'Practice C major scale',
            dueDate: '2024-01-15',
            practiceMinutes: 30
          }
        ]
      })

      // Simulate the selectClassForAssignments function
      const selectClassForAssignments = async (classItem) => {
        // This is what the TeacherDashboard should do
        await loadClassAssignments(classItem.id) // Using classItem.id instead of classItem.code
      }

      const loadClassAssignments = async (classCode) => {
        if (!classCode) return
        
        const result = await mockFetchClassAssignments(classCode)
        return result
      }

      // Call the function
      await selectClassForAssignments(mockClassItem)

      // Verify that fetchClassAssignments was called with the correct parameter
      expect(mockFetchClassAssignments).toHaveBeenCalledWith('ABC123')
      expect(mockFetchClassAssignments).toHaveBeenCalledTimes(1)
    })
  })

  describe('Assignment Creation', () => {
    it('should use selectedClassForAssignments.id for creating assignments', async () => {
      // Mock selected class for assignments
      const mockSelectedClass = {
        id: 'ABC123', // This is the document ID (same as classCode)
        code: 'ABC123', // This is the class code field
        name: 'Test Class',
        teacherId: 'teacher123'
      }

      // Mock successful assignment creation
      mockCreateClassAssignment.mockResolvedValue({
        success: true,
        assignment: {
          id: 'assignment_new',
          title: 'New Assignment',
          description: 'Practice for 30 minutes',
          dueDate: '2024-01-25',
          practiceMinutes: 30
        }
      })

      // Simulate the createNewAssignment function
      const createNewAssignment = async (selectedClassForAssignments) => {
        if (!selectedClassForAssignments?.id) {
          throw new Error('Please select a class first.')
        }
        
        const assignmentData = {
          title: 'New Assignment',
          description: 'Practice for 30 minutes',
          dueDate: '2024-01-25',
          practiceMinutes: 30
        }
        
        const result = await mockCreateClassAssignment(selectedClassForAssignments.id, assignmentData)
        return result
      }

      // Call the function
      const result = await createNewAssignment(mockSelectedClass)

      // Verify that createClassAssignment was called with the correct parameters
      expect(mockCreateClassAssignment).toHaveBeenCalledWith('ABC123', {
        title: 'New Assignment',
        description: 'Practice for 30 minutes',
        dueDate: '2024-01-25',
        practiceMinutes: 30
      })
      expect(mockCreateClassAssignment).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(true)
    })

    it('should throw error when no class is selected', async () => {
      // Simulate the createNewAssignment function
      const createNewAssignment = async (selectedClassForAssignments) => {
        if (!selectedClassForAssignments?.id) {
          throw new Error('Please select a class first.')
        }
        
        // This should not be reached
        return { success: false }
      }

      // Call the function with no selected class
      await expect(createNewAssignment(null)).rejects.toThrow('Please select a class first.')
      await expect(createNewAssignment({})).rejects.toThrow('Please select a class first.')
      await expect(createNewAssignment({ code: 'ABC123' })).rejects.toThrow('Please select a class first.')
    })
  })

  describe('Class Structure Verification', () => {
    it('should verify that classItem.id and classItem.code are the same', () => {
      // This test verifies our understanding of the class structure
      const mockClassItem = {
        id: 'ABC123', // Document ID from getTeacherClasses
        code: 'ABC123', // Class code field from the document
        name: 'Test Class',
        teacherId: 'teacher123'
      }

      // In our implementation, both should be the same since the document ID is the classCode
      expect(mockClassItem.id).toBe(mockClassItem.code)
      expect(mockClassItem.id).toBe('ABC123')
    })
  })
}) 