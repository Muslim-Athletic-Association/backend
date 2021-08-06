const { setResult } = require("./constants");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

class Match {
    // This class defines the structure expected by the psql database
    // TODO: Some columns should be changed to be nullable in the schema.

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
    isLaterThan(other) {
        // Check to see if another match is earlier than this one
        return (
            this.fixture_date >= other.fixture_date &&
            this.fixture_time > other.fixture_time
        );
    }

    sameTimeAs(other) {
        // Check to see if another match is at the same time
        return (
            this.fixture_date == other.fixture_date &&
            this.fixture_time == other.fixture_time
        );
    }

    sameMatchUp(other) {
        // Check to see if the two teams playing each other twice
        return (
            ((this.team1 == other.team1 && this.team2 == other.team2) ||
                (this.team1 == other.team2 && this.team2 == other.team1)) &&
            this.cgroup == other.cgroup
        );
    }

    checkSame(other) {
        // Check to see if this is the same game as other
        return this.sameMatchUp(other) && this.sameTimeAs(other);
    }
}

class Schedule {
    // Each schedule will be specific to a division

    constructor(group) {
        this.matches = [];
        this.teams = [];
        this.group = group;
    }

    addTeam(team1) {
        let num_teams = this.teams.length;
        for (var i = 0; i < num_teams; i++) {
            for (var j = i; i < num_teams; j++) {
                this.matches.push(new Match(team1, team2, this.group));
            }
        }
        console.log(this.matches.length);
        console.log(this.matches);
        this.teams.push(team1);
    }
}

/**
 * Givens:
 *  - The # of teams (and who they are)
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
