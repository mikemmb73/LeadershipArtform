module.exports = {
    "up": "CREATE TABLE questions(" +
    "goal_id INT, title VARCHAR(255), type INT, answer VARCHAR(8000))",
    "down": "DROP TABLE questions"
}
