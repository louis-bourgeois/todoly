// uploadRoutes.js
import express from "express";
import fs from "fs";
import multer from "multer";
import pool from "../config/dbConfig.js";
import { bucket } from "../firebaseConfig.js";
import User from "../models/User.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/profile_picture", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier n'a été uploadé." });
  }
  if (!req.user) {
    return res
      .status(404)
      .json({ message: "Upload Failed", reason: "User not found" });
  }

  const file = req.file;
  const imageHash = req.body.hash;

  try {
    const client = await pool.connect();

    try {
      // Vérifier si l'image existe déjà
      const checkQuery =
        "SELECT image_url FROM user_profile_image WHERE image_hash = $1";
      const checkResult = await client.query(checkQuery, [imageHash]);

      if (checkResult.rows.length > 0) {
        // L'image existe déjà, retourner l'URL existante
        const existingUrl = checkResult.rows[0].image_url;
        res.json({ url: existingUrl, message: "Image déjà existante" });
        return;
      }

      // Si l'image n'existe pas, procéder à l'upload
      const fileName = `profile_pictures/${Date.now()}_${file.originalname}`;

      await bucket.upload(file.path, {
        destination: fileName,
        metadata: {
          contentType: file.mimetype,
        },
      });

      fs.unlinkSync(file.path);
      await bucket.file(fileName).makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      const found_user = await User.findId(
        undefined,
        req.user.email,
        undefined
      );
      const userId = found_user[0][0];

      const query = `
        INSERT INTO user_profile_image (user_id, image_url, image_hash)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id)
        DO UPDATE SET image_url = $2, image_hash = $3
        RETURNING *;
      `;
      const values = [userId, publicUrl, imageHash];
      const result = await client.query(query, values);

      res.json({ url: publicUrl });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    res.status(500).json({
      error: "Erreur lors de l'upload sur Firebase Storage",
      details: error.message,
    });
  }
});

export default router;
