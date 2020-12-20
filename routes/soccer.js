const router = require('express').Router();
const soccer = require("../model/soccer");
const member = require("../model/member");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const db = require("../model/db.js");
const isFunction = require("../model/helper").isFunction;

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

var divisions;
soccer.getDivisions().then(divs => {
	divisions = divs;
	return;
})
console.log(divisions)

function setResponse(response, res) {
    console.log(response)
    if (response.success) {
        console.log("Success!")
        res.status(200);
    } else if (response.ecode == errorEnum.UNIQUE) {
        console.log("Failure!");
        res.status(403);
    } else {
        console.log("Server error!")
        res.status(500)
    }
    res.json(response);
}

var divisions;
soccer.getDivisions().then(res => {
    for (var i = 0; i<res.data.length; i++){
        divisions[res.data[i].division] = res.data[i]
    }
});

router.get('/api/soccer/getDivisions', (req, res) => {
    //Return division information.
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200);
    console.log("Fetching divisions.")
    res.json(divisions);
})

router.get('/api/soccer/getPlayers', (req, res) => {
    //Return all players information.
    res.header('Access-Control-Allow-Origin', '*');
    callBack = (players) => {
        if (member == false) {
            res.status(500);
            res.json(INTERNALERROR);
            return;
        }
        res.status(200);
        res.json(players);
    }
    soccer.getPlayers(callBack);
})

router.get('/api/soccer/getTeamNames', async function (req, res) {
    //Return all teams information.
    res.header('Access-Control-Allow-Origin', '*');
    var gtnRes = await soccer.getTeamNames().then((response) => {
        console.log("Team Names: ", response)
        return response;
    });
    console.log(gtnRes)
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

router.post('/api/soccer/createTeam', async function createTeamCallback(req, res) {
    // returns member information in json format if successful
    res.header('Access-Control-Allow-Origin', '*');
    var team = await member.register(req.body).then(async function createTeamResponse(result) {
        return await divisions.data["1"].addTeam(req.body).then((response) => {
            return response;
        });
    }).then((response) => {
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

    });
}
);

router.post('/api/soccer/registerPlayer', async function registerPlayerCallBack(req, res) {
    // returns member information in json format if successful
    res.header('Access-Control-Allow-Origin', '*');
    var team = await member.register(req.body).then(async function registerResponse(result) {
        if (result.success == false) {
            return result;
        }
        var data = { ...req.body, member: result.data.member }
        console.log(data)
        return await soccer.addPlayer(data).then((response) => {
            return response;
        });
    }).then((response) => {
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
        console.log(response)
        res.json(response);

    });
}
);

router.post('/api/soccer/setPaid', async function (req, res) {
    //Return all teams information.
    res.header('Access-Control-Allow-Origin', '*');
    var response = await soccer.setPaid(req.body).then((result) => {
        return result;
    });
    if (response.success) { res.status(200) }
    else if (response.ecode == errorEnum.DNE) { res.status(404) }
    else { res.status(500) }
    res.json(response);
})

module.exports = router;
