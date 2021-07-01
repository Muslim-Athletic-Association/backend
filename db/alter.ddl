/* ALTER TABLE fixture DROP COLUMN cgroup;
ALTER TABLE fixture ADD COLUMN cgroup integer;
ALTER TABLE fixture ADD CONSTRAINT fixtureCompetitionFk foreign key (cgroup) references competitionGroup(cgroup_id) on update cascade on delete cascade; */


ALTER TABLE fixture DROP COLUMN team1;
ALTER TABLE fixture DROP COLUMN team2;
ALTER TABLE fixture ADD COLUMN team1 VARCHAR(50);
ALTER TABLE fixture ADD COLUMN team2 VARCHAR(50);
ALTER TABLE fixture ADD CONSTRAINT fixtureTeam1Fk foreign key (team1) references team(team_name) on update cascade on delete cascade;
ALTER TABLE fixture ADD CONSTRAINT fixtureTeam2Fk foreign key (team2) references team(team_name) on update cascade on delete cascade;


/* Constraints that should be added to fixtures:
    unique(team1, date, time) --> No team should have two games at the same time.
    unique(team2, date, time)
 */