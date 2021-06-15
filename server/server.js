"use strict";

const path = require("path");
const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // username+psw
const session = require("express-session");
const daoAdmin = require("./dao-admin.js");
const daoSurvey = require("./dao-survey.js"); // module for accessing the DB
const { check, validationResult } = require("express-validator"); // validation middleware
// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/*** Set up Passport ***/
passport.use(
  new LocalStrategy(function (username, password, done) {
    daoAdmin.getAdmin(username, password).then((admin) => {
      if (!admin) return done(null, false, { error: "Incorrect email and/or password." });

      return done(null, admin);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  daoAdmin
    .getAdminById(id)
    .then((user) => {
      done(null, user); // req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({ error: "Not authorized" });
};

// enable sessions in Express
app.use(
  session({
    // set up here express-session
    secret: "c@ntam!oD1v@D3lPel1d3Ach1ll3lIRAFUN3ST4",
    resave: false,
    saveUninitialized: false,
  })
);

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

/*
 *
 ******************
 *                *
 *    User APIs   *
 *                *
 ******************
 *
 */
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) res.json(req.user);
  else res.status(401).json({ error: "Not authenticated" });
});

// POST /sessions
// login
app.post("/api/sessions", [check("username").notEmpty().isAlphanumeric()], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: "Incorrect email and/or password." });
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from adminDao.getAdmin()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

/*
 *
 ******************
 *                *
 *  Survey APIs   *
 *                *
 ******************
 *
 */

// GET /api/surveys
app.get("/api/surveys", (req, res) => {
  daoSurvey
    .getSurveys()
    .then((surveys) => res.json(surveys))
    .catch(() => res.status(500).end());
});

// GET /api/admin/surveys
app.get("/api/admin/surveys", (req, res) => {
  daoSurvey
    .getSurveyByAdmin(req.user.id)
    .then((surveys) => res.json(surveys))
    .catch(() => res.status(500).end());
});

// GET /api/surveys/<id>
app.get("/api/surveys/:id", (req, res) => {
  daoSurvey
    .getSurveyById(req.params.id)
    .then((survey) => {
      if (survey.error) res.status(404).json(survey);
      else res.json(survey);
    })
    .catch(() => res.status(500).end());
});

// POST /api/surveys
app.post(
  "/api/surveys",
  [check("title").notEmpty(), check("adminId").notEmpty(), check("questions").isArray({ min: 1 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const survey = {
      title: req.body.title,
      adminId: req.body.adminId,
      questions: req.body.questions,
    };

    daoSurvey
      .createSurvey(survey)
      .then(() => {
        res.status(201).end();
      })
      .catch(() => res.status(503).json({ error: `Database error during the creation of survey.` }));
  }
);
