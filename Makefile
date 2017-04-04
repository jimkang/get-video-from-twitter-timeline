test:
	node tests/get-video-tests.js

pushall:
	git push origin master && npm publish
