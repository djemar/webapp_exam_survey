```plantuml
hide circle
skinparam defaultFontName Consolas
skinparam defaultFontSize 16


entity Admins{
 * id\t\t: int
 * username\t: string
 * password\t: hash
}

entity Surveys{
    *id\t\t: int
    *title\t\t: string
    *adminId\t: int
}

entity Questions{
    *id\t\t\t: int
    *questionText\t: string
    *surveyId\t\t: int
    *min\t\t\t: int
    *max\t\t\t: int
}

note right of Questions
- min = 0, max = 0 → domanda facoltativa, aperta
- min = 1, max = 0 → domanda obbligatoria, aperta

- min = 0, max = 1 → domanda facoltativa, a scelta singola
- min = 1, max = 1 → domanda obbligatoria, a scelta singola
- min = 0, max > 1 → domanda facoltativa, a scelta multipla
- min = 1, max > 1 → domanda obbligatoria, a scelta multipla
end note

entity Answers{
    *id\t\t\t: int
    *answerText\t: string
    *questionId\t: int
}

entity AnswersUsers{
    *id\t\t\t: int
    *user\t\t\t: string
    *answerText\t: string[200]
    *answerId\t\t: int
    *questionId\t: int
    *surveyId\t\t: int
}

note right of AnswersUsers
* answerText : open-ended questions
* answerId : single/multiple choice questions
end note
Questions -- "0,*" Answers
Surveys -- "1,*" Questions
Answers -- AnswersUsers
Questions -- AnswersUsers
Admins -- Surveys
```
