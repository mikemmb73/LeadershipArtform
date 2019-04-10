module.exports = {
    "up": "CREATE TABLE executives(" +
    "executive_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
    "email VARCHAR(255), password VARCHAR(255)," +
    "fname VARCHAR(255), lname VARCHAR(255), phone_number VARCHAR(255)," +
    "message TEXT," +
    "bio VARCHAR(8000), photo VARCHAR(255), coach_id INT)",
    "down": "DROP TABLE executives"
}
