'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../../../context/UserContext';
import { useError } from '../../../../../context/ErrorContext'; // 1. Importer le hook d'erreur
import axios from 'axios';
import Input from "../../../Input";
import PasswordInputContainer from '@/app/ui/auth/PasswordInputContainer';
import { useTranslation } from "../../../../i18n/client";

export default function EditProfile({ setLayout }) {
  const { user, setUser, fetchUser } = useUser();
  const { handleError } = useError(); // 2. Initialiser le gestionnaire d'erreurs
  const { t } = useTranslation();

  // State pour les données du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State pour les erreurs de validation locales (inline)
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{13,}$/;
    return re.test(password);
  };

  const handleConfirm = async () => {
    // Réinitialiser les erreurs locales à chaque tentative
    setErrors({});
    const newErrors = {};

    // --- Validation locale (côté client) ---
    // Ces erreurs sont affichées instantanément sous les champs.
    if (newPassword && !validatePassword(newPassword)) {
      newErrors.newPassword = t('editProfile.error.password');
    }
    if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('editProfile.error.passwordMatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // On arrête l'exécution si des erreurs locales sont trouvées
    }

    // --- Tentative de mise à jour (côté serveur) ---
    try {
      const updatedUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
      };

      // N'inclure les mots de passe que s'ils sont renseignés
      if (newPassword) {
        updatedUser.currentPassword = currentPassword;
        updatedUser.newPassword = newPassword;
      }

      const response = await axios.put('/api/users', updatedUser);

      if (response.status === 200) {
        setUser(response.data.user);
        fetchUser();
        setLayout('Account');
        // Optionnel : ajouter une notification de succès ici si vous avez un contexte pour ça
      }
    } catch (error) {
      // 3. Utiliser le gestionnaire d'erreurs global pour les erreurs API
      // Il affichera une notification "toast" avec le bon message.
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start gap-[3vh] h-full w-full px-4">
      <div className="flex items-center justify-between w-full">
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Input
          name="first_name"
          type="text"
          placeholder={t('editProfile.firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          name="last_name"
          type="text"
          placeholder={t('editProfile.lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          name="email"
          type="email"
          placeholder={t('editProfile.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInputContainer
          name="currentPassword"
          placeholder={t('editProfile.currentPassword')}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          newUser={false}
        />

        <div>
          <PasswordInputContainer
            name="newPassword"
            placeholder={t('editProfile.newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            newUser={true}
          />
          {/* Affiche l'erreur de validation locale */}
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>
        
        <div>
          <PasswordInputContainer
            name="confirmPassword"
            placeholder={t('editProfile.confirmNewPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            newUser={true}
          />
          {/* Affiche l'erreur de validation locale */}
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
      
      {/* 4. L'erreur générale est supprimée d'ici car gérée par le toast de ErrorContext */}

      <button
        onClick={handleConfirm}
        className="p-2 bg-blue-500 text-white rounded"
      >
        {t('editProfile.confirm')}
      </button>
    </div>
  );
}