var crypto = require('crypto');

module.exports = Ring;

function Ring(algo, vnodes) {
  var keys = [];
  var hashRing = { };
  var nodes = [];
  algo = algo || 'sha1';
  vnodes = vnodes || 160;

  return {  add: add,
            get: get,
            remove: remove,
            size: size };

  function add(node) {
    nodes.push(node);
    var vnodesKeys = generateVnodesKeys(node.key || node);

    vnodesKeys.forEach(function(key) {
      hashRing[key] = node;
    });

    keys = keys.concat(vnodesKeys);
    keys.sort();
  }

  function get(key) {
    var idx = search(keys, digest(key));
    return hashRing[ keys[idx] ];
  }

  function remove(node) {
    var vnodeKeys = generateVnodesKeys(node.key || node);
    for ( var i = 0; i < nodes.length; i++) {
      if (nodes[i] === node) {
        nodes.splice(i, 1);
      }
    }

    vnodeKeys.forEach(function(key) {
      delete hashRing[key];

      for(var i = 0; i < keys.length; i++) {
        if (keys[i] === key) {
          keys.splice(i, 1);
          i--;
        }
      }
    });
  }

  function size() {
    return nodes.length;
  }

  function generateVnodesKeys(key) {
    var result = [];
    for(var i=0; i< vnodes; i++) {
      result.push(digest([key,i].join('#')));
    }
    return result;
  }

  function digest(key) {
    return crypto
          .createHash(algo)
          .update(key)
          .digest('hex');
  }

  function search(array, key) {
    var minIdx = 0;
    var maxIdx = array.length - 1;

    if (maxIdx === 0 )
      return 0;

    while ( minIdx <= maxIdx) {
      var idx = minIdx + Math.floor((maxIdx - minIdx) + 1 / 2 );
      var v = array[idx];
      var comp = (v > key) ? 1 : ( v < key ? -1 : 0);

      if (comp === 0)
        return idx;
      if (comp > 0)
        maxIdx = idx - 1;
      if (comp < 0)
        minIdx = idx + 1;
    }

    return (maxIdx + 1) % array.length;
  }
}
