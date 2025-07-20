import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HomePage from '../components/HomePage.vue'

// Mock the useAuth composable
const mockUseAuth = vi.fn()
vi.mock('../composables/useAuth', () => ({
  useAuth: mockUseAuth
}))

// Mock lucide icons
vi.mock('lucide-vue-next', () => ({
  Users: { template: '<div>Users</div>' },
  GraduationCap: { template: '<div>GraduationCap</div>' },
  Play: { template: '<div>Play</div>' },
  BookOpen: { template: '<div>BookOpen</div>' },
  Music: { template: '<div>Music</div>' },
  Clock: { template: '<div>Clock</div>' },
  Mic: { template: '<div>Mic</div>' },
  Star: { template: '<div>Star</div>' },
  Trophy: { template: '<div>Trophy</div>' },
  Headphones: { template: '<div>Headphones</div>' },
  Award: { template: '<div>Award</div>' },
  BarChart3: { template: '<div>BarChart3</div>' }
}))

// Mock Footer component
vi.mock('../components/Footer.vue', () => ({
  default: { template: '<div>Footer</div>' }
}))

describe('HomePage Component', () => {
  let wrapper
  let mockAuth

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Setup mock auth
    mockAuth = {
      loginTeacherAccount: vi.fn(),
      loginStudentAccount: vi.fn(),
      registerTeacherAccount: vi.fn(),
      authError: { value: null },
      isLoading: { value: false },
      clearError: vi.fn()
    }

    mockUseAuth.mockReturnValue(mockAuth)

    // Mount component
    wrapper = mount(HomePage, {
      global: {
        stubs: {
          'lucide-vue-next': true,
          Footer: true
        }
      }
    })
  })

  describe('Initial State', () => {
    it('should render with student tab active by default', () => {
      expect(wrapper.find('[data-testid="student-tab"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="teacher-tab"]').exists()).toBe(true)
    })

    it('should show demo mode indicator when in demo mode', () => {
      // Mock demo mode
      vi.stubEnv('PUBLIC_FIREBASE_API_KEY', 'demo-api-key')
      
      const demoWrapper = mount(HomePage, {
        global: {
          stubs: {
            'lucide-vue-next': true,
            Footer: true
          }
        }
      })

      expect(demoWrapper.text()).toContain('Demo Mode')
    })
  })

  describe('Tab Switching', () => {
    it('should switch to teacher tab when clicked', async () => {
      const teacherTab = wrapper.find('[data-testid="teacher-tab"]')
      await teacherTab.trigger('click')
      await nextTick()

      expect(wrapper.vm.activeTab).toBe('teacher')
    })

    it('should switch to student tab when clicked', async () => {
      // First switch to teacher tab
      await wrapper.setData({ activeTab: 'teacher' })
      
      const studentTab = wrapper.find('[data-testid="student-tab"]')
      await studentTab.trigger('click')
      await nextTick()

      expect(wrapper.vm.activeTab).toBe('student')
    })
  })

  describe('Teacher Registration', () => {
    beforeEach(async () => {
      // Switch to teacher tab
      await wrapper.setData({ activeTab: 'teacher' })
      await nextTick()
    })

    it('should show registration form when "Join as Teacher" is clicked', async () => {
      const registerButton = wrapper.find('button:contains("Join as Teacher")')
      await registerButton.trigger('click')
      await nextTick()

      expect(wrapper.vm.showRegisterForm).toBe(true)
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('should validate required fields', async () => {
      // Show registration form
      await wrapper.setData({ showRegisterForm: true })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.registerTeacherAccount).not.toHaveBeenCalled()
    })

    it('should validate password length', async () => {
      await wrapper.setData({ 
        showRegisterForm: true,
        registerForm: {
          email: 'test@example.com',
          password: '123',
          confirmPassword: '123',
          displayName: 'Test Teacher'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.registerTeacherAccount).not.toHaveBeenCalled()
      expect(wrapper.vm.authError).toBe('Password must be at least 6 characters long')
    })

    it('should validate password confirmation', async () => {
      await wrapper.setData({ 
        showRegisterForm: true,
        registerForm: {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'different',
          displayName: 'Test Teacher'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.registerTeacherAccount).not.toHaveBeenCalled()
      expect(wrapper.vm.authError).toBe('Passwords do not match')
    })

    it('should validate email format', async () => {
      await wrapper.setData({ 
        showRegisterForm: true,
        registerForm: {
          email: 'invalid-email',
          password: 'password123',
          confirmPassword: 'password123',
          displayName: 'Test Teacher'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.registerTeacherAccount).not.toHaveBeenCalled()
      expect(wrapper.vm.authError).toBe('Please enter a valid email address')
    })

    it('should successfully register with valid data', async () => {
      const mockResult = {
        success: true,
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test Teacher',
          role: 'teacher'
        }
      }

      mockAuth.registerTeacherAccount.mockResolvedValue(mockResult)

      await wrapper.setData({ 
        showRegisterForm: true,
        registerForm: {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          displayName: 'Test Teacher',
          school: 'Test School',
          instrument: 'Piano',
          experience: 'intermediate'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.registerTeacherAccount).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test Teacher',
        {
          school: 'Test School',
          instrument: 'Piano',
          experience: 'intermediate'
        }
      )

      expect(wrapper.vm.registrationSuccess).toBe(true)
    })

    it('should handle registration errors', async () => {
      const mockResult = {
        success: false,
        error: 'Email already in use'
      }

      mockAuth.registerTeacherAccount.mockResolvedValue(mockResult)

      await wrapper.setData({ 
        showRegisterForm: true,
        registerForm: {
          email: 'existing@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          displayName: 'Test Teacher'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(wrapper.vm.registrationSuccess).toBe(false)
    })
  })

  describe('Student Login', () => {
    beforeEach(async () => {
      await wrapper.setData({ activeTab: 'student' })
      await nextTick()
    })

    it('should validate student login form', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.loginStudentAccount).not.toHaveBeenCalled()
    })

    it('should successfully login student with valid data', async () => {
      const mockResult = {
        success: true,
        user: {
          uid: 'student-uid',
          name: 'Test Student',
          role: 'student'
        }
      }

      mockAuth.loginStudentAccount.mockResolvedValue(mockResult)

      await wrapper.setData({
        studentForm: {
          name: 'Test Student',
          classCode: 'CLASS123'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.loginStudentAccount).toHaveBeenCalledWith(
        'Test Student',
        'CLASS123'
      )
    })
  })

  describe('Teacher Login', () => {
    beforeEach(async () => {
      await wrapper.setData({ activeTab: 'teacher' })
      await nextTick()
    })

    it('should validate teacher login form', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.loginTeacherAccount).not.toHaveBeenCalled()
    })

    it('should successfully login teacher with valid data', async () => {
      const mockResult = {
        success: true,
        user: {
          uid: 'teacher-uid',
          email: 'teacher@example.com',
          role: 'teacher'
        }
      }

      mockAuth.loginTeacherAccount.mockResolvedValue(mockResult)

      await wrapper.setData({
        teacherForm: {
          email: 'teacher@example.com',
          password: 'password123'
        }
      })
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(mockAuth.loginTeacherAccount).toHaveBeenCalledWith(
        'teacher@example.com',
        'password123'
      )
    })
  })

  describe('Error Handling', () => {
    it('should display auth errors', async () => {
      mockAuth.authError.value = 'Test error message'
      
      const errorWrapper = mount(HomePage, {
        global: {
          stubs: {
            'lucide-vue-next': true,
            Footer: true
          }
        }
      })

      expect(errorWrapper.text()).toContain('Test error message')
    })

    it('should clear errors when switching tabs', async () => {
      const studentTab = wrapper.find('[data-testid="student-tab"]')
      await studentTab.trigger('click')

      expect(mockAuth.clearError).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading state during registration', async () => {
      mockAuth.isLoading.value = true
      
      const loadingWrapper = mount(HomePage, {
        global: {
          stubs: {
            'lucide-vue-next': true,
            Footer: true
          }
        }
      })

      expect(loadingWrapper.text()).toContain('Loading')
    })
  })
}) 