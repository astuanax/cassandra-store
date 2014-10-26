var assert = require("assert");
var debug = require("debug")("cassandra-store");
var session = require("express-session");
var uuid = require("uuid");
var CassandraStore = require("../index")(session);

var id = uuid.v1();
var options = {
    "contactPoints": [ process.env.DBHOST ]
};
var store = new CassandraStore(options);
var testSession =
{
    "cookie":
    {
        "path" : "/",
        "httpOnly" : true,
        "secure": true,
        "maxAge" : 600000
    },
    "name": "sid"
};

describe("cassandra-store", function()
{
    describe("#set", function()
    {
        before(function(done)
        {
            store.set(id, testSession, function (error, result)
            {
                if (error)
                {
                    debug("Error: %s", error);
                }
                else
                {
                    debug("Result: %s", JSON.stringify(result, null, 0));
                }
                done();
            });
        });
        it("should get an existing session", function(done)
        {
            store.get(id, function (error, session)
            {
                if(error)
                {
                    debug("Error: %s", error);
                }
                else
                {
                    debug("Session: %s", JSON.stringify(session, null, 0));
                }
                assert.deepEqual(session, testSession);
                done();
            });
        });
        it("should destroy an existing session", function(done)
        {
            store.destroy(id, function (error, result)
            {
                if(error)
                {
                    debug(error.message);
                }
                else
                {
                    debug(result);
                }
                assert.equal(result.header.opcode, 8);
                done();
            });
        });
    });
});
