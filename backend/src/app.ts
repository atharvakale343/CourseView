import express from "express";
import logger from "morgan";
import * as path from "path";
import db from "./db/tables";
import { DATABASE_BASE_DIR } from "./db/tables";
import dotenv from "dotenv";
import * as createError from "http-errors";
import cors, { CorsOptions } from "cors";
import session, { SessionOptions } from "express-session";
import passport from "passport";
import connect from "connect-sqlite3";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Load ENV
dotenv.config();

// Route Imports
import { index } from "./routes/index";
import { userCourses } from "./routes/UserCourses";
import { accountRouter } from "./routes/Account";
import { authRouter } from "./routes/Auth";
import { spireRouter } from "./routes/Spire";

// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.SERVER_PORT || 3000);

// SQLite
const SQLiteStore = connect(session);

// Cors
const whitelist = [
    "http://localhost:3000",
    "http://localhost:2000",
    "https://localhost:2000",
    "https://localhost:3000",
    "https://courseview-git-dev-atharva-kales-projects.vercel.app",
    "https://courseview-cs326-team-4.vercel.app",
    "https://app.courseview.us",
];
const corsOptions: CorsOptions = {
    credentials: true,
    origin(requestOrigin, callback) {
        if (whitelist.indexOf(requestOrigin as string) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

// Logger
app.use(logger("dev"));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication
const sess: SessionOptions = {
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    store: new SQLiteStore({ db: "sessions.db", dir: DATABASE_BASE_DIR }),
};

console.log("ENV: ", app.get("env"));

if (app.get("env") === "production") {
    console.log("Setting production settings");
    app.enable("trust proxy");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sess.proxy = true;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sess.cookie = {
        ...sess.cookie,
        httpOnly: false,
        secure: true,
    };
}
app.use(session(sess));
app.use(passport.authenticate("session"));

// Swagger Docs
const file = fs.readFileSync("./src/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument));

// Setup cors now after swagger routes
app.use(cors(corsOptions));

// Routes
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);
app.use(userCourses);
app.use(accountRouter);
app.use(authRouter);
app.use(spireRouter);

// Error Handlers
app.use(errorNotFoundHandler);
app.use(errorHandler);
