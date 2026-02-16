import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import { createServer } from "http";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./models/User.js";
import appRoutes from "./routes/appRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import profileImageRoutes from "./routes/profilImageRoutes.js"
import statsRoutes from "./routes/statsRoutes.js";
import { scheduleTaskMaintenance } from "./utils/taskScheduler.js";

dotenv.config();

const app = express();
const server = createServer(app);

const port = process.env.PORT

app.set("trust proxy", 1);

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.1.100:3000",
    "https://todoly.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60000, 
  handler: (req, res) => {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});

app.use(cors(corsOptions)); 
app.options("*", cors(corsOptions));
app.use(helmet()); 
app.use(limiter); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/app", appRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/profile", profileImageRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Taskly API server! (don't act as a hacker please, that's boring)"
  );
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, cb) => {
    try {
      const user = await User.find({ email });

      if (user) {
        const result = await bcrypt.compare(password, user[2]);
        if (result) {
          return cb(null, user);
        }
        return cb("Incorrect Password");
      } else {
        return cb("User not found");
      }
    } catch (error) {
      return cb(error);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user[0]);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.getData("all", id);
    if (!user) {
      cb(null, false, { message: "Account doesn't exist " });
      return;
    }
    user.tags = await User.getTags(id);
    user.workspaces = await User.findWorkspacesByUserId(id);
    user.preferences = await User.getPreferences(id);
    user.tasks = [];
    user.sections = [];

    await Promise.all(
      user.workspaces.map(async (workspace) => {
        const tasks = await User.getTasks(workspace.id);
        const sections = await User.getSections(workspace.id);
        user.tasks.push(...tasks);
        user.sections.push(...sections);
      })
    );

    if (user) {
      cb(null, user);
    } else {
      cb(new Error("User not found"), false);
    }
  } catch (e) {
    cb(e, false);
  }
});

server.listen(port, "localhost", () => {
  console.log(`Server running on http://localhost:${port}`);
});

scheduleTaskMaintenance();
