# node-checklist-ninja

> A Node.js module for interacting with the https://checklist.ninja API

A word of caution: This library is being actively developed. It was originally made to facilitate testing and collaboration, but this library's interfaces as well as the Checklist Ninja API may change.

## Install

    $ npm install checklist-ninja

## Usage

```javascript
var ninja = require('checklist-ninja');

ninja.config({
  secret: <my secret API key>,
  pubkey: <my public API key>
});

ninja.createChecklist("My new list", function(err, checklist) {
  console.log("My new list: ", checklist)
});

```
