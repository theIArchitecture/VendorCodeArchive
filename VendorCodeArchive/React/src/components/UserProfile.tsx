import React from 'react';

interface UserProfileProps {
  name?: string;
  email?: string;
  onUpdate?: (data: any) => void;
}

export function UserProfile({ name, email, onUpdate }: UserProfileProps) {
  // Validate props
  if (!name) {
    throw new Error('UserProfile component requires a name prop to display user information');
  }

  if (onUpdate && typeof onUpdate !== 'function') {
    console.error('UserProfile onUpdate prop must be a function to handle updates');
  }

  if (!email || !email.includes('@')) {
    throw new Error('UserProfile requires a valid email address with @ symbol for user identification');
  }

  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}
