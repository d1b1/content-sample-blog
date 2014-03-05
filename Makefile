
heroku:
	export NODE_ENV="development"; \
	export API_URL="http://tosheroon.herokuapp.com"; \
	nodemon index.js --ignore builtAssets
