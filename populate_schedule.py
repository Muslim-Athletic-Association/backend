import requests


def read_fixtures():
    """
    Read the file that contains the scheduled fixtures.
    """
    # x = argv[1] # Name of the file
    f = open("schedule.csv", "r+")
    lines = f.readlines()
    count = 0
    # format = lines[0] # Do we need to dynamically name the attributes of the json object?
    for line in lines[1:]:
        fixture = parse_fixture(line)
        resp, r = add_fixture(fixture)
        if not resp['success']:
            print("Failed to add fixture with info:", fixture, r)
            return
        else:
            count+=1
    print("successfully added %s fixture(s)" % count)


def parse_fixture(line):
    """
    Prepare data for post request by parsing the csv line into a json object
    """
    x = line.split(',')
    game = {b"cgroup": 1,
            b"team1": x[0],
            b"team2": x[3],
            b"date": x[4],
            b"time": x[5]}
    return game


def add_fixture(fixture):
    """
    Make a post request to the server
    """
    r = requests.post('http://localhost:3001/api/upload/fixture', fixture)
    try:
        response = r.json()
    except :
        return {"success": False}, r
    return response, r


if __name__ == "__main__":
    print("Converting CSV to JSON")
    read_fixtures()
