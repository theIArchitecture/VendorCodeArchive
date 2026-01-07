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
