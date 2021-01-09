create view personRegistration as select name, start_date, end_date, person from program join (select * from registration join subscription on registration.subscription = subscription.subscription_id) as foo on foo.program=program.program_id;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maadmin;