var assert     = require('assert');
var common     = require('../../common');
var connection = common.createConnection({debug: true, port: common.fakeServerPort});

var tid    = 0;
var server = common.createFakeServer();

server.listen(common.fakeServerPort, function (err) {
  assert.ifError(err);

  var messages = [];

  console.log = function (msg) {
    if (String(msg).indexOf('--') !== -1) {
      messages.push(msg);
    }
  };

  connection.ping(function (err) {
    assert.ifError(err);
    assert.equal(messages.length, 5);
    assert.deepEqual(messages, [
      '<-- HandshakeInitializationPacket',
      '--> (1) ClientAuthenticationPacket',
      '<-- (1) OkPacket',
      '--> (1) ComPingPacket',
      '<-- (1) OkPacket'
    ]);

    connection.destroy();
    server.destroy();
  });
});

server.on('connection', function (conn) {
  conn.handshake({ threadId: ++tid });
});
