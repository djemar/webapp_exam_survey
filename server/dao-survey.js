"use strict";
/* Data Access Object (DAO) module for accessing surveys */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("tasks.db", (err) => {
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

// add a new task
exports.createTask = (task) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO tasks( description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [task.description, task.important, task.private, task.deadline, task.completed, task.user],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

// update an existing task
exports.updateTask = (userID, task) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=? WHERE id =? AND user=?";
    db.run(
      sql,
      [task.description, task.important, task.private, task.deadline, task.completed, task.id, userID],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

// delete an existing task
exports.deleteTask = (userID, taskID) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM tasks WHERE id = ? AND user=?";
    db.run(sql, [taskID, userID], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

// marking existing task as completed/uncompleted
exports.setCompletedTask = (userID, taskID, isCompleted) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE tasks SET completed=? WHERE id = ? AND user=?";
    db.run(sql, [isCompleted, taskID, userID], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};
