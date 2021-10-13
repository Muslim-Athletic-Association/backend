const faker = require("faker");
const utils = require("./utils");
const apiGET = utils.apiGET;
const apiPOST = utils.apiPOST;
const setup = require("./setup");
const moment = require("moment");
const seedData = setup.seedData;

function teamTests() {
    let person;
    let person2;
    let captain1;
    let subscription;
    let teams;
    let newPerson2;
    let competition;

    beforeAll(async () => {
        let newPerson = {
            first_name: faker.name.findName(),
            last_name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "false",
            birthday: new moment(faker.date.past(100)).format("YYYY-MM-DD"),
        };
        newPerson2 = {
            first_name: faker.name.findName(),
            last_name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "false",
            birthday: new moment(faker.date.past(100)).format("YYYY-MM-DD"),
        };

        let resp1 = await apiPOST(`/addPerson`, newPerson);
        person = { ...resp1.data.data[0], birthday: newPerson.birthday };
        subscription = seedData.subscription[1];
        person2 = seedData.person[0];
        captain1 = seedData.person[1];
        competition = seedData.competition[0];
        teams = seedData.team;
    }, 30000);

    it("Get a team by the captain.", async () => {
        const resp1 = await apiGET(`/getTeam/${person2.email}`);
        let data = resp1.data.data[0];
        expect(resp1.data.success).toEqual(false);

        let team = teams[0];
        const resp2 = await apiGET(`/getTeam/${captain1.email}`);
        data = resp2.data.data[0];
        expect(resp2.data.success).toEqual(true);
        expect(data.email).toEqual(captain1.email);
        expect(data.team_name).toEqual(team.team_name);
    });

    it("Create a team when not already subscribed to program.", async () => {
        let newTeam = {
            ...newPerson2,
            team_name: "TEST C FC",
            team_capacity: 12,
            subscription: subscription.subscription_id,
            datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
            consent: [],
        };

        let resp1 = await apiPOST(`/team/create`, newTeam);
        let team = resp1.data.data[0];
        expect(resp1.data.success).toEqual(true);
        checkMatch(newTeam, team);
    });

    it("Create a team when already subscribed to the program.", async () => {
        // TODO: We may need to actually make this fail in future since
        // we don't want captains for multiple teams in the same league.
        let newTeam = {
            ...newPerson2,
            team_name: "TEST D FC",
            email: person.email,
            team_capacity: 12,
            subscription: subscription.subscription_id,
            datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
            consent: [],
        };

        let resp1 = await apiPOST(`/team/create`, newTeam);
        let team = resp1.data.data[0];
        expect(resp1.data.success).toEqual(true);
        checkMatch(newTeam, team);
    });

    it("Create a team with a badly formatted new person.", async () => {
        // TODO: We may need to actually make this fail in future since
        // we don't want captains for multiple teams in the same league.
        let newTeam = {
            ...newPerson2,
            phone: 123,
            team_name: "TEST D FC",
            email: person.email,
            team_capacity: 12,
            subscription: subscription.subscription_id,
            datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
            consent: [],
        };

        let resp1 = await apiPOST(`/team/create`, newTeam);
        expect(resp1.data.success).toEqual(false);
        console.log(resp1.data.error);
        expect(resp1.data.error).toEqual("Invalid value set for: phone");
        
    });

    it("Register for a team as a new person.", async () => {
        let newPlayer = {
            first_name: faker.name.findName(),
            last_name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "false",
            birthday: new moment(faker.date.past(100)).format("YYYY-MM-DD"),
            team: "TEST A FC",
            subscription: 2,
            datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
            consent: [],
        };
        const resp1 = await apiPOST(`/team/player`, newPlayer);
        let resp = resp1.data;
        expect(newPlayer.team).toEqual(resp.data[0].team);
    });

    it("Register for a team as an existing person.", async () => {
        let newPlayer = {
            ...person,
            team: "TEST A FC",
            subscription: 2,
            datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
            consent: [],
        };
        const resp1 = await apiPOST(`/team/player`, newPlayer);
        let resp = resp1.data;
        expect(resp.success).toEqual(true);
        expect(newPlayer.team).toEqual(resp.data[0].team);
    });

    it("Register for the same team a second time should fail.", async () => {
        let newPlayer = {
            ...person,
            team: "TEST A FC",
            subscription: 2,
            datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
            consent: [],
        };
        const resp1 = await apiPOST(`/team/player`, newPlayer);
        let resp = resp1.data;
        expect(resp.success).toEqual(false);
    });

    it("Get Teams.", async () => {
        const resp1 = await apiGET(`/${competition.title}/getTeams`);
        let resp = resp1.data;
        expect(resp.success).toEqual(true);
        expect(resp.data.length).toEqual(teams.length + 2) // Because the previous tests should add 2 teams
    });
}

function checkMatch(teamA, teamB) {
    expect(teamA.team_capacity).toEqual(teamB.team_capacity);
    expect(teamA.team_name).toEqual(teamB.team_name);
}

module.exports = {
    teamTests: teamTests,
};
