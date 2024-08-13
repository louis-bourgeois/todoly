import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "../../../../../../context/UserContext";

const ProfilePhoto = ({ size = 150 }) => {
  const { user, setUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert(
          "Le fichier est trop volumineux. La taille maximale est de 10 MB."
        );
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "/api/upload/profile_picture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.data.url) {
          await setUser((prevUser) => ({
            ...prevUser,
            image_url: response.data.url,
          }));
        } else {
          throw new Error("Aucune URL d'image retournée");
        }
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
        alert("Une erreur est survenue lors de l'upload de l'image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div
      className="relative rounded-full overflow-hidden cursor-pointer group flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
      onClick={() => document.getElementById("photo-upload").click()}
    >
      {user?.image_url ? (
        <Image
          src={user.image_url}
          alt="Photo de profil"
          width={size}
          height={size}
          quality={100}
          className="rounded-full object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/4 h-3/4 text-text"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M5 19c0-4 7-4 7-4s7 0 7 4" />
        </svg>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
        {isUploading ? (
          <span className="text-white">Chargement...</span>
        ) : (
          <svg
            fill="currentColor"
            height="50%"
            width="50%"
            viewBox="0 0 487 487"
            className="text-white"
          >
            <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9 v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z" />
          </svg>
        )}
      </div>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePhoto;
