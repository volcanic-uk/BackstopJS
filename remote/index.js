/* eslint no-console: off */
'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var backstop = require('../core/runner');
var PATH_TO_CONFIG = path.resolve(process.cwd(), 'backstop');


module.exports = function (app) {


    app._backstop = app._backstop || {};
    app._backstop.testCtr = 0;
    app._backstop.viewCtr = 0;
    app._backstop.tests = {};

    app.use(express.json({limit: '2mb'})); // support json encoded bodies
    app.use(express.urlencoded({ extended: true, limit: '2mb' })); // support encoded bodies

    app.post('/dtest/:testId/:scenarioId', (req, res) => {
      app._backstop.testCtr++;

      if (!req.params.testId in app._backstop.tests) {
        app._backstop.tests[req.params.testId] = {};
      }
      app._backstop.tests[req.params.testId] = {[req.params.scenarioId]: req.body};

      console.log('APPENDING TEST. VIEW AT>>> ', `dview/${req.params.testId}/${req.params.scenarioId} `, app._backstop.testCtr);
      console.log('Using config at: ' + PATH_TO_CONFIG);

      var config = require(PATH_TO_CONFIG);
      var s = config.scenarios[0];
      s.label = req.body.name;
      s.url = s.url
        .replace(/<testId>/, req.params.testId)
        .replace(/<scenarioId>/, req.params.scenarioId);
      
      console.log('config', config)
      backstop('test', {config})
      setTimeout(()=>{
        console.log('RESPONSE NOWvvvv')
        res.send('BACKSTOP DYNAMIC TEST>     ' + app._backstop.testCtr)
      }, 5000)

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