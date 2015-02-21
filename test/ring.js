var assert = require('chai').assert;
var Ring = require('../');

describe('Ring', function() {
  var ring;

  beforeEach(function() {
    ring = new Ring();
  });

  it('add nodes', function() {
      assert.equal(ring.size(), 0);
      ring.add('node1');
      ring.add('node2');
      assert.equal(ring.size(), 2);
  });

  it('get nodes', function() {
      ring.add('127.0.0.1');
      var node = ring.get('user:id:1');
      assert.equal(node, '127.0.0.1');
  });

  it('discover a node for whatever key', function() {
    ring.add('127.0.0.2');
    var node =ring.get('user:id:2');
    assert.equal(node, '127.0.0.2');
  });

  it('remove node from ring', function(){
    ring.add('122.0.0.1');
    var node = ring.get('user.id:4');
    assert.ok(node);
    ring.remove('122.0.0.1');
    var emptyNode = ring.get('user.id:4');
    assert.notOk(emptyNode);
  });

  it('delegates to next node when  one fails', function() {
    var nodes = ['127.0.0.1', '192.168.0.2'];
    nodes.forEach(function(n) { ring.add(n); });
    var node = ring.get('user.id:4');

    if (node === nodes[0])
      nodes.splice(0,1);
    else if (node == nodes[1])
      nodes.splice(1,1);
    else
      assert(false, 'should never be here');

    ring.remove(node);
    var otherNode = ring.get('user.id:4');
    assert.equal(otherNode, nodes[0]);
  });

});
