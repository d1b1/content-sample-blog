
heroku:
	export NODE_ENV="development"; \
	export API_URL="http://localhost:3000"; \
	nodemon index.js --ignore builtAssets
