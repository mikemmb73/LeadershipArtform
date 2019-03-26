module.exports = {
    "up": "CREATE TABLE responses(" +
    "response_id INT NOT NULL AUTO_INCREMENT, question_id INT, goal_id INT, response_date DATE, answer VARCHAR(255), PRIMARY KEY(response_id))",
    "down": "DROP TABLE responses"
}
