"use strict";

var moment = require("moment"),
    config = require("./config.json"),
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    host = spec.host(config.host),
    crypto = require('crypto'),
    fixtures = new (require("sql-fixtures"))(config.database);

var postAPI = spec.define({
    "endpoint": config.endpoints.challenge,
    "method": "POST",
    "request": {
        "contentType": spec.ContentType.JSON,
        "params": {
            "challenge": {
                "name": "string",
                "description": "string",
                "date": "date",
            },
            "digest": "string"
        }
    },
    "response": {
        "contentType": spec.ContentType.JSON,
        "data": {
            "challengeId": "int",
            "result": "boolean",
            "reason": "string"
        },
        "rules": {
            "challengeId": {
                "required": true
            },
            "result": {
                "required": true
            },
            "reason": {
                "required": function (data) {
                    return !data.result;
                }
            }
        }
    }
});

var putAPI = spec.define({
    "endpoint": config.endpoints.challenge + "[itemId]",
    "method": "PUT",
    "request": {
        "contentType": spec.ContentType.JSON,
        "params": {
            "challenge": {
                "name": "string",
                "description": "string",
                "date": "date",
            },
            "digest": "string"
        }
    },
    "response": {
        "contentType": spec.ContentType.JSON,
        "data": {
            "result": "boolean",
            "reason": "string"
        },
        "rules": {
            "result": {
                "required": true
            },
            "reason": {
                "required": function (data) {
                    return !data.result;
                }
            }
        }
    }
});

var deleteAPI = spec.define({
    "endpoint": config.endpoints.challenge + "[itemId]",
    "method": "DELETE",
    "request": {
        "contentType": spec.ContentType.JSON,
        "params": {
            "digest": "string"
        }
    },
    "response": {
        "contentType": spec.ContentType.JSON,
        "data": {
            "result": "boolean",
            "reason": "string"
        },
        "rules": {
            "result": {
                "required": true
            },
            "reason": {
                "required": function (data) {
                    return !data.result;
                }
            }
        }
    }
});

var getAPI = spec.define({
    "endpoint": config.endpoints.challenge + "[itemId]",
    "method": "GET",
    "request": {
        "params": {
            "digest": "string"
        }
    },
    "response": {
        "contentType": spec.ContentType.JSON,
        "data": {
            "challenge": {
                "name": "string",
                "description": "string",
                "date": "date",
            },
            "result": "boolean",
            "reason": "string"
        },
        "rules": {
            "challenge": {
                "required": function (data) {
                    return data.result;
                }
            },
            "result": {
                "required": true
            },
            "reason": {
                "required": function (data) {
                    return !data.result;
                }
            }
        }
    }
});

describe("Unauthorized", function () {
    it("cannot POST without digest", function (done) {
        host
        .api(postAPI)
        .params({
            "challenge": {
                "name": "Givery Codecheck",
                "description": "",
                "date": moment().format("YYYY-MM-DD"),
            },
            "digest": ""
        })
        .unauthorized(done);
    });
    it("cannot PUT without digest", function (done) {
        host
        .api(putAPI)
        .params({
            "challenge": {
                "name": "Givery Codecheck",
                "description": "",
                "date": moment().format("YYYY-MM-DD"),
            },
            "digest": "",
            "itemId": 0
        })
        .unauthorized(done);
    });
    it("cannot DELETE without digest", function (done) {
        host
        .api(deleteAPI)
        .params({
            "digest": "",
            "itemId": 0
        })
        .unauthorized(done);
    });
    it("cannot GET without digest", function (done) {
        host
        .api(getAPI)
        .params({
            "digest": "",
            "itemId": 0
        })
        .unauthorized(done);
    });
    
    it("cannot POST with incorrect digest", function (done) {
        var digest = crypto.createHmac("sha256", config.secret).update("incorrect").digest("hex");
        host
        .api(postAPI)
        .params({
            "challenge": {
                "name": "Givery Codecheck",
                "description": "",
                "date": moment().format("YYYY-MM-DD"),
            },
            "digest": digest
        })
        .unauthorized(done);
    });
    it("cannot PUT with incorrect digest", function (done) {
        var digest = crypto.createHmac("sha256", config.secret).update("incorrect").digest("hex");
        host
        .api(putAPI)
        .params({
            "challenge": {
                "name": "Givery Codecheck",
                "description": "",
                "date": moment().format("YYYY-MM-DD"),
            },
            "digest": digest,
            "itemId": 0
        })
        .unauthorized(done);
    });
    it("cannot DELETE with incorrect digest", function (done) {
        var digest = crypto.createHmac("sha256", config.secret).update("incorrect").digest("hex");
        host
        .api(deleteAPI)
        .params({
            "digest": digest,
            "itemId": 0
        })
        .unauthorized(done);
    });
    it("cannot GET with incorrect digest", function (done) {
        var digest = crypto.createHmac("sha256", config.secret).update("incorrect").digest("hex");
        host
        .api(getAPI)
        .params({
            "digest": digest,
            "itemId": 0
        })
        .unauthorized(done);
    });
});

describe("Authorized", function () {
    beforeEach(function (done) {
        fixtures.knex("challenges").del().then(function () {
            done();
        });
    });
    
    it("should validate through chain", function (done) {
        var digest;
        var date = moment().format("YYYY-MM-DD");
        var testPost = function () {
            digest = crypto.createHmac("sha256", config.secret).update(config.endpoints.challenge + ";POST").digest("hex");
            return host.api(postAPI)
                .params({
                "challenge": {
                    "name": "Givery Codecheck",
                    "description": "",
                    "date": "0000-00-00",
                },
                "digest": digest
            })
        };
        var testPut = function (id) {
            digest = crypto.createHmac("sha256", config.secret).update(config.endpoints.challenge + ";PUT").digest("hex");
            return host.api(putAPI)
                .params({
                "challenge": {
                    "name": "Givery Codecheck",
                    "description": "TestPut",
                    "date": date,
                },
                "digest": digest,
                "itemId": id
            });
        };
        var testGet = function (id) {
            digest = crypto.createHmac("sha256", config.secret).update(config.endpoints.challenge + ";GET").digest("hex");
            return host.api(getAPI).params({
                "digest": digest,
                "itemId": id
            });
        };
        
        testPost().success(function (data, res) {
            var id = data.challengeId;
            testPut(id).success(function (data, res) {
                assert.equal(data.result, true);
                testGet(id).success(function (data, res) {
                    assert.equal(data.challenge.date, date);
                    done();
                });;
            });
        });
    });
    
    it("should DELETE", function (done) {
        fixtures.create({
            "challenges": [{
                    "name": "Givery Codecheck",
                    "description": "Test Delete",
                    "date": "0000-00-00"
                }]
        }).then(function (res) {
            var id = res.challenges[0].id;
            var digest = crypto.createHmac("sha256", config.secret).update(config.endpoints.challenge + ";DELETE").digest("hex");
            host.api(deleteAPI)
            .params({
                "digest": digest,
                "itemId": id
            }).success(function (data, res) {
                digest = crypto.createHmac("sha256", config.secret).update(config.endpoints.challenge + ";GET").digest("hex");
                host.api(getAPI).params({
                    "digest": digest,
                    "itemId": id
                }).success(function (data, res) {
                    assert.equal(data.result, false);
                    done();
                });
            });
        });
    });
});