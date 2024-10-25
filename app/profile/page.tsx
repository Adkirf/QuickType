'use client';

import { useAuth } from '@/components/context/AuthProvider';
import { ProfilePageComponent } from '@/components/profile-page';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {userProfile ? (
        <ProfilePageComponent />
      ) : (
        <p>Error loading profile. Please try again.</p>
      )}
    </div>
  );
}
