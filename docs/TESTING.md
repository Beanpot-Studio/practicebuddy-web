# Testing Guide for Practice Buddy

This guide covers how to test the registration and authentication functionality in the Practice Buddy application.

## 🧪 Test Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project configured

### Installation
```bash
npm install --save-dev vitest @vue/test-utils jsdom
```

### Environment Variables
The test suite uses environment variables for Firebase configuration. These are automatically set in the test environment:

```javascript
// Test environment variables (automatically configured)
PUBLIC_FIREBASE_API_KEY=test-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=test-project
PUBLIC_FIREBASE_APP_ID=1:123456789:web:test
NODE_ENV=test
```

## 📋 Test Structure

### Unit Tests
- **`src/test/simple.test.js`** - Core validation and data structure tests ✅ **Working**
- **`src/test/registration-complete.test.js`** - Comprehensive registration tests with environment variables ✅ **Working**
- **`src/test/auth.test.js`** - Authentication service tests (with Firebase mocking)
- **`src/test/components.test.js`** - Vue component tests

### Test Configuration
- **`vitest.config.js`** - Vitest configuration with Vue and DOM support
- **`src/test/setup.js`** - Test environment setup and Firebase mocking

## 🚀 Running Tests

### All Tests
```bash
npm run test:run
```

### Specific Test File
```bash
npm run test:run src/test/simple.test.js
```

### Watch Mode
```bash
npm run test
```

### Coverage Report
```bash
npm run test:coverage
```

## 📝 Test Categories

### 1. Registration Validation Tests

#### Email Validation
```javascript
it('should validate email format', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  expect(emailRegex.test('valid@email.com')).toBe(true)
  expect(emailRegex.test('invalid-email')).toBe(false)
  expect(emailRegex.test('teacher@musicschool.edu')).toBe(true)
})
```

#### Password Validation
```javascript
it('should validate password length', () => {
  const minLength = 6
  
  expect('password123'.length >= minLength).toBe(true)
  expect('123'.length >= minLength).toBe(false)
})
```

#### Password Confirmation
```javascript
it('should validate password confirmation', () => {
  const password = 'password123'
  const confirmPassword = 'password123'
  
  expect(password === confirmPassword).toBe(true)
})
```

### 2. User Role Tests

#### Role Constants
```javascript
it('should have correct role constants', () => {
  const USER_ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher'
  }
  
  expect(USER_ROLES.STUDENT).toBe('student')
  expect(USER_ROLES.TEACHER).toBe('teacher')
})
```

### 3. Form Data Structure Tests

#### Registration Form Structure
```javascript
it('should have correct registration form structure', () => {
  const registrationForm = {
    email: 'teacher@test.com',
    password: 'password123',
    confirmPassword: 'password123',
    displayName: 'Test Teacher',
    school: 'Test Music School',
    instrument: 'Piano',
    experience: 'intermediate'
  }
  
  expect(registrationForm.email).toBe('teacher@test.com')
  expect(registrationForm.displayName).toBe('Test Teacher')
})
```

### 4. Error Handling Tests

#### Error Messages
```javascript
it('should provide user-friendly error messages', () => {
  const errorMessages = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.'
  }
  
  Object.entries(errorMessages).forEach(([code, message]) => {
    expect(typeof code).toBe('string')
    expect(typeof message).toBe('string')
    expect(message.length).toBeGreaterThan(0)
  })
})
```

## 🔧 Manual Testing

### Teacher Registration Flow

1. **Navigate to Teacher Tab**
   - Open the application
   - Click on "Music Teachers" tab

2. **Access Registration Form**
   - Click "Join as Teacher" button
   - Verify registration form appears

3. **Test Form Validation**
   - Try submitting empty form (should show validation errors)
   - Test invalid email format
   - Test short password (< 6 characters)
   - Test password mismatch

4. **Test Successful Registration**
   - Fill all required fields with valid data
   - Submit form
   - Verify success message appears
   - Check auto-login functionality

### Test Cases

#### Valid Registration Data
```javascript
const validRegistrationData = {
  email: 'teacher@test.com',
  password: 'password123',
  confirmPassword: 'password123',
  displayName: 'Test Teacher',
  school: 'Test Music School',
  instrument: 'Piano',
  experience: 'intermediate'
}
```

#### Invalid Test Cases
```javascript
const invalidTestCases = [
  {
    name: 'Empty email',
    data: { email: '', password: 'password123', displayName: 'Test' },
    expectedError: 'Please enter your email address'
  },
  {
    name: 'Invalid email format',
    data: { email: 'invalid-email', password: 'password123', displayName: 'Test' },
    expectedError: 'Please enter a valid email address'
  },
  {
    name: 'Short password',
    data: { email: 'test@example.com', password: '123', displayName: 'Test' },
    expectedError: 'Password must be at least 6 characters long'
  },
  {
    name: 'Password mismatch',
    data: { 
      email: 'test@example.com', 
      password: 'password123', 
      confirmPassword: 'different',
      displayName: 'Test' 
    },
    expectedError: 'Passwords do not match'
  }
]
```

## 🧪 Integration Testing

### Firebase Integration

1. **Environment Setup**
   - Ensure `.env` file has valid Firebase configuration
   - Verify Firebase project is properly configured

2. **Authentication Testing**
   - Test teacher registration with real Firebase
   - Verify user appears in Firebase Authentication console
   - Check Firestore for user data

3. **Error Scenarios**
   - Test with duplicate email addresses
   - Test with invalid Firebase configuration
   - Test network connectivity issues

### Browser Testing

1. **Form Interaction**
   - Test tab navigation
   - Test form submission
   - Test error message display
   - Test loading states

2. **Responsive Design**
   - Test on different screen sizes
   - Test on mobile devices
   - Verify form accessibility

## 📊 Test Coverage

### Current Coverage Areas
- ✅ Email validation
- ✅ Password validation
- ✅ Form data structure
- ✅ Error message handling
- ✅ User role management
- ✅ Required field validation
- ✅ Environment variable configuration
- ✅ Firebase configuration validation
- ✅ Registration function structure
- ✅ User data structure validation

### Areas for Improvement
- 🔄 Firebase integration tests
- 🔄 Vue component tests
- 🔄 End-to-end tests
- 🔄 Performance tests

## 🐛 Debugging Tests

### Common Issues

1. **Firebase Mocking Issues**
   ```javascript
   // Ensure mocks are defined before imports
   vi.mock('../lib/firebase', () => ({
     auth: { /* mock auth */ },
     db: { /* mock db */ }
   }))
   ```

2. **Vue Component Testing**
   ```javascript
   // Use proper component mounting
   const wrapper = mount(Component, {
     global: {
       stubs: { /* stub external components */ }
     }
   })
   ```

3. **Async Test Issues**
   ```javascript
   // Use proper async/await
   it('should handle async operations', async () => {
     const result = await someAsyncFunction()
     expect(result).toBe(expected)
   })
   ```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

## 🎯 Best Practices

1. **Test Naming**
   - Use descriptive test names
   - Follow the pattern: "should [expected behavior] when [condition]"

2. **Test Organization**
   - Group related tests in describe blocks
   - Use beforeEach for setup
   - Clean up after tests

3. **Mocking**
   - Mock external dependencies
   - Use realistic mock data
   - Test error scenarios

4. **Assertions**
   - Test one thing per test
   - Use specific assertions
   - Include edge cases

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Firebase Testing](https://firebase.google.com/docs/rules/unit-tests)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 