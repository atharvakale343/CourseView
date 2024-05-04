import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { GoogleOneTapStrategy } from "passport-google-one-tap";
import { Strategy } from "passport-local";
import { db } from "../db/tables";
import { logger } from "../utils/logger";
import { TEST_ACCOUNT_EMAIL } from "../utils/hydrateTestAccount";

export const loggedIn = async (req: Request, res: Response): Promise<void> => {
    if (req.isAuthenticated()) {
        res.json({ message: "success", user: req.user });
    } else {
        res.json({ message: "fail" });
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.json({ message: "success" });
    });
};

type FederatedCredentialsRow = {
    id: number;
    user_id: number;
    provider: string;
    subject: string;
};

type UsersRow = {
    id: string;
    name: string;
    email: string;
};

function verify(profile: passport.Profile, done: passport.DoneCallback) {
    if (!profile) {
        return done(undefined, undefined);
    }
    db.get(
        "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
        [profile.provider, profile.id],
        function (err, row: FederatedCredentialsRow) {
            if (err) {
                return done(err);
            }
            if (!row) {
                if (!profile.emails || profile.emails.length === 0) {
                    return done(new Error("No email found"));
                }
                db.run(
                    "INSERT INTO users (name, email) VALUES (?, ?)",
                    [profile.displayName, profile.emails[0].value],
                    function (err) {
                        if (err) {
                            return done(err);
                        }

                        const id = this.lastID;
                        db.run(
                            "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
                            [id, profile.provider, profile.id],
                            function (err) {
                                if (err) {
                                    return done(err);
                                }
                                if (
                                    !profile.emails ||
                                    profile.emails.length === 0
                                ) {
                                    return done(new Error("No email found"));
                                }
                                const user = {
                                    id: id.toString(),
                                    name: profile.displayName,
                                    email: profile.emails[0].value,
                                };

                                return done(null, user);
                            },
                        );
                    },
                );
            } else {
                db.get(
                    "SELECT rowid AS id, email, name FROM users WHERE rowid = ?",
                    [row.user_id],
                    function (err, row: UsersRow) {
                        if (err) {
                            return done(err);
                        }

                        if (!row) {
                            return done(new Error("DB not consistent"));
                        }

                        const user: UsersRow = {
                            id: row.id.toString(),
                            email: row.email,
                            name: row.name,
                        };

                        return done(undefined, user);
                    },
                );
            }
        },
    );
}

passport.use(
    new GoogleOneTapStrategy(
        {
            clientID: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
            verifyCsrfToken: false, // whether to validate the csrf token or not
        },
        verify,
    ),
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session. In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.
passport.serializeUser(function (user: Express.User, cb) {
    process.nextTick(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cb(undefined, user.id);
    });
});

passport.deserializeUser(function (obj, cb) {
    process.nextTick(function () {
        db.get(
            "SELECT rowid AS id, email, name FROM users WHERE rowid = ?",
            [obj],
            function (err, row: UsersRow) {
                if (err) {
                    return cb(err);
                }

                if (!row) {
                    return cb(new Error("User not found"));
                }

                const user: UsersRow = {
                    id: row.id.toString(),
                    email: row.email,
                    name: row.name,
                };

                return cb(undefined, user);
            },
        );
    });
});

// Basic Auth

passport.use(
    new Strategy(function (username, password, done) {
        logger.info("username: ", username);
        if (username !== TEST_ACCOUNT_EMAIL) {
            return done(new Error("User must be bgreene@umass.edu"), null);
        }
        verify(
            {
                provider: "basic",
                id: username,
                displayName: "Bonnie Greene",
                emails: [{ value: TEST_ACCOUNT_EMAIL }],
            },
            done,
        );
    }),
);
