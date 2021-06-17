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
  const promises = [];
  const promiseSurvey = new Promise((resolve, reject) => {
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
          surveyId: row.surveyId,
          title: row.title,
          adminIs: row.adminId,
          questions: [],
        };
        resolve(survey);
      }
    });
  });

  const promiseQuestions = new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions WHERE surveyId=?";
    db.all(sql, [surveyId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        reject({ error: "QUESTIONS not found." });
      } else {
        const questions = rows.map((q) => ({
          questionId: q.questionId,
          questionText: q.questionText,
          min: q.min,
          max: q.max,
          surveyId: surveyId,
          answers: [],
        }));

        resolve(questions);
      }
    });
  });

  const promiseAnswers = new Promise((resolve, reject) => {
    const sql = "SELECT * FROM answers WHERE surveyId=?";
    db.all(sql, [surveyId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: "ANSWERS not found." });
      } else {
        const answers = rows.map((a) => ({
          answerId: a.answerId,
          answerText: a.answerText,
          questionId: a.questionId,
          surveyId: a.surveyId,
        }));

        resolve(answers);
      }
    });
  });

  return Promise.all([promiseSurvey, promiseQuestions, promiseAnswers]).then((values) => {
    if (values[0].error || values[1].error || values[2].error) {
      Promise.resolve({ error: "error" });
    } else {
      const survey = values[0];
      survey.questions.push(...values[1]);
      values[2].forEach((a) => {
        survey.questions.forEach((q) => {
          if (q.questionId === a.questionId) {
            q.answers.push(a);
          }
        });
      });
      return Promise.resolve(survey);
    }
  });
};

// get surveys published by a certain admin
exports.getSurveysByAdmin = (adminId) => {
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
  }).then((sId) => {
    const promises = [];
    survey.questions.forEach((q) => {
      promises.push(
        new Promise((resolve, reject) => {
          const sql = "INSERT INTO questions(questionText, min, max, surveyId) VALUES(?, ?, ?, ?)";
          db.run(sql, [q.questionText, q.min, q.max, sId], function (err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.lastID);
          });
        })
      );
    });
    Promise.all([...promises]).then((values) => {
      const promises = [];
      survey.questions.forEach((q, index) => {
        q.answers.forEach((a) => {
          promises.push(
            new Promise((resolve, reject) => {
              const sql_2 = "INSERT INTO answers(answerText, questionId, surveyId) VALUES(?, ?, ?)";
              db.run(sql_2, [a.answerText, values[index], sId], function (err) {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.lastID);
              });
            })
          );
        });
      });
      return Promise.all([...promises]);
    });
  });
};

exports.getNewSubmissionId = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT MAX(submissionId) FROM submissions";
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "Unable to get max id." });
      } else {
        //TODO
        //resolve();
      }
    });
  });
};

exports.createSubmission = (submission) => {
  const promises = [];
  submission.forEach;
  promises.push(
    new Promise((resolve, reject) => {
      const sql = "INSERT INTO submissions VALUES (?,?,?,?,?,?)";
      db.get(sql, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        //TODO
        //resolve();
      });
    })
  );
  return Promise.all([...promises]);
};
