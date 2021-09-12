const faker = require("faker");

/**
 * In this seeded database there is:
 * - 3 programs
 * - 4 persons
 *   The first person will test service (subscription) based programs.
 *   The second person will test team based programs as a captain.
 *   The third person will test team based programs as a second captain.
 *   The fourth person will test team based programs as regular player.
 * - 2 teams (to test fixtures),
 * - 1 service (subscription)
 * - 4 registered individuals
 */
const seeded = {
    program: [
        {
            program_id: 1,
            name: "soccer",
        },
        {
            program_id: 2,
            name: "yoga",
        },
    ],
    person: [
        {
            person_id: 1,
            first_name: faker.name.find_name(),
            last_name: faker.name.find_name(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "female",
            birthday: faker.date.past(100),
        },
        {
            person_id: 2,
            first_name: faker.name.find_name(),
            last_name: faker.name.find_name(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "male",
            birthday: faker.date.past(100),
        },
        {
            person_id: 3,
            first_name: faker.name.find_name(),
            last_name: faker.name.find_name(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "male",
            birthday: faker.date.past(100),
        },
        {
            person_id: 4,
            first_name: faker.name.find_name(),
            last_name: faker.name.find_name(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            gender: "male",
            birthday: faker.date.past(100),
        },
    ],
    suscription: [
        {
            subscription_id: 1,
            program: 2,
            name: "monthly yoga class",
            start_date: "2020-1-20",
            end_date: "2020-2-20",
            price: 30.0,
        },
        {
            subscription_id: 2,
            program: 1,
            name: "Men's League Summer 2021",
            start_date: "2020-1-20",
            end_date: "2020-2-20",
            price: 1200.0,
        },
    ],
    registration: [
        {
            registration_id: 1,
            person: 1,
            subscription: 1,
            datetime: "2020-1-10",
            payment: 30.0,
        },
        {
            registration_id: 2,
            person: 2,
            subscription: 2,
            datetime: "2020-1-10",
            payment: 1200.0,
        },
        {
            registration_id: 3,
            person: 3,
            subscription: 2,
            datetime: "2020-1-10",
            payment: 1200.0,
        },
        {
            registration_id: 4,
            person: 4,
            subscription: 2,
            datetime: "2020-1-10",
            payment: 0.0,
        },
    ],
    consent: [
        {
            consent_id: 1,
            person: 1,
            purpose: "yoga waiver",
            is_given: true,
            datetime: "2020-1-10 12:12:12",
        },
        {
            consent_id: 1,
            person: 2,
            purpose: "soccer waiver",
            is_given: true,
            datetime: "2020-1-10 12:12:12",
        },
        {
            consent_id: 1,
            person: 3,
            purpose: "soccer waiver",
            is_given: true,
            datetime: "2020-1-10 12:12:12",
        },
        {
            consent_id: 1,
            person: 4,
            purpose: "soccer waiver",
            is_given: true,
            datetime: "2020-1-10 12:12:12",
        },
    ],
    guardian: [
        {
            guardian_id: 1,
            person: 1,
            full_name: faker.name.name(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
        },
    ],
    team: [
        {
            team_id: 1,
            captain: 2,
            team_name: "TEST A FC",
            team_capacity: 12,
        },
        {
            team_id: 1,
            captain: 3,
            team_name: "TEST B FC",
            team_capacity: 12,
        },
    ],
    competition: [
        {
            competition_id: 1,
            program: 1,
            title: "Test League",
        },
    ],
    competitionGroup: [
        {
            cgroup_id: 1,
            competition: 1,
            cg_capacity: 8,
            level: 1,
        },
    ],
    player: [
        {
            player_id: 1,
            team: 1,
            person: 2,
        },
        {
            player_id: 2,
            team: 2,
            person: 3,
        },
        {
            player_id: 2,
            team: 1,
            person: 4,
        },
    ],
    fixture: [
        {
            fixture_id: 1,
            team1: "TEST A FC",
            team2: "TEST B FC",
            cgroup: 1,
            fixture_date: "2020-1-20",
            fixture_time: "12:15:00",
        },
    ],
    session: [
        {
            session_id: 1,
            program: 2,
            title: "TEST SESSION",
            instructor: faker.name.name(),
            session_capactity: 10,
            session_time: "12:12:00",
            session_date: "WEDNESDAY",
            start_date: "2020-1-20",
            count: 4,
            location: "3579 Copernicus Dr.",
        },
    ],
    soccerPlayerFixture: [
        {
            soccer_id: 1,
            player: 1,
            fixture: 1,
        },
        {
            soccer_id: 2,
            player: 2,
            fixture: 1,
        },
        {
            soccer_id: 3,
            player: 3,
            fixture: 1,
        },
    ],
    teamRecord: [
        {
            team_record_id: 1,
            group_id: 1,
            team: 1,
        },
        {
            team_record_id: 2,
            group_id: 1,
            team: 2,
        },
    ],
};

async function seedDatabase() {}

const API_URL = "http://localhost:3001";

async function apiPOST(path: string, body: any = {}) {
    return await fetch(API_URL + path, {
        method: "POST",
        body: JSON.stringify(body),
    });
}
