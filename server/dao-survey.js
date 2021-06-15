"use strict";
/* Data Access Object (DAO) module for accessing surveys */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("survey.db", (err) => {
  if (err) throw err;
});

// get all tasks
exports.getSurveys = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM surveys";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const survey = rows.map((s) => ({
        surveyId: s.surveyId,
        title: s.title,
        adminIs: s.adminId,
      }));
      resolve(survey);
    });
  });
};

// get survey with a certain {id}
exports.getSurveyById = (surveyId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM surveys WHERE surveyId=?";
    db.get(sql, [surveyId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "SURVEY not found." });
      } else {
        const survey = {
          surveyId: s.surveyId,
          title: s.title,
          adminIs: s.adminId,
        };
        resolve(survey);
      }
    });
  }).then((survey) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM questions WHERE surveyId=?";
      db.all(sql, [survey.surveyId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row == undefined) {
          resolve({ error: "QUESTIONS not found." });
        } else {
          const questions = rows.map((q) => ({
            questionId: q.questionId,
            questionText: q.questionText,
            min: q.min,
            max: q.max,
            surveyId: q.surveyId,
          }));
          survey.questions.push([...questions]);
          resolve(survey);
        }
      });
    }).then((survey) => {
      const sql = "SELECT * FROM answers WHERE surveyId=?";
      db.all(sql, [survey.surveyId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row == undefined) {
          resolve({ error: "ANSWERS not found." });
        } else {
          const answers = rows.map((a) => ({
            answerId: a.answerId,
            answerText: a.answerText,
            questionId: a.questionId,
            surveyId: a.surveyId,
          }));

          answers.forEach((a) => {
            survey.questions.forEach((q) => {
              if (q.questionId === a.questionId) {
                q.answers.push(a);
              }
            });
          });
          resolve(survey);
        }
      });
    });
  });
};

// get surveys published by a certain admin
exports.getSurveyByAdmin = (adminId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM surveys WHERE adminId=?";
    db.all(sql, [adminId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row[0] == undefined) {
        resolve({ error: "SURVEY not found." });
      } else {
        const survey = rows.map((s) => ({
          surveyId: s.surveyId,
          title: s.title,
          adminIs: s.adminId,
        }));
        resolve(survey);
      }
    });
  });
};

// add a new survey
exports.createSurvey = (survey) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO surveys(title, adminId) VALUES(?, ?)";
    db.run(sql, [survey.title, survey.adminId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  })
    .then((sId) => {
      const options = { surveyId: sId, qId: [] };
      survey.questions.forEach((q) => {
        const sql = "INSERT INTO questions(questionText, min, max, surveyId) VALUES(?, ?, ?, ?)";
        db.run(sql, [q.questionText, q.min, q.max, sId], function (err) {
          if (err) {
            reject(err);
            return;
          }
          options.qId.push(this.lastID);
          if (options.qId.length === survey.questions.length) resolve(options);
        });
      });
    })
    .then((options) => {
      let i = 0;
      survey.questions.forEach((q) => {
        q.answers.forEach((a) => {
          const sql_2 = "INSERT INTO answers(answerText, questionId, surveyId) VALUES(?, ?, ?)";
          db.run(sql_2, [a.answerText, options.qId[i], options.surveyId], function (err) {
            if (err) {
              reject(err);
              return;
            }
            i++;
          });
        });
      });
    });
};
