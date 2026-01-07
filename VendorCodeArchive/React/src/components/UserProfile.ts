// User Profile Utility
// Validates user profile data for React components

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export function validateUserProfile(profile: Partial<UserProfile>): void {
  // Validate required fields
  if (!profile.name) {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (8):
//   1. Line 13: Error message without production error code - breaks React bundle size optimization
//   2. Line 13: Error message without production error code - breaks React bundle size optimization
//   3. Line 17: Error message without production error code - breaks React bundle size optimization
//   4. Line 17: Error message without production error code - breaks React bundle size optimization
//   5. Line 21: Error message without production error code - breaks React bundle size optimization
//   6. Line 21: Error message without production error code - breaks React bundle size optimization
//   7. Line 27: Error message without production error code - breaks React bundle size optimization
//   8. Line 27: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: Architectural violation detected
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    throw new Error('UserProfile validation failed: name field is required for user identification');
  }

  if (!profile.email || !profile.email.includes('@')) {
    throw new Error('UserProfile validation failed: valid email address with @ symbol is required');
  }

  if (profile.role && profile.role.length < 3) {
    console.error('UserProfile validation warning: role field should be at least 3 characters long');
  }
}

export function getUserDisplayName(profile: UserProfile): string {
  if (!profile.name) {
    throw new Error('Cannot generate display name: UserProfile name field is required');
  }

  return profile.name.trim();
}
