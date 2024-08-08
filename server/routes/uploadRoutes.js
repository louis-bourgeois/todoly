// uploadRoutes.js
import axios from "axios";
import express from "express";
import FormData from "form-data";
import fs from "fs";
import multer from "multer";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // J'étais étape 6/7 env configuré
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier n'a été uploadé." });
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(req.file.path));

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    // Supprime le fichier temporaire
    fs.unlinkSync(req.file.path);

    if (response.data.success) {
      // Enregistrez l'URL de l'image dans votre base de données si nécessaire
      // Par exemple : await User.findByIdAndUpdate(req.user.id, { profileImage: response.data.result.variants[0] });

      res.json({ url: response.data.result.variants[0] });
    } else {
      res.status(500).json({ error: "Erreur lors de l'upload sur Cloudflare" });
    }
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    res.status(500).json({ error: "Erreur lors de l'upload sur Cloudflare" });
  }
});

export default router;
