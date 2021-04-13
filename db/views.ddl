create view personRegistration as select program.name, start_date, end_date, person from program join (select * from registration join subscription on registration.subscription = subscription.subscription_id) as foo on foo.program=program.program_id;
create view ramadanRegistered as select * from person join personRegistration on person_id=person where name='Ramadan Wellness';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;
