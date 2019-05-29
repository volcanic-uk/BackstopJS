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

      let config = require(PATH_TO_CONFIG);
      config.dynamicTestId = req.params.testId;
      
      let s = config.scenarios[0];
      s.label = req.body.name;
      s.url = s.url
        .replace(/{testId}/, req.params.testId)
        .replace(/{scenarioId}/, req.params.scenarioId);
      
      let result = {
        label: s.label,
        surl: s.url,
        testId: req.params.testId, 
        scenarioId: req.params.scenarioId, 
        vid: app._backstop.testCtr
      };

      backstop('test', {config}).then(
        () => {
          result.ok = true;
          res.send(JSON.stringify(result))
        },
        () => {
          result.ok = false;
          res.send(JSON.stringify(result))
        }
      )
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