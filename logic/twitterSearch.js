var util = require('util'),
  twitter = require('twitter'),
  sentimentAnalysis = require('./sentimentAnalysis'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);

var config = {
  consumer_key: '-- REPLACE YOUR KEY ',
  consumer_secret: '-- REPLACE YOUR KEY',
  access_token_key: '-- REPLACE YOUR KEY',
  access_token_secret: '-- REPLACE YOUR KEY'
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
