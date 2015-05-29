var _ = require("lodash");
var request = require("request");

var token;

function API(auth){
    this.configuration = {
        baseUrl: "https://api.lifx.com/v1beta1",
        json: true,
        headers: {
            "User-Agent": "lifx-cli",
            "Authorization": ["Bearer", auth.token].join(" ")
        }
    }
}

API.prototype.list_lights = function(selector, fn){
    if(_.isFunction(selector)){
        fn = selector;
        selector = "all";
    }

    var options = _.merge(_.clone(this.configuration), {
        method: "GET",
        url: ["", "lights", selector].join("/")
    });

    request(options, function(err, response){
        if(err)
            return fn(err);
        else if(response.statusCode != 200)
            return fn(new Error(response.body));
        else
            return fn(null, response.body);
    });
}

API.prototype.power_on_lights = function(selector, fn){
    if(_.isFunction(selector)){
        fn = selector;
        selector = "all";
    }

    var options = _.merge(_.clone(this.configuration), {
        method: "PUT",
        url: ["", "lights", selector, "power"].join("/"),
    });

    options.json = {
        state: "on"
    }

    request(options, function(err, response){
        if(err)
            return fn(err);
        else if(response.statusCode != 207 && response.statusCode != 201){
            if(_.has(response.body, "error"))
                return fn(new Error(response.body.error));
            else
                return fn(new Error(response.body));
        }
        else
            return fn(null, response.body);
    });
}

API.prototype.power_off_lights = function(selector, fn){
    if(_.isFunction(selector)){
        fn = selector;
        selector = "all";
    }

    var options = _.merge(_.clone(this.configuration), {
        method: "PUT",
        url: ["", "lights", selector, "power"].join("/"),
    });

    options.json = {
        state: "off"
    }

    request(options, function(err, response){
        if(err)
            return fn(err);
        else if(response.statusCode != 207 && response.statusCode != 201){
            if(_.has(response.body, "error"))
                return fn(new Error(esponse.body.error));
            else
                return fn(new Error(response.body));
        }
        else
            return fn(null, response.body);
    });
}

module.exports = API;
