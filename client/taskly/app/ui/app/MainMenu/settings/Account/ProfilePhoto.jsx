"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "../../../../../../context/UserContext";
import { storage } from "../../../../../../firebaseClientConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { useTranslation } from "@/app/i18n/client";

async function cropToSquare(file, canvasErrorMessage) {
  try {
    const imageBitmap = await createImageBitmap(file);
    const minSize = Math.min(imageBitmap.width, imageBitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = minSize;
    canvas.height = minSize;
    const ctx = canvas.getContext("2d");
    const offsetX = (imageBitmap.width - minSize) / 2;
    const offsetY = (imageBitmap.height - minSize) / 2;
    ctx.drawImage(imageBitmap, offsetX, offsetY, minSize, minSize, 0, 0, minSize, minSize);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: file.type }));
        } else {
          reject(new Error(canvasErrorMessage));
        }
      }, file.type);
    });
  } catch (error) {
    throw error;
  }
}

const ProfilePhoto = ({ size = 150 }) => {
  const { user, setUser } = useUser();
  const { t } = useTranslation()
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    if (user?.image_url) {
      setPreviewUrl(user.image_url);
      setImageLoaded(true);
    }
  }, [user]);

  const handleFileChange = async (event) => {
    let file = event.target.files[0];
    if (!file) return;
  
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);
    setUploadProgress(0);
    setImageLoaded(false);
  
    try {
      if (!user?.username) {
        console.error(t("profilePhoto.error.usernameNotFound"));
        alert(t("profilePhoto.error.usernameMissing"));
        setIsUploading(false);
        return;
      }

      file = await cropToSquare(file, t("profilePhoto.error.canvas"));
  
      if (file.size > MAX_FILE_SIZE) {
        const options = {
          maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
          useWebWorker: true,
          onProgress: (p) => setUploadProgress(p),
        };
        file = await imageCompression(file, options);
      }

      if (user?.image_url) {
        const oldImageRef = ref(storage, user.image_url);
        try {
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log(t("profilePhoto.info.oldImageNotDeleted"), error);
        }
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `profile_pictures/${user.username}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error)
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Fichier disponible à l'URL : ", downloadURL);
          
          try {
            await fetch("/api/profile/upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_email: user.email,
                image_url: downloadURL,
              }),
            });
          } catch (error) {
            console.error(error)
          }
          console.log(downloadURL)
          setUser({ ...user, image_url: downloadURL });
          setPreviewUrl(downloadURL);
          setIsUploading(false);
        }
      );
    }  catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  return (
    <div
      className="relative rounded-full overflow-hidden cursor-pointer group flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
      onClick={() => document.getElementById("photo-upload").click()}
    >
      {previewUrl ? (
        <div
          className={`w-full h-full transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={previewUrl}
            alt={t("profilePhoto.alt")}
            width={size}
            height={size}
            quality={100}
            className="w-full h-full object-cover object-center rounded-full"
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-full"></div>
      )}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
          <span className="text-white text-xl font-bold">{Math.round(uploadProgress)}%</span>
        </div>
      )}
      {!isUploading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-full"
        >
          <svg
            className="text-white h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.658 5.625h-3.931V4.25a.75.75 0 0 0-.75-.75h-7.95a.75.75 0 0 0-.75.75v1.375H4.342a1.25 1.25 0 0 0-1.25 1.25v11.25a1.25 1.25 0 0 0 1.25 1.25h17.316a1.25 1.25 0 0 0 1.25-1.25V6.875a1.25 1.25 0 0 0-1.25-1.25Zm-1.875 9.375a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        </div>
      )}

      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};
export default ProfilePhoto;