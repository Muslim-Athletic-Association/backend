const utils = require("./utils");
const apiGET = utils.apiGET;
const apiPOST = utils.apiPOST;
const dbConfig = utils.dbConfig;
const Client = require("pg").Client;
const setup = require("./setup");
const seedDatabase = setup.seedDatabase;
const seedData = setup.seedData;

function registration_tests() {
    let people;
    let registrations;
    let db;

    beforeAll(async () => {
        let db = new Client(dbConfig);
        await db.connect();
        await seedDatabase();
        people = seedData.person;
        registrations = seedData.registration;
    }, 30000);

    afterAll(() => {
        db.end();
    });

    it("test getting a person's registration", async () => {
        let person = people[0];
        let person_id = person.person_id;
        let resp1 = await apiPOST(`/registration/${person_id}`);

        expect(resp1).toHaveStatus("success");
    });

    it("test new person's registration", async () => {
        const resp1 = await apiPOST(`/registration/subscribe`);

        expect(resp1).toHaveStatus("success");
    });
}

module.exports = { registration_tests: registration_tests };
