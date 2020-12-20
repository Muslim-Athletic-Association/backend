CREATE TABLE class(
  -- Each program can have sub-divisions 
  class_id Serial primary key,
  name VARCHAR(50),
  start_time time,
  end_time time,
  instructor VARCHAR(50),
  program VARCHAR(50) NOT NULL,
  capacity INTEGER DEFAULT 0,


  constraint programDivFk foreign key (program) references program(name) on update cascade on delete cascade 
);

CREATE TABLE MemberClass (
  -- Each member can be registered for a program.

  member INTEGER,
  class INTEGER,

  constraint mcPk primary key (member, class),
  constraint memberFk foreign key (member) references member(id) on update cascade on delete cascade,
  constraint classFk foreign key (class) references class(class_id) on update cascade on delete cascade
);

insert into class (name, program, instructor, capacity, start_time, end_time) values ('Flow Family', 'Yoga', 'Sally', 10, '10:00 AM', '11:00 AM');
insert into class (name, program, instructor, capacity, start_time, end_time) values ('Flow Family', 'Yoga', 'Sally', 10, '11:30 AM', '12:30 PM'); --Both of these have the same name, but are at different times

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;