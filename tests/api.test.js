const setup = require("./setup.js");
// const registrationTests = require("./registration-tests.js");

describe("Test APIs", () => {
    test("setup database", async () => {
        await setup.seedDatabase();
    });
});
