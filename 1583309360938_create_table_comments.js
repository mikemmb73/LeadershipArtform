module.exports = {
	"up": "CREATE TABLE comments (" +
	"comment_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  " +
	"coach_id int, exectuive_id int, " +
	"sent_by_coach boolean, sent_by_executive boolean, " +
	"message varchar(255), dt datetime" +
	");",
	"down": "DROP TABLE comments"
}