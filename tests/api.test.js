const personTests = require("./person-tests.js").personTests;
// const registration_tests =
//     require("./registration-tests.js").registration_tests;
const setup = require("./setup.js");

describe("Set up", () => {
    test("setup database", async () => {
        await setup.seedDatabase();
    });
});

describe("Test Person", () => {
    personTests();
});
