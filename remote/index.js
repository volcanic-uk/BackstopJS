/* eslint no-console: off */
'use strict';

var fs = require('fs');
var express = require('express');

module.exports = function (app) {
    app._backstop = app._backstop || {};
    app._backstop.testCtr = 0;
    app._backstop.viewCtr = 0;
    app._backstop.tests = {};

    app.use(express.json({limit: '2mb'})); // support json encoded bodies
    app.use(express.urlencoded({ extended: true, limit: '2mb' })); // support encoded bodies

    app.post('/dtest/:testId_scenarioId', (req, res) => {
      //JSON.stringify(req.body.content, null, 2)
      debugger;
      app._backstop.testCtr++;

      if (!req.params.testId_scenarioId in app._backstop.tests) {
        app._backstop.tests[req.params.testId_scenarioId] = {};
      }
      app._backstop.tests[req.params.testId_scenarioId] = req.body;

      console.log('BACKSTOP DYNAMIC TEST>>>', app._backstop.testCtr);
      res.send('BACKSTOP DYNAMIC TEST>     ' + app._backstop.testCtr);
    });
    app.get('/dview/:testId_scenarioId', (req, res) => {
      app._backstop.viewCtr++;
      console.log('BACKSTOP DYNAMIC VIEW:' + app._backstop.viewCtr);
      // res.send('BACKSTOP DYNAMIC TEST>     ' + JSON.stringify(req.params, null, 2) + JSON.stringify(app._backstop, null, 2));
      res.send(app._backstop.tests[req.params.testId_scenarioId].content);
    });
};