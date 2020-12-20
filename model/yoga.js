const isFunction = require("./helper").isFunction;
const db = require("./db.js");

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



// CREATE TABLE class(
//     -- Each program can have sub-divisions 
//     class_id Serial primary key,
//     name VARCHAR(50),
//     instructor VARCHAR(50),
//     program VARCHAR(50) NOT NULL,
//     capacity INTEGER DEFAULT 0,


//     constraint programDivFk foreign key (program) references program(name) on update cascade on delete cascade 
//   );

//   CREATE TABLE MemberClass (
//     -- Each member can be registered for a program.

//     member INTEGER,
//     class INTEGER,

//     constraint mcPk primary key (member, class),
//     constraint memberFk foreign key (member) references member(id) on update cascade on delete cascade,
//     constraint classFk foreign key (class) references class(class_id) on update cascade on delete cascade
//   );

async function countClassParticipants() {
  sql = 'select class as class_id, count(class) as participants from memberclass group by class;';
  return await db.query(sql).then(result => {
    data = {}
    for (var cp = 0; cp < result.rows.length; cp++) {
      data[result.rows[cp].class_id] = result.rows[cp].participants
    }
    return setResult(data, true, "Number of participants in each class fetched.", errorEnum.NONE);
  }).catch(e => {
    console.log("\nERROR! in countClassParticipants\n", e);
    return setResult({}, false, "Failed to fetch number of participants in each class.", errorEnum.UNKNOWN);

  })
}

async function joinClass(data) {
  // This function inserts a member's consent into the database
  console.log("join class: ")
  console.log(data)
  return await checkMemberClass(data).then(async function checkMCCallback(result) {
    if (result) {
      var sql = 'INSERT INTO memberClass (member, class) VALUES ($1, $2) returning *;';
      return await db.query(sql, [data.member, data.class]).then(res => {
        return setResult(res.rows[0], true, "Successfully added a member to class with id " + data.class, errorEnum.NONE);
      }).catch(e => {
        if (e.code == '23505') {
          return setResult(EMPTY, false, "This individual is already registered for the class", errorEnum.UNIQUE);
        }
        console.log("\n ERROR! \n Failed to be join class: ", e);
        return setResult(EMPTY, false, "Unknown error in join class", errorEnum.UNKNOWN);
      })
    }
    else {
      return setResult(EMPTY, false, "This individual is already registered for a class.", errorEnum.UNIQUE);
    }
  })

}

async function checkMemberClass(data) {
  // Returns true if member is not registered for a class in the program and false if they are.
  sql = 'SELECT * FROM memberClass where member=$1;';
  return await db.query(sql, [data.member]).then(result => {
    if (result.rows[0] == null) {
      console.log("checkMemberClassDuplicate: This member is not yet registered for a class in this program.");
      return true;
    }
    console.log("Seems like they are already registered for a class")
    return false;
  }).catch(e => {
    console.log("\nERROR! in checkMemberClass\n", e);
    return false;
  })
}

async function getClasses() {
  sql = 'SELECT * FROM class;';
  return await db.query(sql).then(async function (result) {
    if (result.rows[0] == null) {
      console.log("No classes have been fetched from the database.");
      return setResult(EMPTY, false, "No classes could be fetched from the database.", errorEnum.DNE);
    }
    return await countClassParticipants().then(ccpres => {
      if (ccpres.success) {
        console.log("YAY");
        console.log(result.rows)
        for (var cls = 0; cls < result.rows.length; cls++) {
          console.log(result.rows[cls].class_id);
          result.rows[cls].participants = ccpres.data[result.rows[cls].class_id]
        }
        return setResult(result.rows, true, "Classes fetched.", errorEnum.NONE);
      } else {
        return ccpres;
      }
    })
  }).catch(e => {
    console.log("\nERROR! in Classes\n", e);
    return setResult(EMPTY, false, "Failed to fetch classes.", errorEnum.UNKNOWN);
  })
}

module.exports = {
  joinClass: joinClass,
  getClasses: getClasses,
  countClassParticipants: countClassParticipants
}
