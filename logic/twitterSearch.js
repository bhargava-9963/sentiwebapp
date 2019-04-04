var util = require('util'),
  twitter = require('twitter'),
  sentimentAnalysis = require('./sentimentAnalysis'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);

var config = {
  consumer_key: 'BBuMAvMxIScw53ra1ikDjRzfn ',
  consumer_secret: '5aZloWyUWaLDdkI1ulNAykaEYiXsMM8yXUJlCXJwNYTlvpJ65i',
  access_token_key: '779997720710746112-uJqES2a4bd86PZ6TNlbzoGFIgkFo0qA',
  access_token_secret: 'FOuh3gXSKTGrJWbnPVC1FYyBhzkKSK2LIT82Dpr30sw8Q'
}

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = [];
  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};
      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        "tweet" : resp.tweet.text,
        "score" : resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}
