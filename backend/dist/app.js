"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const connect_sqlite3_1 = __importDefault(require("connect-sqlite3"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Route Imports
const index_1 = require("./routes/index");
const UserCourses_1 = require("./routes/UserCourses");
const Account_1 = require("./routes/Account");
const Auth_1 = require("./routes/Auth");
// Create Express server
exports.app = (0, express_1.default)();
// Express configuration
exports.app.set("port", process.env.PORT || 3000);
// SQLite
const SQLiteStore = (0, connect_sqlite3_1.default)(express_session_1.default);
// Cors
const whitelist = [
    "http://localhost:3000",
    "http://localhost:2000",
    "https://localhost:2000",
    "https://localhost:3000",
];
const corsOptions = {
    credentials: true,
    origin(requestOrigin, callback) {
        if (whitelist.indexOf(requestOrigin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
exports.app.use((0, cors_1.default)(corsOptions));
// Logger
exports.app.use((0, morgan_1.default)("dev"));
// Express middleware
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use((0, cookie_parser_1.default)());
// Authentication
exports.app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
}));
exports.app.use(passport_1.default.authenticate("session"));
// Routes
exports.app.use(express_1.default.static(path.join(__dirname, "../public")));
exports.app.use("/", index_1.index);
exports.app.use(UserCourses_1.userCourses);
exports.app.use(Account_1.accountRouter);
exports.app.use(Auth_1.authRouter);
// Error Handlers
exports.app.use(errorHandler_1.errorNotFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map