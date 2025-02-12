import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "../../../../../../context/UserContext";
import { storage } from "../../../../../../firebaseClientConfig"; // ajustez le chemin si nécessaire
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";

// Fonction utilitaire pour recadrer l'image en carré
async function cropToSquare(file) {
  try {
    // Crée un ImageBitmap à partir du fichier
    const imageBitmap = await createImageBitmap(file);
    const minSize = Math.min(imageBitmap.width, imageBitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = minSize;
    canvas.height = minSize;
    const ctx = canvas.getContext("2d");

    // Calculer les offsets pour centrer le recadrage
    const offsetX = (imageBitmap.width - minSize) / 2;
    const offsetY = (imageBitmap.height - minSize) / 2;
    ctx.drawImage(imageBitmap, offsetX, offsetY, minSize, minSize, 0, 0, minSize, minSize);

    // Retourner un nouveau File à partir du canvas
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: file.type }));
        } else {
          reject(new Error("Erreur lors du recadrage de l'image."));
        }
      }, file.type);
    });
  } catch (error) {
    throw error;
  }
}


const ProfilePhoto = ({ size = 150 }) => {
  const { user, setUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Limite de taille en octets (ici 2 MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    // Si l'utilisateur a déjà une image (Firebase URL), l'utiliser comme aperçu
    if (user?.image_url) {
      setPreviewUrl(user.image_url);
      setImageLoaded(true);
    }
  }, [user]);

  const handleFileChange = async (event) => {
    let file = event.target.files[0];
    if (!file) return;
  
    // Créer un aperçu local pour affichage immédiat
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);
    setUploadProgress(0);
    setImageLoaded(false);
  
    try {
      // Recadrer l'image en carré
      file = await cropToSquare(file);
  
      // Compression si nécessaire
      if (file.size > MAX_FILE_SIZE) {
        const options = {
          maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
          useWebWorker: true,
          onProgress: (p) => {
            setUploadProgress(p);
          },
        };
        file = await imageCompression(file, options);
      }

      // Suppression de l'ancienne image sur Firebase (si elle existe)
      if (user?.image_url) {
        const oldImageRef = ref(storage, user.image_url);
        try {
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log("Erreur lors de la suppression de l'ancienne image", error);
        }
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      // Utilisation de l'email pour le chemin (vérifiez bien vos règles Firebase)
      const storageRef = ref(storage, `profile_pictures/${user?.email}/${fileName}`);

      // Upload avec suivi de la progression
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Erreur d'upload : ", error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("URL de téléchargement : ", downloadURL);
          
          // Appel de la route pour mettre à jour la DB
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
            console.error("Erreur lors de la mise à jour de la DB", error);
          }
          // Mise à jour du contexte utilisateur et de l'aperçu
          setUser({ ...user, image_url: downloadURL });
          setPreviewUrl(downloadURL);
          setIsUploading(false);
        }
      );
    }  catch (error) {
      console.error("Erreur lors du recadrage/upload de l'image", error);
      setIsUploading(false);
    }
  };

  return (
    <div
      className="relative rounded-full overflow-hidden cursor-pointer group flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
      onClick={() => document.getElementById("photo-upload").click()}
    >
      {/* Affichage de l'image (aperçu) avec effet de fondu */}
      {previewUrl && (
        <div
          className={`w-full h-full transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={previewUrl}
            alt="Photo de profil"
            width={size}
            height={size}
            quality={100}
            className="w-full h-full object-cover object-center rounded-full"
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Overlay de progression pendant l'upload */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white text-xl font-bold">{Math.round(uploadProgress)}%</span>
        </div>
      )}

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
