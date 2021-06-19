const router = require("express").Router();
const p = require("../model/person");
const h = require("../model/constants");
const c = require("./routingConstants");
const admin = require("firebase-admin");

const serviceAccount = require("../secretKey.json");

const fbAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

/**
 * Add a person POST request handling.
 */
router.post(
    "/api/login",
    async function loginResponse(request, response) {
        response.header("Access-Control-Allow-Origin", "*");
        const idToken = request.body.idToken.toString();

        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        admin
            .auth()
            .createSessionCookie(idToken, { expiresIn })
            .then(
                async (sessionCookie) => {
                    const options = { maxAge: expiresIn, httpOnly: true };
                    response.cookie("session", sessionCookie, options);
                    await p
                        .createPerson(request.body)
                        .then(async function (result) {
                            return await c.simpleResponse(result, response);
                        });
                },
                (error) => {
                    console.log(error.code, request.data)
                    error.code == "auth/invalid-id-token"
                        ? response
                              .status(401)
                              .send({ msg: "UNAUTHORIZED REQUEST!" })
                        : console.log(error);
                }
            );
    }
);

module.exports = router;
