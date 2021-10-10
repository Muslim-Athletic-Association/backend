create view personRegistration as select program.name as program_name, foo.name as subscription_name, start_date, end_date, person from program join (select * from registration join subscription on registration.subscription = subscription.subscription_id) as foo on foo.program=program.program_id;

/* Purpose of the below view is to attach the title and program to the competition group */
create view competitionOverview as SELECT * from competition c join competitionGroup cg on c.competition_id=cg.competition;

/* Purpose of the below view is to attach the team to the team record */
create view teamOverview as SELECT * from team t join teamRecord tr on t.team_id=tr.team;

/* Purpose of the below view is to attach teamOverview to competitionOverview */
create view teamCompetition as SELECT * from teamOverview teo join competitionOverview coo on teo.group_id=coo.cgroup_id;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;
