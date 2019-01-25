var util = require('util');

module.exports = class ScoresRepository {

    constructor(conn) {
        this.conn = conn;
        this.queryAsync = util.promisify(conn.query).bind(conn);
        this.tableName = 'Scores';
    }


    async retrieveByID(id) {
        try {
            var paramQuery = 'SELECT * FROM ?? WHERE ID = ?;';
            var params = [this.tableName, id];
            
            var result = await this.queryAsync(paramQuery, params);
            return (result.length == 0) ? result : result[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async retrieveByName(name) {
        try {
            var paramQuery = 'SELECT * FROM ?? WHERE Name = ?;';
            var params = [this.tableName, name];
            
            var result = await this.queryAsync(paramQuery, params);
            return (result.length == 0) ? result : result[0];
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async retrieveAll() {
        try {
            var paramQuery = 'SELECT * FROM ??;';
            var params = [this.tableName];
            
            var result = await this.queryAsync(paramQuery, params);
            return result;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async insert(score) {
        if (!score)
            return;

        try {
            score.points = score.points.map(x => {
                if (x == '')
                    return 0;
                return x;
            });

            var paramQuery =
                `INSERT INTO ?? (Name, Surname, Subject, Points1, Points2, Points3, Points4, Points5, Points6, Points7, Points8, Points9, Points10)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            var params = [this.tableName, score.firstname, score.lastname, score.subject];
            for (let i = 0; i < 10; i++)
                params.push(score.points[i]);
            
            var result = await this.queryAsync(paramQuery, params);
            return result;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}