module.exports = {
    "up": "CREATE TABLE notes(" +
    "executive_id INT, coach_id INT, info VARCHAR(8000))",
    "down": "DROP TABLE notes"
}
