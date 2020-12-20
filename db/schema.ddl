-- This is a temporary db. This should not be the final schema but we will work with this for now.
-- Before making db changes, always back up the database (pg_dump).

CREATE TABLE program(
  -- This is so that we can request all of the program names.
  
  pgid SERIAL PRIMARY KEY, 
  name VARCHAR(50) UNIQUE, --The name of the program, to be referenced in other tables.
  individualPrice INTEGER DEFAULT 0, -- Tells us the pricing for an individual. (0 if no individuals)
  groupPrice INTEGER DEFAULT 0, -- Tells us the pricing for a group. (0 if no groups)
  gender VARCHAR(10) NOT NULL,
  capacity INTEGER DEFAULT 0, -- Tells us the maximum capacity for a program, 0 if no capacity
  numRegistered INTEGER DEFAULT 0, -- The # of people registered for a programs
  photo BOOLEAN DEFAULT FALSE -- Tells us if we need registrants to upload photos for individual registration.
);

CREATE TABLE member
(
  -- This is so that we can store and retain information about members, it also allows us to filter them by program, gender, age... etc.

  id SERIAL PRIMARY KEY,
  fName VARCHAR(30) NOT NULL, -- First name
  lName VARCHAR(30) NOT NULL, -- Last name
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(50) NOT NULL,
--   Also need to figure out how to store an image in this location (or atleast a reference to the image.) 

  UNIQUE (fname, lname, phone) --We will search for members based on a combination of these three names
);

CREATE table guardian(
    gid SERIAL PRIMARY KEY,
    member INTEGER NOT NULL,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    constraint memGuardFk foreign key (member) references member(id) on update cascade on delete cascade
);

CREATE TABLE programMember (
  -- Each member can be registered for a program.

  member INTEGER,
  program VARCHAR(50),
  paid BOOLEAN,

  constraint pmPk primary key (member, program),
  constraint memberFk foreign key (member) references member(id) on update cascade on delete cascade,
  constraint programFk foreign key (program) references program(name) on update cascade on delete cascade
);

CREATE TABLE consent (
  member_id INTEGER,
  program_name VARCHAR(50),
  purpose VARCHAR(50),
  consent BOOLEAN,

  constraint consentPk primary key (member_id, purpose),
  constraint consentMemberFk foreign key (member_id) references member(id) on update cascade on delete cascade,
  constraint consentProgramFk foreign key (program_name) references program(name) on update cascade on delete cascade
);

insert into program (name, individualPrice, groupPrice, gender, capacity, photo) values ('mens over 18 soccer league covid 1', 113, 980, 'Male', 200, TRUE);
insert into program (name, gender) values ('Yoga', 'Female');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;
