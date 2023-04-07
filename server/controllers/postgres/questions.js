const client = require('../../db/postgres/connection.js').client
const controller = require('./index.js')

module.exports = {

  get: function (req, res) {
    let product_id = req.options.params.product_id

    if (product_id === undefined) {
      res.status(404).send('Must provide a "product_id" parameter')
    }

    var queryStr =
      `select questions.id as "question_id", questions.question_body, questions.instant, questions.asker_name, questions.asker_email, questions.reported, questions.helpful, \
      answers.id as "answer_id", answers.answer_body, answers.answerer_name, answers.answerer_email, answers.helpful as "answer_helpful", answers.reported as "answers_reported",  answers.instant as "answer_instant", \
      answer_photos.id as "photo_id", answer_photos.url \
      from questions\
      left outer join answers on (questions.id = answers.question_id)\
      left outer join answer_photos on(answers.id = answer_photos.answer_id)\
      where questions.product_id=${product_id} \
      `
      // `select * from questions\
      // where questions.product_id=${product_id}`


    client.query(queryStr)
      .then((data) => {

        let payload = {}
        payload.product_id = product_id
        payload.results = []

        let obj = {}
        let prevQid
        let prevAid

        // Loop through each row and parse into expected format
        // Each row = 1 question + answer + url
        for (var i = 0; i < data.rows.length; i++) {
          let row = data.rows[i]


          // if a new question, then save old object and prime a new one
          if (row.question_id !== prevQid) {
            if (i > 0) {
              payload.results.push(obj)
            }

            obj = {
              question_id: row.question_id,
              question_body: row.question_body,
              question_date: row.instant,
              asker_name: row.asker_name,
              asker_email: row.asker_email,
              question_helpfulness: row.helpful,
              reported: row.reported,
              answers: {}
            }
          }

          // Process Answers
          if (row.answer_id !== prevAid) {
            obj.answers[row.answer_id] = {
              "id": +row.answer_id,
              "body": row.answer_body,
              "date": row.answer_instant,
              "answerer_name": row.answerer_name,
              "helpfulness": row.answer_helpful,
              "photos": []
            }
          }

          // Process Photos
          obj.answers[row.answer_id].photos.push(row.url)

          // handle if only one result
          if (data.rows.length === 1) {
            payload.results.push(obj)
          }

          prevQid = row.question_id
          prevAid = row.answer_id


        }
        return payload

      // client.end()
    }).then((payload) => {
      res.send(payload)
    }).catch((err) => {
      console.log('err', err.message)
    })
  },


  post: function (req, res) {
    var params = [req.body.message, req.body.username, req.body.roomname];
    models.questions.create(params, function(err, results) {
      if (err) {
        console.error('Unable to post questions to the database: ', err);
        res.sendStatus(500);
      }
      res.sendStatus(201);
    });
  }
  };
