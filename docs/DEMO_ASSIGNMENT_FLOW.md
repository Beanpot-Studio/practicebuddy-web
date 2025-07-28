# 🎵 Assignment Functionality Demo Guide

## 🚀 **Quick Start: Test Assignment Creation**

### **Step 1: Access the Application**
1. Open your browser and go to: `http://localhost:4322/`
2. The PracticeBuddy application should be running

### **Step 2: Teacher Account Setup**
1. **Register as a Teacher:**
   - Click "Register" or "Sign Up"
   - Select "Teacher" role
   - Fill in your details:
     - Email: `teacher@demo.com`
     - Password: `demo123`
     - Name: `Demo Teacher`
   - Complete registration

2. **Create a Class:**
   - In Teacher Dashboard, click "➕ Create Class" tab
   - Fill in class details:
     - Name: `Piano Beginners`
     - Description: `Introduction to piano playing`
     - Instrument: `Piano`
     - Level: `Beginner`
     - Schedule: `Mondays 3-4 PM`
   - Click "Create Class"
   - **Note the Class Code** (e.g., `ABC123`)

### **Step 3: Student Enrollment**
1. **Register as a Student:**
   - Open a new incognito window
   - Go to `http://localhost:4322/`
   - Click "Register" and select "Student"
   - Fill in details:
     - Email: `student@demo.com`
     - Password: `demo123`
     - Name: `Demo Student`
   - Complete registration

2. **Join the Class:**
   - In Student Dashboard, find the "Join Class" section
   - Enter the class code from Step 2 (e.g., `ABC123`)
   - Click "Join Class"
   - You should see a success message

### **Step 4: Create Assignments (Teacher)**
1. **Navigate to Assignments:**
   - Go back to Teacher Dashboard
   - Click "📚 Assignments" tab

2. **Select Class:**
   - Click on your created class card
   - It should highlight to show it's selected

3. **Create Assignment:**
   - Fill in the assignment form:
     - **Title**: `Practice C Major Scale`
     - **Due Date**: Select a future date
     - **Description**: `Practice the C major scale for 15 minutes daily. Focus on proper finger positioning and smooth transitions.`
     - **Practice Minutes**: `15`
   - Click "Create Assignment"
   - You should see a success message and the assignment appear in the list below

4. **Create Another Assignment:**
   - **Title**: `Learn "Twinkle Twinkle Little Star"`
   - **Due Date**: Select a date 1 week later
   - **Description**: `Learn to play "Twinkle Twinkle Little Star" with both hands. Practice slowly and focus on accuracy.`
   - **Practice Minutes**: `20`
   - Click "Create Assignment"

### **Step 5: View Assignments (Student)**
1. **Check Student Dashboard:**
   - Go back to the student window
   - Refresh the page or navigate to Student Dashboard
   - You should see the assignments appear in the "Class Assignments" section
   - Each assignment shows:
     - Title and description
     - Due date
     - Practice minutes (if specified)

## 🎯 **Expected Results**

### **Teacher Dashboard:**
- ✅ Class appears in assignments tab
- ✅ Assignment form works with validation
- ✅ Success messages appear after creation
- ✅ Assignments list updates immediately
- ✅ Form resets after successful creation

### **Student Dashboard:**
- ✅ Student can join class with code
- ✅ Assignments appear automatically
- ✅ Assignment details display correctly
- ✅ Due dates are formatted properly
- ✅ Practice minutes show when specified

### **Firebase Integration:**
- ✅ Assignments saved to Firebase
- ✅ Real-time updates between teacher and student
- ✅ Error handling for network issues
- ✅ Data persistence across sessions

## 🔧 **Troubleshooting**

### **If assignments don't appear:**
1. Check browser console for errors
2. Verify Firebase connection
3. Ensure student is properly enrolled in class
4. Try refreshing the page

### **If class code doesn't work:**
1. Verify the class code is correct
2. Check that the class was created successfully
3. Ensure you're using the exact code from teacher dashboard

### **If form validation fails:**
1. Ensure all required fields are filled
2. Check that due date is in the future
3. Verify practice minutes is a positive number

## 🎉 **Success Indicators**

When everything is working correctly, you should see:
- ✅ Teacher can create assignments
- ✅ Student can join class with code
- ✅ Assignments appear in student dashboard
- ✅ Real-time updates between teacher and student views
- ✅ Firebase data persistence
- ✅ Clean, intuitive user interface

**The assignment functionality is fully implemented and ready for use!** 🎵 