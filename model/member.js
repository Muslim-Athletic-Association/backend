const program = require("../model/program");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const db = require("./db");
// const checkout = require("./checkout");
const isFunction = require("./helper").isFunction;

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

async function register(data) {
  // This function registers a member to a program, if the member does not exist, then we add them to the member table first.
  // If the member does exist, then we continue to register them.
  return await createMember(data).then(async function cmCallback(result)  {
    if (result.success || result.ecode == errorEnum.UNIQUE) {
      return await registerMember(data).then((res) => {
        return res;
      });
    } else {
      return result;
    }
  });
}

async function createMember(data) {
  // This function adds someone who is newly registered to the database.
  var sql = 'INSERT INTO member (fname, lname, phone, email, birthday, gender) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
  return await db.query(sql, [data.fname, data.lname, data.phone, data.email, data.birthday, data.gender]).then(async function (res) {
    // await checkout.createCustomer({...data, member: res.rows[0].id});
    return setResult(res.rows[0], true, "Successfully created a member.", errorEnum.NONE);
  }).catch(e => {
    if (e.code == '23505') {
      return setResult(EMPTY, false, "This individual is already a member", errorEnum.UNIQUE);
    }
    console.log("ERROR", e)
    return setResult(EMPTY, false, "Unknown error in createMemeber", errorEnum.UNKNOWN);
  })
}

async function registerMember(data) {
  // This function inserts a member into the database
  return await getMember(data).then(async function (result) {
    console.log("Member with ID: " + result.data.id + " being registered for " + data.program)
    var sql = 'INSERT INTO programMember (member, program) VALUES ($1, $2) RETURNING member;';
    return await db.query(sql, [result.data.id, data.program]).then(res => {
      // Check if the member was added correctly, then either callBack or return the member.
      return setResult(res.rows[0], true, "Successfully registered a member for a program.", errorEnum.NONE);
    }).catch(e => {
      if (e.code == '23505') {
        console.log("\nWARNING: Individual with name: " + data.fname + " " + data.lname + " and phone #: " + data.phone + " is a duplicate registrant. \n");
        return setResult(EMPTY, false, "Member is already registered for this program.", errorEnum.UNIQUE);
      }
      console.log("\n ERROR! \n Individual with name: " + data.fname + " " + data.lname + " and phone #: " + data.phone + " caused an error in registerMember. \n", e);
      return setResult(EMPTY, false, "Unknown error in registerMember", errorEnum.UNKNOWN);
    })
  });
}

async function addGuardian(data) {
  // This function inserts a member into the database
  var sql = 'INSERT INTO guardian (member, fname, lname, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING member;';
  return await db.query(sql, [data.member, data.fname, data.lname, data.email, data.phone]).then(res => {
    // Check if the member was added correctly, then either callBack or return the member.
    return setResult(res.rows[0], true, "Successfully added a guardian for a member with id " + data.member, errorEnum.NONE);
  }).catch(e => {
    console.log("\n ERROR! \n Guardian with name: " + data.fname + " " + data.lname + " and phone #: " + data.phone + " caused an error in registerMember. \n", e);
    return setResult(EMPTY, false, "Unknown error in addGuardian", errorEnum.UNKNOWN);
  })
}

async function getMember(data) {
  // This function retreives (gets) a member's id from the database.
  var id;
  var sql = 'SELECT * FROM member WHERE fname=$1 and lname=$2 and phone=$3;';
  return await db.query(sql, [data.fname, data.lname, data.phone]).then(res => {
    if (!res.rows[0]) {
      return setResult(EMPTY, false, "Failed to fetch a member.", errorEnum.DNE);
    }
    return setResult(res.rows[0], true, "Successfully fetched a member.", errorEnum.NONE);
  }).catch(e => {
    console.log("\n ERROR! \n Individual with name: " + data.fname + " " + data.lname + " and phone #: " + data.phone + " caused an error in getMember function.\n", e);
    return setResult(res.rows[0], false, "Failed to fetch a member.", errorEnum.UNKNOWN);
  })
}

async function getMembers(data) {
  // This function fetches all of the members from the database.
  var id;
  var sql = 'SELECT * FROM member;';
  return await db.query(sql).then(res => {
    if (!res.rows[0]) {
      return setResult(EMPTY, false, "Failed to fetch any members.", errorEnum.DNE);
    }
    var x = 0;
    var members = {};
    res.rows.forEach(member => {
      x++;
      members[member.id] = member;
    })
    return setResult(members, true, "Successfully fetched " + x + " members.", errorEnum.NONE);
  }).catch(e => {
    console.log("\n ERROR! \n Unable to fetch members. \n", e);
    return setResult(res.rows[0], false, "Failed to fetch members.", errorEnum.UNKNOWN);
  })
}

async function getProgramMembers(data) {
  // This function fetches all of the members from the database.
  var id;
  var sql = 'SELECT * FROM programMember JOIN Member ON programMember.member=Member.id WHERE program=$1;';
  return await db.query(sql, [data.program]).then(res => {
    if (!res.rows[0]) {
      //The member DNE (does not exist)
      return {};
    }
    var x = 0;
    var members = {};
    res.rows.forEach(member => {
      x++;
      members[member.member] = member;
    })
    console.log("We got " + x + " members");
    return members;
  }).catch(e => {
    console.log("\n ERROR! \n Unable to fetch program members. \n", e);
    return false;
  })
}

async function getProgramMember(data) {
  // This function fetches all of the members from the database.
  var id;
  var sql = 'SELECT * FROM programMember JOIN Member ON programMember.member=Member.id WHERE program=$1 AND member=$2;';
  return await db.query(sql, [data.program, data.member]).then(res => {
    if (!res.rows[0]) {
      //The member DNE (does not exist)
      return {};
    }
    var x = 0;
    var members = {};
    res.rows.forEach(member => {
      x++;
      members[member.member] = member;
    })
    console.log("We got " + x + " members")
    return members;
  }).catch(e => {
    console.log("\n ERROR! \n Unable to fetch program members. \n", e);
    return false;
  })
}

async function getMembersCSV(data) {
  // This function fetches all of the members from the database.
  var id;
  var sql = 'SELECT * FROM member;';
  return await db.query(sql).then(async function (res) {
    if (!res.rows[0]) {
      //The member DNE (does not exist)
      return setResult(EMPTY, false, "Members table seems to be empty.", errorEnum.DNE);
    }
    var x = 0;
    var members = [];
    res.rows.forEach(member => {
      x++;
      members.push(member);
    })
    // Convert the list of member objects into a csv file
    const csv = new ObjectsToCsv(members);
    if (!fs.existsSync('./assets/csv')) {
      fs.mkdirSync('./assets/csv');
    }
    await csv.toDisk('./assets/csv/members.csv');
    return setResult(EMPTY, true, "CSV Created.", errorEnum.EMPTY);
  }).catch(e => {
    console.log("\n ERROR! \n Unable to fetch members and convert to CSV. \n", e);
    return setResult(EMPTY, false, "Failed to create CSV for members.", errorEnum.UNKNOWN);
  })
}

// CREATE TABLE consent (
//   member_id INTEGER,
//   program_name VARCHAR(50),
//   prupose VARCHAR(50),
//   consent BOOLEAN,

//   constraint consentPk primary key (member, program),
//   constraint consentMemberFk foreign key (member_id) references member(id) on update cascade on delete cascade,
//   constraint consentProgramFk foreign key (program_name) references program(name) on update cascade on delete cascade
// );

async function insertConsent(data) {
  // This function inserts a member's consent into the database
  var sql = 'INSERT INTO consent (member_id, program_name, purpose, consent) VALUES ($1, $2, $3, $4);';
  return await db.query(sql, [data.member, data.program, data.purpose, data.consent]).then(res => {
    return setResult(res.rows[0], true, "Successfully added a member's consent for " + data.program + " " + data.purpose, errorEnum.NONE);
  }).catch(e => {
    console.log("\n ERROR! \n Consent Failed to be inserted: ", e);
    return setResult(EMPTY, false, "Unknown error in insertConsent", errorEnum.UNKNOWN);
  })
}

module.exports = {
  getMember: getMember,
  getMembers: getMembers,
  getMembersCSV: getMembersCSV,
  getProgramMember: getProgramMember,
  getProgramMembers: getProgramMembers,
  registerMember: registerMember,
  register: register,
  addGuardian: addGuardian,
  insertConsent: insertConsent,
}
