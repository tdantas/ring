# ring

JS Consistent Hashing

````
var Ring = require('./');
var hashRing = new Ring();

hashRing.add('mongodb://us.domain.com');
hashRing.add('mongodb://pt.domain.com');

var node = hashRing.get('user:1');
console.log(node) // could be us.domain.com or pt.domain.com

hashRing.remove('mongodb:://us.domain.com');

node = hashRing.get('user:1'); 
console.log(node) // mongodb://pt.domain.com

````

 **Let me know whatever you think that is wrong. I'll appreciate.**
