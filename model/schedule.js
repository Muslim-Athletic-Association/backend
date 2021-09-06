const moment = require("moment");
const { setResult } = require("./constants");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

// TODO: Lots of edge cases to handle. Handle them as they come along, not all at once.

moment().format();

/**
 * Represents a fixture, with the same structure as the db.
 *
 * TODO: Some columns should be changed to be nullable in the schema.
 */
class Match {
    constructor(
        team1,
        team2,
        cgroup,
        fixture_date = null,
        fixture_time = null,
        score1 = -1,
        score2 = -1
    ) {
        this.team1 = team1;
        this.team2 = team2;
        this.cgroup = cgroup;
        this.date = fixture_date;
        this.time = fixture_time;
        this.score1 = score1;
        this.score2 = score2;
    }

    /**
     * Create a fixture in the database
     * @return {Object} database insertion result
     */
    async create() {
        let date = this.date ? this.date.format("YYYY-MM-DD") : null;
        let time = this.time ? this.time.format("HH:MM:SS") : null;
        let sql =
            "INSERT INTO fixture (team1, team2, cgroup, fixture_date, fixture_time) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
        let params = [this.team1, this.team2, this.cgroup];
        let msg = new c.Message({
            success: `Created match \n ${this.toString()}`,
            duplicate: `A Match already exists on ${this.date} or ${this.time} for one of ${this.team1} or ${this.team2}.`,
            foreign: `Either team: ${this.team1} or ${this.team2} or group: ${this.cgroup} does not exist.`,
        });
        return await c.create(sql, params, msg);
    }

    /**
     * So far, all of the logic has been stored in a session (pretend it was),
     * now we will update the matches in the actual database.
     * @return {Object} result from database
     */
    async update() {
        let old = this.toString();
        let sql =
            "UPDATE fixture SET team1 = $1, team2 = $2, cgroup = $3, fixture_date = $4, fixture_time = $5 RETURNING *;";
        let params = [
            this.team1,
            this.team2,
            this.cgroup,
            this.date.format("YYYY-MM-DD"),
            this.time.format("HH:MM:SS"),
        ];
        let msg = new c.Message({
            success: `Updated match \n old: ${old} \n new: ${this.toString()}`,
            duplicate: `A Match already exists on ${this.date} or ${this.time} for one of ${this.team1} or ${this.team2}.`,
            foreign: `Either team: ${this.team1} or ${this.team2} or group: ${this.cgroup} does not exist.`,
        });
        let falafel = await c.update(sql, params, msg);
        console.log(falafel);
    }

    /**
     * Check to see if another match is earlier than this one
     * @param {string} other representing the other team
     * @returns {bool}
     */
    isLaterThan(other) {
        return (
            this.date >= other.fixture_date && this.time > other.fixture_time
        );
    }

    /**
     * Check to see if another match is at the same day and time
     * @param {string} other team name
     * @returns {bool}
     */
    sameDayAndTimeAs(other) {
        return (
            this.date == other.fixture_date && this.time == other.fixture_time
        );
    }

    /**
     * Check to see if another match is at the same day
     * @param {string} other team name
     * @returns {bool}
     */
    sameDayAs(other) {
        return this.date == other.fixture_date;
    }

    /**
     * Check to see if another match is at the same time
     * @param {string} other team name
     * @returns {bool}
     */
    sameTimeAs(other) {
        return this.date == other.fixture_date;
    }

    /**
     * Checks to see if the two teams are playing each other in both matches
     * @param {string} other team name
     * @returns {bool}
     */
    sameMatchUp(other) {
        return (
            ((this.team1 == other.team1 && this.team2 == other.team2) ||
                (this.team1 == other.team2 && this.team2 == other.team1)) &&
            this.cgroup == other.cgroup
        );
    }

    /**
     * Checks to see if a team is playing in both matches
     * @param {string} other team name
     * @returns {bool}
     */
    sameTeam(other) {
        return (
            (this.team1 == other.team1 ||
                this.team1 == other.team2 ||
                this.team2 == other.team1 ||
                this.team2 == other.team2) &&
            this.cgroup == other.cgroup
        );
    }
    /**
     * Sets the date and time for the match.
     * @param {moment} t
     */
    setDateTime(t) {
        let datetime = t.toJSON().split(":");
        this.time = new moment(datetime[1]);
        this.date = new moment(datetime[0]);
        this.update();
    }

    toString() {
        return `${this.team1} | ${this.score1}:${this.score2} | ${this.team2} at ${this.date} on ${this.time} in group ${this.cgroup}`;
    }

    /**
     * Check to see if this is the same game as other
     * @param {string} other team name
     * @returns {bool}
     */
    checkSame(other) {
        return this.sameMatchUp(other) && this.sameDayAndTimeAs(other);
    }
}

class Schedule {
    // Each schedule will be specific to a division

    constructor(group, matches = [], startDate = null, endDate = null) {
        this.matches = matches;
        this.teams = [];
        this.group = group;
        this.dates = {};
        this.startDate = startDate;
        this.endDate = endDate;
    }

    /**
     * Add a team to the schedule by creating match ups against all other teams.
     * We will only create one match up for the time being.
     * @param {string} team1 team name
     */
    async addTeam(team1) {
        let num_teams = this.teams.length;
        for (var i = 0; i < num_teams; i++) {
            let team2 = this.teams[i];
            let match = new Match(team1, team2, this.group);
            await match.create();
            this.matches.push(match);
        }
        this.teams.push(team1);
    }

    /**
     * Create a schedule based on a single day of the week i.e. every sunday between 1-4.
     * TODO: consider adding a booking table to psql instead of passing everything in all the time.
     *
     * @param {moment} startTime the start time for when the location is booked
     * @param {moment} endTime the end time for when the location is booked
     * @param {moment} date the day on which we have booked the location
     * @param {int} numFields the number of fields booked at the location
     * @param {int} matchLength based on the number of hours, this is how long a game is (can be float)
     */
    async weekdaySchedule(
        startTime,
        endTime,
        startDate,
        numFields,
        matchLength
    ) {
        var duration = moment.duration(endTime.diff(startTime));
        var bookingLength = duration.asHours();
        let numDays =
            Math.floor(this.matches.length / (bookingLength * numFields)) + 1;
        let endDate = new moment(startDate).add(numDays, "weeks");
        for (var date = startDate; date < endDate; date.add(1, "weeks")) {
            this.dates[date] = [];
            this.prepareMatchDay(
                startTime,
                endTime,
                date,
                numFields,
                matchLength
            );
        }
        return c.setResult(
            { blah: "coolio" },
            true,
            "Falafel",
            c.errorEnum.NONE
        );
    }

    /**
     * Add times to the games based on a specific date
     * Games should be added to fields based on a modulos of available fields to time.
     * i.e. (endTime - startTime) % numFields
     * Note: the date is the same for all games that fit in the timeframe.
     * Used in assignTimesOnDay()
     *
     * @param {moment} startTime the start time for when the location is booked
     * @param {moment} endTime the end time for when the location is booked
     * @param {moment} date the day on which we have booked the location
     * @param {int} numFields the number of fields booked at the location
     * @param {int} matchLength number of hours, this is how long a game is (can be float)
     */
    prepareMatchDay(startTime, endTime, date, numFields, matchLength) {
        let scheduled = [];
        let current;
        let m = this.matches.length - 1;
        for (var t = startTime; t < endTime; t.add(matchLength, "hours")) {
            // Keep scheduling matches on this day until the booked time runs out
            console.log("??");
            for (var f = numFields; f > 0 && m > 0; f--) {
                // Keep scheduling games at this matchLength until the fields run out
                current = this.matches[m];
                m--;
                console.log("!!");
                current.setDateTime(t);
                scheduled.push(current);
                this.dates[date].push(current);
            }
        }
        return scheduled;
    }

    /**
     * Move all games that were scheduled for originalDate to newDate
     * @param {moment} originalDate
     * @param {moment} newDate
     */
    moveDay(originalDate, newDate) {
        let date = originalDate.toJSON().split(":")[0];
        let nDate = newDate.toJSON().split(":")[0];
        let matches = this.dates[date];
        matches.forEach((match) => {
            match.fixture_date = newDate;
        });
        this.dates[nDate] = matches;
        delete this.dates[date];
    }

    /**
     * This function's purpose is to find conflicts in datetimes in your own schedule
     * Note: The conflicts are (and should be) limited to this schedule.
     *
     */
    find_conflicts() {}

    /**
     * delete a match from our schedule
     * @param {Match} match
     */
    deleteMatch(match) {}
}

/**
 *
 * @param {list} teams team names
 * @param {int} group
 */
async function generate_matches(teams, group) {
    // Create an unordered set of match-ups based on all of the teams in a single group.
    let schedule = new Schedule(group);
    for (var team = 0; team < teams.length; team++) {
        await schedule.addTeam(teams[team]);
    }
    startTime = new moment("12-25-2021", "MM-DD-YYYY");
    endTime = new moment("12-25-2021", "MM-DD-YYYY");
    startTime.add(4, "hours");
    endTime.add(8, "hours");
    return await schedule.weekdaySchedule(startTime, endTime, startTime, 4, 1);
}

module.exports = {
    generate_matches: generate_matches,
};
