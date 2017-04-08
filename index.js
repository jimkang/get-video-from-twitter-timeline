var Twit = require('twit');
var sb = require('standard-bail')();
var compact = require('lodash.compact');
var boilTweetToVideo = require('boil-tweet-to-video');

function getVideoFromTwitterTimeline(opts, done) {
  var twitterCreds;
  var getTweetsAfterTweetId;
  var getTweetsBeforeTweetId;

  if (opts) {
    twitterCreds = opts.twitterCreds;
    getTweetsAfterTweetId = opts.getTweetsAfterTweetId;
    getTweetsBeforeTweetId = opts.getTweetsBeforeTweetId;
  }
  var twit = new Twit(twitterCreds);

  var timelineOpts = {
    // since_id: 100,
    // max_id: '848642411014303700',
    trim_user: true,
    exclude_replies: true,
    include_rts: false
  };

  if (getTweetsAfterTweetId) {
    timelineOpts.since_id = getTweetsAfterTweetId;
  }
  if (getTweetsBeforeTweetId) {
    timelineOpts.max_id = getTweetsBeforeTweetId;
  }

  twit.get(
    'statuses/user_timeline',
    timelineOpts,
    sb(filterTweetsToVideo, done)
  );
}

function filterTweetsToVideo(tweets, response, done) {
  var videoTweets = compact(tweets.map(boilTweetToVideo));
  // console.log(videoTweets);
  done(null, videoTweets);
}

module.exports = getVideoFromTwitterTimeline;
