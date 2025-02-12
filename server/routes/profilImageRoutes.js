import express from "express";
import pool from "../config/dbConfig.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { user_email, image_url } = req.body;
  
  if (!user_email || !image_url) {
    return res.status(400).json({ error: "Les champs user_email et image_url sont requis." });
  }

  try {
    const query = `
      INSERT INTO user_profile_image (user_email, image_url)
      VALUES ($1, $2)
      ON CONFLICT (user_email) DO UPDATE 
      SET image_url = EXCLUDED.image_url
      RETURNING *
    `;
    const values = [user_email, image_url];
    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Image de profil mise à jour avec succès.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image de profil :", error);
    return res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'image de profil." });
  }
});

export default router;
