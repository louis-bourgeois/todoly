import bcrypt from "bcrypt";
const saltrounds = 12;

export async function hashPassword(req, res, next) {
  try {
    req.body.data.hashPassword = await bcrypt.hash(
      req.body.data.password,
      saltrounds
    );
    const { password, ...cleanedData } = req.body.data;
    req.body.data = cleanedData;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error while hashing password",
      error: error.toString(),
    });
  }
}

export function checkPassword(req, res, next) {
  try {
    bcrypt.compare(req.body.password, req.body.db_hash_password, (err, r) => {
      if (err) {
        throw new Error(err);
      } else {
        if (r) {
          res.status(200).send("ok");
        } else {
          res.status(401).send();
        }
      }
    });
  } catch (e) {}
}
