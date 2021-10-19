CREATE TABLE basketballPlayerFixture(
    soccer_id SERIAL PRIMARY KEY,
    player INTEGER,
    fixture INTEGER,
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    fouls INTEGER DEFAULT 0,

    constraint soccerPlayerFk foreign key (player) references player(player_id) on update cascade on delete cascade,
    constraint soccerPlayerFixtureFk foreign key (fixture) references fixture(fixture_id) on update cascade on delete cascade
);

/* Purpose of the below view is to attach a person's info to their player profile */
create view playerInfo as SELECT * from player pl join person pe on pl.person=pe.person_id;

/* Purpose of the below view is to view a team roster with player information */
create view roster as SELECT * from playerInfo pli join team t on t.team_name=pli.team;

/* Purpose of the below view is to attach a player's info to their match stats for soccer */
create view soccerPlayerStats as SELECT * from playerInfo pli join soccerPlayerFixture spf on pli.player_id=spf.player;

/* Purpose of the below view is to attach a player's info to their match stats for basketball*/
create view basketballPlayerStats as SELECT * from playerInfo pli join basketballPlayerFixture bpf on pli.player_id=bpf.player;


GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;