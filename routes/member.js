// This file contains all of the routes that handle all member related api requests etc.

const router = require('express').Router();
const m = require('../model/member');

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


router.post('/api/addMember', (req, res) => {
  // returns member information in json format if successful
  res.header('Access-Control-Allow-Origin', '*');
  m.createMember(req.body, member => {
    if (member == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    if (member == "Duplicate") {
      res.status(500);
      res.json(DUPLICATE);
      return;
    }
    res.status(200);
    res.json(member);
  });
})

router.post('/api/addGuardian', async function registerPlayerCallBack(req, res) {
  // returns member information in json format if successful
  res.header('Access-Control-Allow-Origin', '*');
  console.log("addGuardian URI request: ", req.body)
  await m.addGuardian(req.body).then(async function registerResponse(response) {
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
  })
});

router.get('/api/getMember', (req, res) => {
  // Returns id of a Member in json format
  res.header('Access-Control-Allow-Origin', '*');
  m.getMember(req.body, member_id => {
    if (member_id == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200); //This needs a check
    res.json({ id: member_id });
  });
})

router.post('/api/register', (req, res) => {
  // Register for a program, and store the information in the database.
  res.header('Access-Control-Allow-Origin', '*');
  m.register(req.body, status => {
    if (status == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    if (status == "Duplicate") {
      res.status(409);
      res.json(DUPLICATE);
      return;
    }
    res.status(200); //This needs a check i.e. if status.registered = true
    res.json(status);
    return;
  });
})


router.get('/api/getMembers', (req, res) => {
  // Return all of the members in the database.
  res.header('Access-Control-Allow-Origin', '*');
  m.getMembers(req.body).then(members => {
    if (members == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200);
    res.json(members);
  });
})

router.get('/api/programMembers/:program', (req, res) => {
  // Return all of the members in the database.
  res.header('Access-Control-Allow-Origin', '*');
  m.getProgramMembers(req.params, members => {
    if (members == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200);
    res.json(members);
  });
})

router.get('/api/programMembers/:program/:member', (req, res) => {
  // Return all of the members in the database.
  res.header('Access-Control-Allow-Origin', '*');
  m.getProgramMember(req.params, members => {
    if (members == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200);
    res.json(members);
  });
})

router.get('/api/getMembersCSV', (req, res) => {
  // Generate a CSV file that contains all members and store it in the assets/csv file.
  res.header('Access-Control-Allow-Origin', '*');
  m.getMembersCSV(req.body, success => {
    if (success == false) {
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200);
    res.download('./assets/csv/members.csv');
  });
})

router.post('/api/consent', async function consent(req, res) {
  // returns member information in json format if successful
  res.header('Access-Control-Allow-Origin', '*');
  console.log("consent URI request: ", req.body)
  await m.insertConsent(req.body).then(async function registerResponse(response) {
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
  })
});

module.exports = router;
