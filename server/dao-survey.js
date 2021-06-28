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
        adminId: s.adminId,
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
          adminId: row.adminId,
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
      if (rows == undefined || rows.length === 0) {
        resolve({ error: "QUESTIONS not found." });
      } else {
        const questions = rows.map((q) => ({
          questionId: q.questionId,
          questionText: q.questionText,
          min: q.min,
          max: q.max,
          pos: q.pos,
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
      if (rows == undefined || rows.length === 0) {
        resolve({ error: "ANSWERS not found." });
      } else {
        const answers = rows.map((a) => ({
          answerId: a.answerId,
          pos: a.pos,
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
      return Promise.resolve(values.filter((v) => v.error)[0]); //return the only error that should be present
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
          adminId: s.adminId,
        }));
        resolve(survey);
      }
    });
  });
};

// add a new survey
exports.createSurvey = (survey) => {
  //In a real scenario a rollback is needed
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
      const promises = [];
      survey.questions.forEach((q) => {
        promises.push(
          new Promise((resolve, reject) => {
            const sql = "INSERT INTO questions(questionText, min, max, pos, surveyId) VALUES(?, ?, ?, ?, ?)";
            db.run(sql, [q.text, q.min, q.max, q.pos, sId], function (err) {
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
                const sql_2 = "INSERT INTO answers(pos, answerText, questionId, surveyId) VALUES(?, ?, ?, ?)";
                db.run(sql_2, [a.id, a.text, values[index], sId], function (err) {
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
    })
    .catch(() => {
      throw { error: "Error while inserting into db." };
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
        resolve({ error: "Unable to get new id." });
      } else {
        if (row["MAX(submissionId)"] == null) resolve(1);
        else resolve(row["MAX(submissionId)"] + 1);
      }
    });
  });
};

exports.createSubmission = (submission) => {
  return this.getNewSubmissionId()
    .then((id) => {
      const promises = [];
      //submission.submissionId = id;
      submission.answers.forEach((a) => {
        promises.push(
          new Promise((resolve, reject) => {
            const sql = "INSERT INTO submissions VALUES (?,?,?,?,?,?)";
            db.run(sql, [id, submission.user, a.text, a.answerId, a.questionId, submission.surveyId], (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(this.lastId);
            });
          })
        );
      });
      return Promise.all([...promises]);
    })
    .catch(() => {
      throw { error: "Error while inserting into db." };
    });
};

// get all submissions by survey ID
exports.getSubmissionsBySurveyId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM submissions WHERE surveyId=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const submissionsList = rows.map((s) => ({
        submissionId: s.submissionId,
        user: s.user,
        answerText: s.answerText,
        answerId: s.answerId,
        questionId: s.questionId,
        surveyId: s.surveyId,
      }));

      const groupedSubmissions = groupBy(submissionsList, "submissionId");
      groupedSubmissions.forEach((obj, index) => {
        const answers = [];
        obj.forEach((o) => {
          answers.push({ answerText: o.answerText, answerId: o.answerId, questionId: o.questionId });
        });
        groupedSubmissions[index] = { user: obj[0].user, surveyId: obj[0].surveyId, answers: [...answers] };
      });
      resolve(groupedSubmissions);
    });
  });
};

exports.getSubmissions = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM submissions";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const submissionsList = rows.map((s) => ({
        submissionId: s.submissionId,
        user: s.user,
        answerText: s.answerText,
        answerId: s.answerId,
        questionId: s.questionId,
        surveyId: s.surveyId,
      }));

      const groupedSubmissions = groupBy(submissionsList, "submissionId");
      groupedSubmissions.forEach((obj, index) => {
        const answers = [];
        obj.forEach((o) => {
          answers.push({ answerText: o.answerText, answerId: o.answerId, questionId: o.questionId });
        });
        groupedSubmissions[index] = { user: obj[0].user, surveyId: obj[0].surveyId, answers: [...answers] };
      });
      resolve(groupedSubmissions);
    });
  });
};

function groupBy(arr, prop) {
  /*The Map instance is created from key/value pairs that are generated from the input array.
    The keys are the values of the property to group by, and the values are initialised as empty arrays.
    Then those arrays are populated. Finally the values of the map (i.e. those populated arrays) are returned.*/
  const map = new Map(Array.from(arr, (obj) => [obj[prop], []]));
  arr.forEach((obj) => {
    map.get(obj[prop]).push(obj);
  });
  return Array.from(map.values());
}
