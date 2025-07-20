import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '../components/HomePage.vue'

// Mock the useAuth composable
vi.mock('../composables/useAuth', () => ({
  useAuth: () => ({
    loginTeacherAccount: vi.fn(),
    loginStudentAccount: vi.fn(),
    registerTeacherAccount: vi.fn(),
    authError: { value: null },
    isLoading: { value: false },
    clearError: vi.fn()
  })
}))

// Mock the auth library
vi.mock('../lib/auth', () => ({
  registerTeacher: vi.fn(),
  USER_ROLES: {
    TEACHER: 'teacher',
    STUDENT: 'student'
  }
}))

describe('Teacher Registration Flow', () => {
  let wrapper
  let mockEmit
  let mockRegisterTeacherAccount
  let mockClearError

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Create fresh wrapper
    wrapper = mount(HomePage)
    mockEmit = vi.fn()
    wrapper.vm.$emit = mockEmit
    
    // Get mocked functions
    const { useAuth } = require('../composables/useAuth')
    const auth = useAuth()
    mockRegisterTeacherAccount = auth.registerTeacherAccount
    mockClearError = auth.clearError
  })

  it('should register teacher and prompt for login instead of auto-login', async () => {
    // Set up the registration form
    await wrapper.setData({
      activeTab: 'teacher',
      showRegisterForm: true,
      registerForm: {
        email: 'teacher@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test Teacher',
        school: 'Test School',
        instrument: 'Piano',
        experience: 'intermediate'
      }
    })

    // Mock successful registration
    mockRegisterTeacherAccount.mockResolvedValue({
      success: true,
      user: {
        email: 'teacher@test.com',
        displayName: 'Test Teacher',
        role: 'teacher'
      }
    })

    // Trigger registration
    await wrapper.vm.registerTeacher()

    // Verify registration was called
    expect(mockRegisterTeacherAccount).toHaveBeenCalledWith(
      'teacher@test.com',
      'password123',
      'Test Teacher',
      {
        school: 'Test School',
        instrument: 'Piano',
        experience: 'intermediate'
      }
    )

    // Verify success message is shown
    expect(wrapper.vm.registrationSuccess).toBe(true)

    // Verify form is cleared
    expect(wrapper.vm.registerForm).toEqual({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      school: '',
      instrument: '',
      experience: 'beginner'
    })

    // Verify registration form is hidden
    expect(wrapper.vm.showRegisterForm).toBe(false)

    // Verify login form is pre-filled with email
    expect(wrapper.vm.teacherForm.email).toBe('teacher@test.com')

    // Verify that login event is NOT emitted (no auto-login)
    expect(mockEmit).not.toHaveBeenCalledWith('login', expect.any(Object))
  })

  it('should show correct success message prompting for login', async () => {
    // Set up the registration form
    await wrapper.setData({
      activeTab: 'teacher',
      showRegisterForm: true,
      registerForm: {
        email: 'teacher@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test Teacher',
        school: 'Test School',
        instrument: 'Piano',
        experience: 'intermediate'
      }
    })

    // Mock successful registration
    mockRegisterTeacherAccount.mockResolvedValue({
      success: true,
      user: {
        email: 'teacher@test.com',
        displayName: 'Test Teacher',
        role: 'teacher'
      }
    })

    // Trigger registration
    await wrapper.vm.registerTeacher()

    // Check that success message contains login prompt
    const successMessage = wrapper.find('.bg-green-50')
    expect(successMessage.exists()).toBe(true)
    expect(successMessage.text()).toContain('Please login with your email and password')
  })

  it('should highlight email field when pre-filled from registration', async () => {
    // Set up the registration form
    await wrapper.setData({
      activeTab: 'teacher',
      showRegisterForm: true,
      registerForm: {
        email: 'teacher@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test Teacher',
        school: 'Test School',
        instrument: 'Piano',
        experience: 'intermediate'
      }
    })

    // Mock successful registration
    mockRegisterTeacherAccount.mockResolvedValue({
      success: true,
      user: {
        email: 'teacher@test.com',
        displayName: 'Test Teacher',
        role: 'teacher'
      }
    })

    // Trigger registration
    await wrapper.vm.registerTeacher()

    // Check that email field has green styling
    const emailInput = wrapper.find('#teacher-email')
    expect(emailInput.classes()).toContain('border-green-400')
    expect(emailInput.classes()).toContain('bg-green-50')

    // Check that label shows pre-filled indicator
    const emailLabel = wrapper.find('label[for="teacher-email"]')
    expect(emailLabel.text()).toContain('Pre-filled from registration')
  })

  it('should allow manual login after registration', async () => {
    // Set up the registration form
    await wrapper.setData({
      activeTab: 'teacher',
      showRegisterForm: true,
      registerForm: {
        email: 'teacher@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test Teacher',
        school: 'Test School',
        instrument: 'Piano',
        experience: 'intermediate'
      }
    })

    // Mock successful registration
    mockRegisterTeacherAccount.mockResolvedValue({
      success: true,
      user: {
        email: 'teacher@test.com',
        displayName: 'Test Teacher',
        role: 'teacher'
      }
    })

    // Trigger registration
    await wrapper.vm.registerTeacher()

    // Now simulate manual login
    const { useAuth } = require('../composables/useAuth')
    const auth = useAuth()
    const mockLoginTeacherAccount = auth.loginTeacherAccount
    mockLoginTeacherAccount.mockResolvedValue({
      success: true,
      user: {
        email: 'teacher@test.com',
        displayName: 'Test Teacher',
        role: 'teacher'
      }
    })

    // Set login form data
    await wrapper.setData({
      teacherForm: {
        email: 'teacher@test.com',
        password: 'password123'
      }
    })

    // Trigger login
    await wrapper.vm.loginTeacher()

    // Verify login was called
    expect(mockLoginTeacherAccount).toHaveBeenCalledWith('teacher@test.com', 'password123')

    // Verify login event is emitted
    expect(mockEmit).toHaveBeenCalledWith('login', expect.objectContaining({
      email: 'teacher@test.com',
      displayName: 'Test Teacher',
      role: 'teacher'
    }))
  })
}) 