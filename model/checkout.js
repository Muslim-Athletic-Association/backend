
// Modules
const square = require("square-connect");

// What I got as a response for the token code: sq0cgp-eprp0r6gKDrpKxOJShb0hQ

// Variables
var oauth2 = square.ApiClient.instance.authentications['oauth2'];
oauth2.accessToken = 'sq0cgp-eprp0r6gKDrpKxOJShb0hQ'; //Production accessToken
var customerApi = new square.CustomersApi();
var catalogApi = new square.CatalogApi();
var ordersApi = new square.OrdersApi();
var locationId = "LJQ8ZZ6S858ZH"; //Sandbox location

async function createCustomer(data) {
    var customer = await searchCustomers(data);
    if (customer != null) {
        console.log("Customer with this membership id already exists.")
        return customer;
    }
    customer = {
        given_name: data.fname,
        family_name: data.lname,
        email_address: data.email,
        phone_number: data.phone,
        birthday: data.birthday,
        reference_id: data.member.toString() //The reference id allows us to reference a customer using our own member ids
    }
    return await customerApi.createCustomer(customer).then((data) => {
        // Data should look like: {error: [Error], customer: Customer} 
        console.log('create Customer API called successfully. Returned data: ' + data);
        return data.customer;
    }).catch((e) => {
        console.log("Could not create customer.", e);
        return null;
    });
}

async function searchCustomers(data) {
    var body = {
        query: {
            filter: {
                reference_id: {
                    exact: data.member.toString() //We are filtering the customers by an exact match with the reference id (member id)
                }
            }
        }
    }
    return await customerApi.searchCustomers(body).then(function (data) {
        // Note: We only return the first customer
        if (data.customers.length <= 0) {
            console.log("No customers found to have a membership id of: " + data.member);
            return null;
        }
        console.log('search Customers API called successfully. Returned data: ' + data);
        return data.customers[0]; // This should be a customer object
    }).catch(e => {
        console.log("Could not search customers.", e)
        return null;
    })

}

async function searchForLeague() {
    var body = {
        text_filter: "Men's 18+ Soccer League Team"
    }
    return await catalogApi.searchCatalogItems(body).then(function (data) {
        console.log('search Catalog Items API called successfully. Returned data: ' + data);
        if (data.items.length <= 0) {
            console.log("No items found for " + body.text_filter)
            return null;
        }
        return data.items[0]; //This should be a "Catalog object"
    }).catch(e => {
        console.log("Could not search catalog.", e);
        return null;
    })
}

async function createLeagueOrder(data) {
    var customerId = await searchCustomers(data);
    if (customerId == null) {
        console.log("Order creation cancelled because Customer not found.")
        return null;
    }
    var item = await searchForLeague();
    if (item == null) {
        console.log("Order creation cancelled because item could not be found in catalog.")
        return null;
    }
    var order = {
        location_id: locationId,
        customer_id: customerId.id,
        reference_id: data.teamId.toString(), //We'll keep track of these orders using teamIds
        line_items: [
            { //This object is an order line item
                catalog_object_id: item.id,
                quantity: 1
            }
        ]
    }
    var body = { Order: order }
    return await ordersApi.createOrder(body).then(function (data) {
        console.log('Order API called successfully. Returned data: ' + data);
        return data;
    }).catch(e => {
        console.log("Could not search catalog.", e);
        return null;
    })
}

module.exports = {
    createCustomer: createCustomer,
    createOrder: createLeagueOrder
}