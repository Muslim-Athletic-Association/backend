const moment = require("moment");
const { setResult } = require("./constants");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

// TODO: all functions here just represent logic, we should add the actual functionality when the logic is completed.

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
        score1 = null,
        score2 = null
    ) {
        this.team1 = team1;
        this.team2 = team2;
        this.cgroup = cgroup;
        this.fixture_date = fixture_date;
        this.fixture_time = fixture_time;
        this.score1 = score1;
        this.score2 = score2;
    }
    /**
     * Check to see if another match is earlier than this one
     * @param {string} other representing the other team
     * @returns {bool}
     */
    isLaterThan(other) {
        return (
            this.fixture_date >= other.fixture_date &&
            this.fixture_time > other.fixture_time
        );
    }

    /**
     * Check to see if another match is at the same day and time
     * @param {string} other team name
     * @returns {bool}
     */
    sameDayAndTimeAs(other) {
        return (
            this.fixture_date == other.fixture_date &&
            this.fixture_time == other.fixture_time
        );
    }

    /**
     * Check to see if another match is at the same day
     * @param {string} other team name
     * @returns {bool}
     */
    sameDayAs(other) {
        return this.fixture_date == other.fixture_date;
    }

    /**
     * Check to see if another match is at the same time
     * @param {string} other team name
     * @returns {bool}
     */
    sameTimeAs(other) {
        return this.fixture_date == other.fixture_date;
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

    constructor(
        group,
        maxTeams,
        matches = [],
        startDate = null,
        endDate = null
    ) {
        this.matches = matches;
        this.teams = [];
        this.maxTeams = maxTeams;
        this.group = group;
        // unassigned stores the games that still don't have a date or time.
        this.unassigned = this.matches.filter(
            (match) => match.fixture_time != null
        );
        this.dates = {};
        this.startDate = startDate;
        this.endDate = endDate;
    }

    /**
     * Add a team to the schedule by creating match ups against all other teams.
     *
     * @param {string} team1 team name
     */
    addTeam(team1) {
        let num_teams = this.teams.length;
        for (var i = 0; i < num_teams; i++) {
            for (var j = i; i < num_teams; j++) {
                this.matches.push(new Match(team1, team2, this.group));
            }
        }
        this.teams.push(team1);
    }

    /**
     * Add times to the games based on a specific date
     * Games should be added to fields based on a modulos of available fields to time.
     * i.e. (endTime - startTime) % numFields
     * Note: the date is the same for all games that fit in the timeframe.
     *
     * @param {moment} startTime the start time for when the location is booked
     * @param {moment} endTime the end time for when the location is booked
     * @param {moment} date the day on which we have booked the location
     * @param {int} numFields the number of fields booked at the location
     * @param {int} matchLength based on the number of hours, this is how long a game is (can be float)
     */
    assignTimes(startTime, endTime, date, numFields, matchLength) {
        let scheduled = [];
        this.dates[date] = [];
        let bookingLength = startTime - endTime;
        // let maxGames = ((bookingLength) // matchLength) * numFields;
        for (var t = 0; t < bookingLength; t.add(matchLength, "hours")) {
            // Keep scheduling games until the bookingLength run out
            for (var f = numFields; numFields > 0; numFields--) {
                // Keep scheduling games at this matchLength until the fields run out
                let current = this.unassigned.pop();
                if (current == undefined) {
                    console.log(
                        "All matches have been assigned to a date and time."
                    );
                    return;
                }
                let datetime = t.toJSON().split(":");
                current.fixture_time = datetime[1];
                current.fixture_date = datetime[0];
                let conflict = false;
                this.dates[date].forEach((match) => {
                    if (match.sameTeam(current) && match.sameTimeAs(current)) {
                        conflict = true;
                    }
                });
                if (!conflict) {
                    scheduled.push(current);
                    this.dates[date].push(current);
                } else {
                    current.fixture_time = null;
                    current.fixture_date = null;
                }
            }
        }
        // Then we should update the database with the new times
    }

    /**
     * delete a match from our schedule
     * @param {Match} match
     */
    deleteMatch(match) {}

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
     * So far, all of the logic has been stored in a session (pretend it was),
     * now we will update the matches in the actual database.
     * @return {Object} result from database
     */
    uploadToDatabase() {}
}

/**
 * Givens:
 *  - A list of teams (and therefore the # of teams)
 *  - The maximum # of teams per division
 *
 *
 * We want to:
 *  - pair all of the teams (create a match up)
 *  - Add a time to each game (make sure each time does not conflict with the time of another team)
 *      - Make sure each team plays every other team at least once.
 *  - Set the score to be 0 - 0 for all games? or do we want this to be null to start? Likely null.
 *    This would require a schema change, so make sure it's right first.
 */

function generate_matches(teams, group) {
    // Create an unordered set of match-ups based on all of the teams in a single group.
    let schedule = new Schedule(group);
    teams.forEach((team) => {
        schedule.addTeam(team);
    });
}

// Have new functions modify the schedule based on new restrictions. i.e. only 6 weeks, but 12 games so then put two games per week.
function backToBack() {
    // TODO: Group matches on a specific date to be next to one another based on the team.
}
