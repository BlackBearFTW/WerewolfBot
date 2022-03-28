module.exports = {
	"type": "mysql",
	"host": process.env.DB_HOST,
	"port": 3306,
	"username": process.env.DB_USER,
	"password": process.env.DB_PASSWORD,
	"database": process.env.DB_NAME,
	"synchronize": true,
	"entities": [
		"src/models/*.ts"
	],
	"migrations": [
		"src/migrations/*.ts"
	],
	"cli": {
		"entitiesDir": "src/models"
	}
};