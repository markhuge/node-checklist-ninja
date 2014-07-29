# Hi there. Don't use this yet

The checklist.ninja API is still in a bit of flux. I'm publishing this early to facilitate some testing and collaboration. 


node-checklist-ninja
====================

> A Node.js module for interacting with the https://checklist.ninja API



## Install

`npm install checklist-ninja`

## Usage

```javascript
var ninja = require('checklist-ninja');

ninja.config({
  secret: <my secret API key>,
  pubkey: <my public API key>
});

ninja.createList("My new list", function(err, listID) {
  console.log("My new list: ", listID)
});

```