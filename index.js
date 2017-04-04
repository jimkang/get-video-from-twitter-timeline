var Twit = require('twit');
var sb = require('standard-bail')();
var compact = require('lodash.compact');
var pathExists = require('object-path-exists');

var shortenedTwitterLinkWithLeadingSpaceRegex = /\s?https:\/\/t.co\/[\w\d]+/g;

var videoVariantsPath = ['extended_entities', 'media', '0', 'video_info', 'variants'];

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
  var videoTweets = compact(tweets.map(filterTweetToVideo));
  // console.log(videoTweets);
  done(null, videoTweets);
}

function filterTweetToVideo(tweet) {
  if (pathExists(tweet, videoVariantsPath)) {
    return {
      tweetId: tweet.id_str,
      caption: tweet.text.replace(shortenedTwitterLinkWithLeadingSpaceRegex, ''),
      date: tweet.created_at,
      videos: tweet.extended_entities.media[0].video_info.variants
    };
  }
}

module.exports = getVideoFromTwitterTimeline;
