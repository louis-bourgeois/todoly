import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./models/User.js";
import appRoutes from "./routes/appRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;

// CORS options
const corsOptions = {
  origin: "http://localhost:3000", // Allow only requests from this origin
  credentials: true,
  optionsSuccessStatus: 200,
};
const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 60000, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).render("rateLimit", {
      title: "Limite de Requêtes Dépassée",
    });
  },
});

// Middlewares
app.use(helmet()); // Sécurise les réponses avec divers en-têtes HTTP
app.use(cors(corsOptions)); // Active CORS avec les options spécifiées
app.use(limiter); // Applique la limitation de débit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Mitigates the risk of client side script accessing the protected cookie
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiry (7 day in this case)
      sameSite: "Lax",
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/app", appRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/workspaces", workspaceRoutes);

// Middlewares
// Error Handler
// app.use(errorHandler);
// Root endpoint for basic server check
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Taskly API server! (don't act as a hacker please, that's boring)"
  );
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, cb) => {
    const user = await User.find({
      email: email,
    });

    if (user) {
      bcrypt.compare(password, user[2], (err, result) => {
        if (err) return cb(null, false);
        if (result) {
          return cb(null, user);
        }
        return cb("Incorrect Password");
      });
    } else {
      return cb("User not found");
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user[0]);
});
passport.deserializeUser(async (id, cb) => {
  try {

    const user = await User.getData("all", id);
    user.tasks = await User.getTasks(id);
    user.sections = await User.getSections(id);
    user.tags = await User.getTags(id);
    user.workspaces = await User.findWorkspacesByUserId(id);
 
    if (user) {
      cb(null, user);
    } else {
      cb(new Error("User not found"), false);
    }
  } catch (e) {
    cb(e, false);
  }
});

app.listen(port, () => {
  console.log(`HTTPS server running on http://localhost:${port}`);
});
