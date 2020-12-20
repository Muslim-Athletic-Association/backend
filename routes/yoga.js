// This file contains all of the routes that handle all member related api requests etc.

const router = require('express').Router();
const yoga = require('../model/yoga');
const member = require('../model/member');

INTERNALERROR = { error: "Server Could not process the request" }
DUPLICATE = { error: "Duplicate" }

const errorEnum = {
    NONE: 0,
    UNIQUE: 1,
    UNKNOWN: 2,
    DNE: 3
}

EMPTY = {};

function setResult(d, pass, msg, code) {
    return { data: d, error: msg, success: pass, ecode: code };
}

router.post('/api/yoga/joinClass', async function consent(req, res) {
    // returns memberClass if successful
    res.header('Access-Control-Allow-Origin', '*');
    console.log("consent URI request: ", req.body)

    member.register(req.body).then(async function ryCallback(result) {
        if (result.ecode != errorEnum.NONE && result.ecode != errorEnum.UNIQUE) {
            console.log("Error While creating memeber for yoga")
            console.log(result.data)
            return result;
        }
        return await member.getMember(req.body).then(async function gmjcCallback(result) {
            console.log("Falafel")
            return await yoga.joinClass({...req.body, member: result.data.id}).then((response) => { return response });
        })
    }).then(async function joinClassResponse(response) {
        console.log(response)
        if (response.success) {
            console.log("Success!")
            res.status(200);
        } else if (response.ecode == errorEnum.UNIQUE) {
            console.log("Failure");
            res.status(403);
        } else {
            console.log("Server error!")
            res.status(500)
        }
        res.json(response);
    }).catch((e) => {
        console.log("Server error!")
        console.log(e)
        res.status(500)
    })
});

router.get('/api/yoga/getClasses', async function (req, res) {
    //Return all teams information.
    res.header('Access-Control-Allow-Origin', '*');
    var gtnRes = await yoga.getClasses().then((response) => {
        console.log("Team Names: ", response)
        return response;
    });
    // console.log(gtnRes)
    if (gtnRes.success) {
        console.log("Success!")
        res.status(200);
    } else if (gtnRes.ecode == errorEnum.UNIQUE) {
        console.log("Failure!");
        res.status(403);
    } else {
        console.log("Server error!")
        res.status(500)
    }
    res.json(gtnRes);
})

module.exports = router;
