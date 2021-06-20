const router = require("express").Router();
const p = require("../model/person");
const h = require("../model/constants");
const c = require("./routingConstants");
const admin = require("firebase-admin");

const serviceAccount = require("../secretKey.json");
const { setResult } = require("../model/constants");

const fbAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

/**
 * Add a person POST request handling.
 */
router.post(
    "/api/register",
    async function registerResponse(request, response) {
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
                    console.log(error.code, request.data);
                    error.code == "auth/invalid-id-token"
                        ? response
                              .status(401)
                              .send({ msg: "UNAUTHORIZED REQUEST!" })
                        : console.log(error);
                }
            );
    }
);

router.post("/api/login", async function loginResponse(request, response) {
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
                console.log(sessionCookie);
                result = h.setResult(
                    { idToken },
                    true,
                    "login cookie set",
                    h.errorEnum.NONE
                );
                return await c.simpleResponse(result, response);
            },
            (error) => {
                console.log(error.code, request.data);
                error.code == "auth/invalid-id-token"
                    ? response
                          .status(401)
                          .send({ msg: "UNAUTHORIZED REQUEST!" })
                    : console.log(error);
            }
        );
});

/**
 * This function will be used to verify a user is logged in.
 */
async function fbAuthorization(req, res, next) {
    const sessionCookie = req.cookies.session || "";
    let authorized = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((claims) => {
            console.log(claims);
            return true;
            // return setResult(claims, true, "claims fetched", h.errorEnum.NONE);
        })
        .catch((error) => {
            // Session cookie is unavailable or invalid. Force user to login.
            console.log(error);
        });
    if (authorized) {
        next();
        return;
    } else {
        result = setResult(
            {},
            false,
            "Session cookie could not be verified",
            h.errorEnum.INVALID
        );
        res.send(result);
        return;
    }
}

router.get(
    "/api/auth",
    fbAuthorization,
    async function authTest(request, response) {
        response.header("Access-Control-Allow-Origin", "*");
        res.send("Falafel");
    }
);

module.exports = { router, fbAuthorization: fbAuthorization };
