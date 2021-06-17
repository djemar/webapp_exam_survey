async function getSurveys() {
  try {
    const response = await fetch("/api/surveys");
    try {
      const surveysJson = await response.json();
      if (response.ok) {
        return surveysJson;
      } else {
        throw surveysJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function getSurveyById(surveyId) {
  try {
    const response = await fetch("/api/surveys/" + surveyId);
    try {
      const surveyJson = await response.json();
      if (response.ok) {
        return surveyJson;
      } else {
        throw surveyJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function getSurveysByAdmin() {
  try {
    const response = await fetch("/api/admin/surveys");
    try {
      const surveysJson = await response.json();
      if (response.ok) {
        return surveysJson;
      } else {
        throw surveysJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function addSurvey(survey) {
  try {
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(survey),
    });

    if (response.ok) {
      return null;
    } else {
      try {
        const responseJSON = await response.json();
        throw responseJSON;
      } catch {
        throw { error: "Cannot parse server response." };
      }
    }
  } catch {
    throw { error: "Cannot communicate with the server" };
  }
}

async function getSubmissions() {
  try {
    const response = await fetch("/api/submissions");
    try {
      const submissionsJson = await response.json();
      if (response.ok) {
        return submissionsJson;
      } else {
        throw submissionsJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function getSubmissionById(submissionId) {
  try {
    const response = await fetch("/api/submissions/" + submissionId);
    try {
      const submissionJson = await response.json();
      if (response.ok) {
        return submissionJson;
      } else {
        throw submissionJson;
      }
    } catch {
      throw { error: "Cannot parse server response." };
    }
  } catch {
    throw { error: "Cannot communicate with the server." };
  }
}

async function addSubmission(submission) {
  try {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    if (response.ok) {
      return null;
    } else {
      try {
        const responseJSON = await response.json();
        throw responseJSON;
      } catch {
        throw { error: "Cannot parse server response." };
      }
    }
  } catch {
    throw { error: "Cannot communicate with the server" };
  }
}

/*** Users APIs ***/
async function login(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.json();
    throw errDetails;
  }
}

async function getUserInfo() {
  const response = await fetch("api/sessions/current");
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

async function logout() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

const API = {
  getSurveys,
  getSurveyById,
  getSurveysByAdmin,
  addSurvey,
  getSubmissions,
  getSubmissionById,
  addSubmission,
  login,
  getUserInfo,
  logout,
};
export default API;
