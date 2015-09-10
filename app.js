var mosca = require('mosca');
var http = require('http');
var mqtt = require('mqtt');

var settings = {
    port: 1883
};

var credentials = {
    'playground': {password: "edge", channels: ["netlight"]}
};


//here we start mosca
console.log('Starting mosca');

var server = new mosca.Server(settings);
server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
    console.log('Mosca server is up and running');
}

// fired whena  client is connected
server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published : ', packet.payload);
});

// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
    console.log('subscribed : ', topic);
});

// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
    console.log('unsubscribed : ', topic);
});

// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
    console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
    console.log('clientDisconnected : ', client.id);
});

var authenticate = function(client, username, password, callback) {
    var authorized = credentials[username] != undefined && credentials[username].password == password.toString();
    if (authorized) {
        client.user = username;
        console.log("Publisher: " + username + " authorized");
        callback(null, true);
        return;
    }
    var authorized = credentials[username] != undefined && credentials[username].password == password.toString();
    if (authorized) {
        client.user = username;
        console.log("Subscriber: " + username + " authorized");
        callback(null, true);
        return;
    }
    console.log(username + " declined");
    callback(null, false);
}

var authorizePublish = function(client, topic, payload, callback) {
    var authorized = publisher[client.user].channels.indexOf(topic) > -1
    console.log(client.user + " authorized publishing to channel " + topic + " - " + authorized);
    callback(null, authorized);
}

var authorizeSubscribe = function(client, topic, callback) {
    var authorized = subscribers[client.user].channels.indexOf(topic) > -1
    console.log(client.user + " authorized subscribed to channel " + topic + " - " + authorized);
    callback(null, authorized);
}
