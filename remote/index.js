/* eslint no-console: off */
'use strict';

var fs = require('fs');
var express = require('express');
var backstop = require('../core/runner');

console.log()
module.exports = function (app) {
    backstop('version', {});

    app._backstop = app._backstop || {};
    app._backstop.testCtr = 0;
    app._backstop.viewCtr = 0;
    app._backstop.tests = {};

    app.use(express.json({limit: '2mb'})); // support json encoded bodies
    app.use(express.urlencoded({ extended: true, limit: '2mb' })); // support encoded bodies

    app.post('/dtest/:testId/:scenarioId', (req, res) => {
      //JSON.stringify(req.body.content, null, 2)
      debugger;
      app._backstop.testCtr++;

      if (!req.params.testId in app._backstop.tests) {
        app._backstop.tests[req.params.testId] = {};
      }
      app._backstop.tests[req.params.testId] = {[req.params.scenarioId]: req.body};

      console.log('BACKSTOP DYNAMIC TEST>>>', app._backstop.testCtr, req.params.testId, req.params.scenarioId);
      res.send('BACKSTOP DYNAMIC TEST>     ' + app._backstop.testCtr);
    });
    
    app.get('/dview/:testId/:scenarioId', (req, res) => {
      app._backstop.viewCtr++;
      console.log('BACKSTOP DYNAMIC VIEW:' + app._backstop.viewCtr, req.params.testId, req.params.scenarioId);
      try {
        res.send(app._backstop.tests[req.params.testId][req.params.scenarioId].content);
      } catch (err) {
        console.log(err);
        res.send(`${req.params.testId} ${req.params.scenarioId}` + err);
      }
    });
};