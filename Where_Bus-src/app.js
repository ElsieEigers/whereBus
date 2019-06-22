"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const https = require("https");

var useEmulator = true;
var routeNumber = "";
var northOrWest = "";
var yearsCoding = "";
var selectedLanguage = "";

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [

    function (session) {
        builder.Prompts.number(session, "Hello, and welcome to Where's my bus! What bus are you looking for?");
    },

    function (session, results) {
        routeNumber = results.response;
        console.log(routeNumber);
        builder.Prompts.text(session, "What stop on the " + routeNumber + " are you at?");
    },

    function (session, results) {
        var yourName = 123;
        var stopName = results.response;
        console.log(stopName);
        builder.Prompts.text(session, "What direction are you heading?");
        console.log(routeNumber);
        https.get('https://api-v3.mbta.com/stops?filter[route]='+ routeNumber, (resp) => {
            var data = "";
           // builder.Prompts.text(session, "super");
            resp.on('data', (chunk) => {
                console.log("on data ")
                data += chunk;
            });
            resp.on('end', () => {
                console.log("on end  ")
                var parsedData = JSON.parse(data);
                console.log(parsedData.data)
                //builder.Prompts.text(session, JSON.parse(data).explanation);
                console.log("jaja")
            });
        });


            // builder.Prompts.number(session, "Hi " + userName + ", how many years have you been writing code?");
            // https.get('https://api-v3.mbta.com/schedules?filter[route]='+ routeNumber +'&filter[stop]=74614' 'https://api-v3.mbta.com/vehicles?filter=[' + routeNumber + ']', (resp) => {
            //     var data = ""; 
            //      builder.Prompts.text(session, "super");
            //     resp.on('data', (chunk) => {

            //         console.log("on data ")
            //         data += chunk;
            //     });

            // The whole response has been received. Print out the result.
            //     resp.on('end', () => {

            //         console.log("on end  ")
            //         var parsedData = JSON.parse(data);
            //         console.log(parsedData.data)
            //         //builder.Prompts.text(session, JSON.parse(data).explanation);
            //         console.log("jaja")
            //     });
            // });
        },

        function (session, results) {
            northOrWest = results.response;
            builder.Prompts.text(session, "The schedule says the Bus is 5 minutes away, can you do me a favor and tell me if it comes?");
        },

            function (session, results) {
                yearsCoding = results.response;
                builder.Prompts.choice(session, "Did the bus come?", ["Yes, I'm on it", "Yes, it's down the street", "No, it did not", "I don't know, I left the bus stop"]);
            },

            function (session, results) {
                selectedLanguage = results.response.entity;
                if (selectedLanguage == "Yes, I'm on it" || "Yes, it's down the street"){
                    session.send("Great to hear it! Let me know if you need more directions.");
                }
                else if (selectedLanguage == "I don't know I left the bus stop"){
                    session.send("Oh that's fine! Hope you get where you want to go")
                }
                else {
                    session.send("Sorry to hear that! Let me know if the situation changes.");
                }
                
            }]);

var restify = require('restify');
var server = restify.createServer();

server.listen(3978, function () {
    console.log('test bot endpoint at http://localhost:3978/api/messages');
});

server.post('/api/messages', connector.listen());
