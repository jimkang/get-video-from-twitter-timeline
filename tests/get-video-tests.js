var test = require('tape');
var config = require('../config');
var getVideoFromTwitterTimeline = require('../index');
var  assertNoError = require('assert-no-error');

test('Get videos test', getVideosTest);

function getVideosTest(t) {
  var getOpts = {
    twitterCreds: config.twitter,
    getTweetsAfterTweetId: 100
  };
  getVideoFromTwitterTimeline(getOpts, checkVideoPackages);

  function checkVideoPackages(error, videoPackages) {
    assertNoError(t.ok, error, 'No error while getting videos.');
    t.ok(videoPackages.length > 0, 'At least one video package was retrieved.');
    videoPackages.forEach(checkPackage);

    console.log(JSON.stringify(videoPackages, null, '  '));
    t.end();
  }

  function checkPackage(package) {
    t.equal(typeof package.tweetId, 'string', 'Package has a tweet id.');
    t.equal(typeof package.caption, 'string', 'Package has a caption.');
    t.equal(typeof package.date, 'string', 'Package has a date.');
    t.ok(package.videos.length > 0, 'There is at least one video in the package.');
    package.videos.forEach(checkVideo);
  }

  function checkVideo(video) {
    t.equal(typeof video.content_type, 'string', 'Video has a content_type.');
    t.equal(typeof video.url, 'string', 'Video has a url.');
  }
}
