CREATE TABLE division(
  -- Each program can have sub-divisions 
  division INTEGER NOT NULL,
  program VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,

  constraint programDivFk foreign key (program) references program(name) on update cascade on delete cascade,
  constraint divPk primary key (division, program) 
);

CREATE TABLE team
(
  teamId SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  division INTEGER NOT NULL,
  program VARCHAR(50) NOT NULL,
  captain INTEGER NOT NULL,
  paid BOOLEAN DEFAULT 'false',
  points INTEGER  DEFAULT 0,
  fixturesPlayed INTEGER   DEFAULT 0,
  wins INTEGER  DEFAULT 0,
  losses INTEGER  DEFAULT 0,
  draws INTEGER  DEFAULT 0,
  goalsFor INTEGER  DEFAULT 0,
  goalsAgainst INTEGER   DEFAULT 0,
  goalDifferential INTEGER   DEFAULT 0,
  
  -- UNIQUE (name, division, program),
  UNIQUE (name, program, captain),
  UNIQUE (program, captain, division),
  UNIQUE (program, captain),
  UNIQUE (name, program),
  constraint tDivisionFk foreign key (division, program) references division(division, program) on update cascade on delete cascade,
  constraint tCaptainFk foreign key (captain) references member(id) on update cascade on delete cascade
);

CREATE TABLE soccerPlayer(
  -- This table records the stats for individual league soccer players
  pid SERIAL PRIMARY KEY, 
  member INTEGER NOT NULL,
  program VARCHAR(50) NOT NULL,
  division INTEGER NOT NULL,
  team INTEGER NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellowCards INTEGER DEFAULT 0,
  redCards INTEGER DEFAULT 0,
  appearances INTEGER DEFAULT 0,

  constraint memberPlayerFk foreign key (member) references member(id) on update cascade on delete cascade,
  constraint playerDivisionFk foreign key (division, program) references division(division, program) on update cascade on delete cascade,
  UNIQUE (member, program),
  CONSTRAINT pteamFk FOREIGN KEY (team) REFERENCES team(teamId) on update cascade on delete cascade

);

insert into division (division, program, capacity) values (1, 'mens over 18 soccer league covid 1', 16);
