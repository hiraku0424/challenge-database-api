var db = new (require("sqlite3")).Database("C:/Users/Nick/Documents/Visual Studio 2013/Projects/challenge-database-api/challenge-database-api/sql/database.db");

exports.insertChallenge = function (challenge, callback) {
    db.run("INSERT INTO challenges (name, description, date) VALUES ($name, $description, $date)", {
        $name: challenge.name,
        $description: challenge.description,
        $date: challenge.date
    }, function (err) {
        callback(this.lastID);
    });
};

exports.updateChallenge = function (challengeId, challenge, callback) {
    db.run("UPDATE challenges SET name = $name, description = $description, date = $date WHERE id = $id", {
        $name: challenge.name,
        $description: challenge.description,
        $date: challenge.date,
        $id: challengeId
    }, callback);
};

exports.getChallenge = function (challengeId, callback) {
    db.get("SELECT * FROM challenges WHERE id = $id", {
        $id: challengeId
    }, function (err, row) {
        callback(row);
    });
}

exports.deleteChallenge = function (challengeId, callback) {
    db.run("DELETE FROM challenges WHERE id = $id", {
        $id: challengeId
    }, callback);
}