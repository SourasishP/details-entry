const mysql=require('mysql')
const db_conn=mysql.createConnection({
	host:"localhost",
	user:"test",
	password:"test1234",
	database:"details-entry"
});
module.exports=db_conn;