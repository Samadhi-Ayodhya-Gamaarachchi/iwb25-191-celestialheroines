# TikiriCare Authentication System

## Overview
This document describes the authentication system implemented in the TikiriCare React Native frontend application.

## Features

### Login Screen
- **Email Address**: Required field with email validation
- **Password**: Required field with show/hide toggle
- **Professional Material Design**: Modern UI with gradient backgrounds and smooth animations
- **Form Validation**: Client-side validation for all fields
- **Loading States**: Visual feedback during authentication

### Register Screen
- **Parent Name**: Required field for parent/guardian identification
- **Email Address**: Required field with email validation
- **Telephone Number**: Required field with length validation (minimum 10 digits)
- **Password**: Required field with show/hide toggle (minimum 6 characters)
- **Confirm Password**: Required field with password matching validation
- **Terms & Conditions**: User agreement links
- **Professional Material Design**: Consistent with login screen

## Technical Implementation

### Authentication Context (`AuthContext.tsx`)
- **State Management**: Manages user authentication state
- **AsyncStorage**: Persists user session across app restarts
- **Mock API**: Simulates backend authentication (replace with real API calls)
- **Error Handling**: Comprehensive error handling for all auth operations

### Navigation Flow
1. **App Launch**: Checks for existing user session
2. **Authenticated User**: Redirects to main app tabs
3. **Unauthenticated User**: Redirects to login screen
4. **Registration**: New users can create accounts
5. **Logout**: Clears session and returns to login

### File Structure
```
app/
├── _layout.tsx          # Root layout with auth provider
├── index.tsx            # App entry point
├── LoginScreen.tsx      # Login screen
├── RegisterScreen.tsx   # Registration screen
└── (tabs)/             # Main app tabs (protected routes)
    ├── _layout.tsx     # Tab navigation
    ├── HomeScreen.tsx  # Home tab
    ├── HealthScreen.tsx # Health tab
    ├── CareCenterScreen.tsx # Care center tab
    └── ProfileScreen.tsx # Profile tab with logout
```

## Usage

### For Developers
1. **Replace Mock API**: Update `AuthContext.tsx` with real authentication endpoints
2. **Customize Validation**: Modify validation rules in both screens
3. **Styling**: Update Tailwind classes for custom branding
4. **Error Messages**: Customize error messages and alerts

### For Users
1. **First Time**: Navigate to register screen to create account
2. **Returning Users**: Use email and password to login
3. **Session Management**: App remembers login state
4. **Logout**: Use logout button in profile tab

## Dependencies
- **NativeWind**: Tailwind CSS for React Native
- **Expo Linear Gradient**: For gradient backgrounds
- **Lucide React**: For icons
- **AsyncStorage**: For session persistence
- **Expo Router**: For navigation

## Security Features
- **Password Visibility Toggle**: Users can verify password input
- **Form Validation**: Prevents invalid data submission
- **Session Persistence**: Secure local storage of user data
- **Input Sanitization**: Basic input validation and sanitization

## Future Enhancements
- **Biometric Authentication**: Fingerprint/Face ID support
- **Two-Factor Authentication**: Enhanced security
- **Password Reset**: Forgot password functionality
- **Social Login**: Google, Facebook, Apple integration
- **Remember Me**: Extended session options

## Notes
- Currently uses mock authentication for development
- Replace setTimeout calls with real API endpoints
- Add proper error handling for network failures
- Implement proper password hashing on backend
- Add rate limiting for login attempts
