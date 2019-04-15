/*
Creates the questions table 
*/

module.exports = {
    "up": "CREATE TABLE questions(" +
    "question_id INT NOT NULL AUTO_INCREMENT, goal_id INT, title VARCHAR(255), type INT, qs VARCHAR(8000), PRIMARY KEY(question_id))",
    "down": "DROP TABLE questions"
}
