DROP TABLE IF EXISTS user_profile_image;

CREATE TABLE user_profile_image (
  user_email VARCHAR(255) NOT NULL PRIMARY KEY,
  image_url text NOT NULL
);
