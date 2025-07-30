'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser, useUserMutation } from '@/hooks/user';
import { Button, Input, Avatar, Textarea } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Provider/EyeFilledIcon';

export default function EditProfile() {
  const { user } = useAuth();
  const { data: userData, isLoading, isError } = useUser(user?.id);
  const updateUserMutation = useUserMutation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setEmail(userData.email);
      setBio(userData.bio);
    }
  }, [userData]);

  const handleUpdate = async () => {
    try {
      await updateUserMutation.mutateAsync({ username, email, bio });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data.</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar src={user?.imageUrl} className="w-20 h-20 text-large" />
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button color="primary" onClick={handleUpdate} disabled={updateUserMutation.isLoading}>
            {updateUserMutation.isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}
