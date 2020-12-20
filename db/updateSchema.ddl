CREATE table matches(
    matchid SERIAL PRIMARY KEY,
    program VARCHAR(50) NOT NULL,
    division INTEGER NOT NULL,
    home INTEGER NOT NULL,
    away VARCHAR(30) NOT NULL,
    gametime DATE NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    
    constraint hteamFk foreign key (home) references team(teamid) on update cascade on delete cascade,
    constraint ateamFk foreign key (away) references team(teamid) on update cascade on delete cascade,
    constraint ateamFk foreign key (division) references division(division) on update cascade on delete cascade,
    constraint ateamFk foreign key (program) references program(name) on update cascade on delete cascade
);

INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 2, 'No weak foot', 'Thunder', '20200829 9:10:00 PM');
INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 1, 'Alps FC', 'Regala FC', '20200829 8:10:00 PM');
INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 1, 'Wa7sh FC', 'Gen-Z SC', '20200829 8:10:00 PM');

INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 2, 'No weak foot', 'Fennec', '20200829 7:00:00 PM');
INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 2, 'Liverpool FC', 'Thunder', '20200829 7:00:00 PM');
INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 1, 'Alps FC', 'Gen-Z SC', '20200829 6:00:00 PM');
INSERT INTO matches (program, division, home, away, gametime) VALUES ('mens over 18 soccer league covid 1', 1, 'Wa7sh FC', 'Regala FC', '20200829 6:00:00 PM');

/* 

Div 1
------
Alps FC
Regala FC
Gen-Z SC
Wa7sh FC

Div 2
-------
Fennec
No Weak Foot
Liverpool FC
Thunder

 */

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;