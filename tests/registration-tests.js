const faker = require("faker");
const utils = require("./utils");
const apiGET = utils.apiGET;
const apiPOST = utils.apiPOST;
const setup = require("./setup");
const moment = require("moment");
const seedData = setup.seedData;

function registrationTests() {
    let person;
    let subscription;
    let registrations;

    beforeAll(async () => {
        let newPerson = {
            first_name: faker.name.findName(),
            last_name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "false",
            birthday: new moment(faker.date.past(100)).format("YYYY-MM-DD"),
        };

        let resp1 = await apiPOST(`/addPerson`, newPerson);
        person = resp1.data.data[0];
        subscription = seedData.subscription[0];
        person2 = seedData.person[0];
        registrations = seedData.registration;
    }, 30000);

    it("Get the programs a person is registered for.", async () => {
        const resp1 = await apiGET(
            `/registration/getPrograms/${person2.email}`
        );
        let data = resp1.data.data[0];
        expect(data.name).toEqual("yoga");
        const resp2 = await apiGET(
            `/registration/getPrograms/${person.email}`
        );
        data = resp2.data.data;
        expect(data).toEqual();
    });

    it("test succesful registering", async () => {
        let newRegistration = {
            person: person.person_id,
            subscription: subscription.subscription_id, // Do we really need a subscription?
            payment: 50.0, // Does it make sense for a payment to be any arbitrary number? Can we make it so that the payment has to be match the subscription price?
            datetime: new moment(faker.date.past(100)).format("YYYY-MM-DD"),
        };

        let resp1 = await apiPOST(`/registration/subscribe`, newRegistration);
        let registration = resp1.data.data[0];
        checkMatch(newRegistration, registration);
    });
}

function checkMatch(registrationA, registrationB) {
    expect(registrationA.person).toEqual(registrationB.person);
    expect(registrationA.subscription).toEqual(registrationB.subscription);
    expect(parseInt(registrationA.payment)).toEqual(
        parseInt(registrationB.payment)
    );
    expect(
        new moment(registrationA.datetime).format("YYYY-MM-DD HH:MM:SS")
    ).toEqual(new moment(registrationB.datetime).format("YYYY-MM-DD HH:MM:SS"));
}

module.exports = {
    registrationTests: registrationTests,
};
