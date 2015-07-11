'use strict';

var Yar = require('yar');

var init = function (server) {


    var options = {
        cookieOptions: {
            password: 'password',   // Required
            isSecure: false // Required if using http
        }
    };


    server.register({
        register: Yar,
        options: options
    }, function (err) {
        if (err) {
            console.log(err);
        }
    });

}

module.exports = {
    init: init
};