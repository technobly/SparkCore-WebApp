//-----------------------------------------------------------------------------------------------------
//  .d8888b.                            888             d8888 8888888b. 8888888 
// d88P  Y88b                           888            d88888 888   Y88b  888   
// Y88b.                                888           d88P888 888    888  888   
//  "Y888b.   88888b.   8888b.  888d888 888  888     d88P 888 888   d88P  888   
//     "Y88b. 888 "88b     "88b 888P"   888 .88P    d88P  888 8888888P"   888   
//       "888 888  888 .d888888 888     888888K    d88P   888 888         888   
// Y88b  d88P 888 d88P 888  888 888     888 "88b  d8888888888 888         888   
//  "Y8888P"  88888P"  "Y888888 888     888  888 d88P     888 888       8888888 
//            888                                                               
//            888                                                               
//            888                                                                                                                                         
// SparkAPI
//
// The MIT License (MIT)
// 
// Copyright (c) 2013 B^Dub - dubbytt@gmail.com - Last update 7/1/2013
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// This software is best viewed with Sublime Text 2 http://www.sublimetext.com
//-----------------------------------------------------------------------------------------------------

// Importing https library for API calls
var https = require('https');

// Your device name
var MY_DEVICE_NAME = 'elroy'; //'elroy', 'george' or 'astro' for demo API

// Log, Error and Debug Messages
var MESSAGES = {
  'LOG': true,
  'DEBUG': true,
  'ERR': true
};

exports.Log = function(msg) {
  if (MESSAGES.LOG === true) console.log(msg);
};

function Err(msg) {
  if (MESSAGES.ERR === true) console.log(msg);
}

function Debug(msg) {
  if (MESSAGES.DEBUG === true) console.log(msg);
}

// Pin and Level definitions
var D0 = 'D0',
    D1 = 'D1',
    D2 = 'D2',
    D3 = 'D3',
    D4 = 'D4',
    D5 = 'D5',
    D6 = 'D6',
    D7 = 'D7',
    A0 = 'A0',
    A1 = 'A1',
    A2 = 'A2',
    A3 = 'A3',
    A4 = 'A4',
    A5 = 'A5',
    A6 = 'A6',
    A7 = 'A7',
    HIGH = 'HIGH',
    LOW = 'LOW';

// SPARK API "Setting Pins High/Low"
function digitalWrite(pin, level, callback) {

  // Error and Bounds Check the pin and level input
  var USAGE = " [ USAGE: digitalWrite(D7,HIGH); ]";
  if (typeof pin !== "undefined") {
    if (isNaN(pin) && pin.match(/^(D[0-7]|A[0-7])$/))
      var pin_num = pin;
    else throw new Error("Invalid Pin Number: " + pin + USAGE);
  } else throw new Error("Undefined Pin Number" + USAGE);
  if (typeof level !== "undefined") {
    if (isNaN(level) && level.match(/HIGH|LOW/i))
      var level_val = level.toUpperCase();
    else if (level === 0)
      var level_val = 'LOW';
    else if (level === 1)
      var level_val = 'HIGH';
    else throw new Error("Invalid Pin Level: " + level + USAGE);
  } else throw new Error("Undefined Pin Level: " + level + USAGE);

  // Build the post string from an object
  var post_data = JSON.stringify({
    'pin': pin_num,
    'level': level_val
  });

  // Call the API
  sparkPOST(post_data, callback);
}

// SPARK API "Sending a Custom Message"
function sendMessage(msg, callback) {

  // Error and Bounds Check the pin and level input
  var USAGE = " [ USAGE: sendMessage('color #ffffff'); ]";
  if (typeof msg !== "undefined") {
    if (typeof msg === "string")
    // Build the post string from an object
      var post_data = JSON.stringify({
        'message': msg
      });
    else throw new Error("Invalid Message Type: " + typeof msg + USAGE);
  } else throw new Error("Undefined Message" + USAGE);

  // Call the API
  sparkPOST(post_data, callback);
}

function sparkPOST(msg, callback) {
  if (typeof msg !== "undefined") var post_data = msg;
  else throw new Error("[ Undefined sparkPOST() Message ]");
  Debug('SENT TO SPARK API: ' + post_data);

  // An object of options to indicate where to post to
  var post_options = {
    host: 'api.sprk.io',
    port: '443',
    path: '/v1/devices/' + MY_DEVICE_NAME,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': post_data.length
    }
  };

  // Set up the request
  var post_req = https.request(post_options, function (res) {
    var response = [];
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      try {
        response += chunk;
        response = JSON.parse(response);
        Debug('[ SPARK API RESPONSE ]: ' + JSON.stringify(response));
        if (typeof callback === "function") callback(response);
      } catch (e) {
        Err('[ SPARK API ERROR ]: ' + e.message);
      }
    });
  }).on('error', function (e) {
    Err("[ SPARK API ERROR ]: " + e.message);
  });

  // Post the data
  post_req.write(post_data);
  post_req.end();
}

//==================================================================
// Spark API Examples for writing to a pin
//==================================================================
//
// Using strings
////digitalWrite('D0', 'HIGH');
////digitalWrite('D1', 'LOW');
//
// Using numbers for levels (1=HIGH, 0=LOW)
////digitalWrite('D2', 1);
////digitalWrite('D3', 0);
//
// Using predefined global constants
////digitalWrite(D4, HIGH);
////digitalWrite(D5, LOW);
//
// Example with callback (validating the response from the server)
////digitalWrite('D6', HIGH, function (data) {
////  if (data.ok) Log('[ D6 was set HIGH ]');
////  else Log('[ ERROR: D6 was not set HIGH ]');
////});
//
// Try uncommenting one of these errors at a time
//digitalWrite(0);
//digitalWrite(D13, 0);
//digitalWrite(D7);
//digitalWrite('D14', 0);
//digitalWrite('D7', 4);
//==================================================================

//==================================================================
// Spark API Examples for writing a custom message
//==================================================================
//
// Sending a custom message
////sendMessage('winning');
//
// Example with callback (validating the response from the server)
////sendMessage('checking my callback', function (data) {
////  if (data.ok) Log('[ callback worked great! ]');
////  else Log('[ ERROR: callback puked :( ]');
////});
//
// Try uncommenting one of these errors at a time
//sendMessage(7);
//sendMessage(function(){});
//sendMessage('one','two','three'); // only first message is sent
//==================================================================

function sparkGET(data) {
    var options = {
        host: 'api.sprk.io',
        port: 80,
        path: '/v1/devices/elroy -d ' + data + ' -H Content-Type: application/json'
    };
    var data;
    // Make the API call and parse the JSON result
    http.get(options, function(res) {
        res.on('data', function(chunk) {
            Log("Data received: " + chunk);
            data += chunk;
        });
        res.on('end', function(stuff) {
            return data;
        });
    }).on('error', function(e) {
        Log("Got error: " + e.message);
    });
}