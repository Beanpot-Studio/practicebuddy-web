import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateStudentLoginActivity, updateStudentPracticeActivity, getStudentActivityStatus } from '../lib/auth'

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn()
}))

// Mock error handler
vi.mock('../lib/errorHandler', () => ({
  logError: vi.fn(),
  handleFirebaseError: vi.fn(),
  createErrorResponse: vi.fn()
}))

describe('Student Activity Tracking', () => {
  let mockDoc, mockGetDoc, mockUpdateDoc

  beforeEach(async () => {
    mockDoc = vi.fn()
    mockGetDoc = vi.fn()
    mockUpdateDoc = vi.fn()
    
    const { doc, getDoc, updateDoc } = await import('firebase/firestore')
    vi.mocked(doc).mockImplementation(mockDoc)
    vi.mocked(getDoc).mockImplementation(mockGetDoc)
    vi.mocked(updateDoc).mockImplementation(mockUpdateDoc)
  })

  describe('updateStudentLoginActivity', () => {
    it('should update student login activity', async () => {
      const mockClassDoc = {
        exists: () => true,
        data: () => ({
          students: [
            {
              studentId: 'student123',
              name: 'Test Student',
              instrument: 'piano'
            }
          ]
        })
      }

      mockGetDoc.mockResolvedValue(mockClassDoc)
      mockUpdateDoc.mockResolvedValue()

      const result = await updateStudentLoginActivity('CLASS123', 'student123')

      expect(result.success).toBe(true)
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          'students.0.lastLoginAt': expect.any(String),
          'students.0.lastDashboardVisit': expect.any(String)
        })
      )
    })

    it('should handle class not found', async () => {
      const mockClassDoc = {
        exists: () => false
      }

      mockGetDoc.mockResolvedValue(mockClassDoc)

      const result = await updateStudentLoginActivity('INVALID123', 'student123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Class not found')
    })
  })

  describe('updateStudentPracticeActivity', () => {
    it('should update student practice activity', async () => {
      const mockClassDoc = {
        exists: () => true,
        data: () => ({
          students: [
            {
              studentId: 'student123',
              name: 'Test Student',
              instrument: 'piano',
              practiceMinutes: 10,
              currentWeekPracticeMinutes: 30
            }
          ]
        })
      }

      mockGetDoc.mockResolvedValue(mockClassDoc)
      mockUpdateDoc.mockResolvedValue()

      const result = await updateStudentPracticeActivity('CLASS123', 'student123', 15)

      expect(result.success).toBe(true)
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          'students.0.lastPracticeAt': expect.any(String),
          'students.0.practiceMinutes': 25,
          'students.0.currentWeekPracticeMinutes': 45
        })
      )
    })
  })

  describe('getStudentActivityStatus', () => {
    it('should return active status for recent activity', () => {
      const student = {
        lastLoginAt: new Date().toISOString(),
        lastPracticeAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        practiceMinutes: 50,
        currentWeekPracticeMinutes: 60,
        weeklyPracticeGoal: 120
      }

      const status = getStudentActivityStatus(student)

      expect(status.activityLevel).toBe('active')
      expect(status.statusColor).toBe('text-green-600')
      expect(status.statusBg).toBe('bg-green-100')
    })

    it('should return needs_attention status for no recent practice', () => {
      const student = {
        lastLoginAt: new Date().toISOString(),
        lastPracticeAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        practiceMinutes: 50,
        currentWeekPracticeMinutes: 30,
        weeklyPracticeGoal: 120
      }

      const status = getStudentActivityStatus(student)

      expect(status.activityLevel).toBe('needs_attention')
      expect(status.statusColor).toBe('text-yellow-600')
      expect(status.statusBg).toBe('bg-yellow-100')
    })

    it('should return inactive status for no recent login', () => {
      const student = {
        lastLoginAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
        lastPracticeAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
        practiceMinutes: 50,
        currentWeekPracticeMinutes: 30,
        weeklyPracticeGoal: 120
      }

      const status = getStudentActivityStatus(student)

      expect(status.activityLevel).toBe('inactive')
      expect(status.statusColor).toBe('text-red-600')
      expect(status.statusBg).toBe('bg-red-100')
    })
  })
}) 