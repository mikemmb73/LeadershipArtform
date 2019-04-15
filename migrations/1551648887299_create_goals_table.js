/*
Creates the goals table 
*/

module.exports = {
    "up": "CREATE TABLE goals(" +
    "goal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, coach_id INT, executive_id INT," +
    "title VARCHAR(255), description VARCHAR(255), progress INT," +
    "frequency INT, date_assigned DATE, currDueDate DATE, progress_acceptance INT)",
    "down": "DROP TABLE goals"
}
