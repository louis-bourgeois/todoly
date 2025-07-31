'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser, useUserMutation } from '@/hooks/user';
import { Button, Input, Avatar, Textarea } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Provider/EyeFilledIcon';
import { useTranslation } from '../../i18n/client';

export default function EditProfile() {
  const { user } = useAuth();
  const { data: userData, isLoading, isError } = useUser(user?.id);
  const updateUserMutation = useUserMutation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { t } = useTranslation();

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
      toast.success(t('profile.updateSuccess'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div>{t('profile.loading')}</div>;
  if (isError) return <div>{t('profile.error')}</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar src={user?.imageUrl} className="w-20 h-20 text-large" />
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <Input
            label={t('profile.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label={t('profile.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            label={t('profile.bio')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button color="primary" onClick={handleUpdate} disabled={updateUserMutation.isLoading}>
            {updateUserMutation.isLoading ? t('profile.updating') : t('profile.updateProfile')}
          </Button>
        </div>
      </div>
    </div>
  );
}