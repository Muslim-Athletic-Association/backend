CREATE TABLE program(
    program_id SERIAL PRIMARY KEY, 
    name VARCHAR(50),
    
    UNIQUE(name)
);

CREATE TABLE person
(
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(6),
    birthday DATE NOT NULL,
    password VARCHAR(50) NOT NULL,
    
    UNIQUE (email)
);

CREATE TABLE subscription(
    subscription_id SERIAL PRIMARY KEY,
    program INTEGER NOT NULL,
    name VARCHAR(50),
    start_date DATE,
    end_date DATE,
    price INTEGER,

    constraint subscriptionProgramFk foreign key (program) references program(program_id) on update cascade on delete cascade
);

CREATE TABLE registration(
    registration_id SERIAL PRIMARY KEY,
    person INTEGER,
    subscription INTEGER,
    datetime TIMESTAMP,
    payment INTEGER,

    UNIQUE(person, subscription),
    constraint registrationPersonFk foreign key (person) references person(person_id) on update cascade on delete cascade,
    constraint registrationSubscriptionFk foreign key (subscription) references subscription(subscription_id) on update cascade on delete cascade
);

CREATE TABLE consent (
    consent_id SERIAL PRIMARY KEY,
    person INTEGER,
    purpose VARCHAR(50),
    is_given BOOLEAN,
    datetime TIMESTAMP,

    constraint personConsentFk foreign key (person) references person(person_id) on update cascade on delete cascade,
    UNIQUE (person, purpose)
);

CREATE TABLE guardian(
    guardian_id SERIAL PRIMARY KEY,
    person INTEGER NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(30) NOT NULL,

    unique(person, phone, email),
    constraint personGuardianFk foreign key (person) references person(person_id) on update cascade on delete cascade
);

CREATE TABLE team(
    team_id SERIAL PRIMARY KEY,
    captain INTEGER,
    team_name VARCHAR(50) UNIQUE,
    team_capacity INTEGER,

    constraint teamCaptainFk foreign key (captain) references person(person_id) on update cascade on delete cascade
);

CREATE TABLE competition(
    competition_id SERIAL PRIMARY KEY,
    program INTEGER,
    title VARCHAR(50),
    
    UNIQUE (title),
    constraint programCompetitionFk foreign key (program) references program(program_id) on update cascade on delete cascade
);


CREATE TABLE competitionGroup(
    cgroup_id SERIAL PRIMARY KEY,
    competition INTEGER,
    cg_capacity INTEGER,
    level INTEGER,

    constraint groupCompetitionFk foreign key (competition) references competition(competition_id) on update cascade on delete cascade
);

CREATE TABLE player(
    player_id SERIAL PRIMARY KEY,
    team INTEGER,
    person INTEGER,

    UNIQUE(team, person),
    constraint playerTeamFk foreign key (team) references team(team_id) on update cascade on delete cascade,
    constraint playerPersonFk foreign key (person) references person(person_id) on update cascade on delete cascade
);

CREATE TABLE fixture(
    fixture_id SERIAL PRIMARY KEY,
    team1 INTEGER,
    team2 INTEGER,
    competition INTEGER,
    fixture_date DATE,
    fixture_time TIME,
    score1 INTEGER,
    score2 INTEGER,

    constraint fixtureTeam1Fk foreign key (team1) references team(team_id) on update cascade on delete cascade,
    constraint fixtureTeam2Fk foreign key (team2) references team(team_id) on update cascade on delete cascade,
    constraint fixtureCompetitionFk foreign key (competition) references competition(competition_id) on update cascade on delete cascade
);

CREATE Table session(
    session_id SERIAL PRIMARY KEY,
    program INTEGER,
    title VARCHAR(50) NOT NULL, --The type of session
    instructor VARCHAR(50),
    session_capacity INTEGER,
    session_time TIME,
    session_day VARCHAR(20), -- This will be a day of the week. TODO: add this to the ERD diagram
    start_date DATE,
    count INTEGER, --The number of sessions that occur after the start date
    location VARCHAR(20),

    constraint sessionProgramFk foreign key (program) references program(program_id) on update cascade on delete cascade

);

CREATE TABLE soccerPlayerFixture(
    soccer_id SERIAL PRIMARY KEY,
    player INTEGER,
    fixture INTEGER,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    red_card INTEGER DEFAULT 0,

    constraint soccerPlayerFk foreign key (player) references player(player_id) on update cascade on delete cascade,
    constraint soccerPlayerFixtureFk foreign key (fixture) references fixture(fixture_id) on update cascade on delete cascade
);

CREATE TABLE teamRecord(
    team_record_id SERIAL PRIMARY KEY,
    group_id INTEGER,
    team INTEGER,
    fixtures_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    ties INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    
    constraint teamRecordTeamFk foreign key (team) references team(team_id) on update cascade on delete cascade,
    constraint teamRecordCompetitionGroupFk foreign key (group_id) references competitionGroup(cgroup_id) on update cascade on delete cascade
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;
