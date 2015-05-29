#!/usr/bin/env node
var fs = require("fs");
var _ = require("lodash");
var pkg = require([__dirname, "package"].join("/"));
var nomnom = require("nomnom");
var API = require([__dirname, "lib", "api"].join("/"));
var Table = require("cli-table");
var colors = require("colors");

var api;

var utils = {
    setup_api: function(fn){
        fs.readFile([process.env.HOME, ".lifx"].join("/"), function(err, content){
            if(err)
                return fn(err);

            try{
                return fn(null, new API(JSON.parse(content)));
            }
            catch(err){
                return fn(err);
            }
        });
    }
}

nomnom.script(pkg.name);
nomnom.option("version", {
    flag: true,
    abbr: "v",
    help: "print version and exit",
    callback: function(){
        return ["v", pkg.version].join("")
    }
});

var commands = {
    configure: {
        init: function(options){
            fs.writeFile([process.env.HOME, ".lifx"].join("/"), JSON.stringify({token: options.token}), function(err){
                if(err)
                    throw err;

                console.log("Successfully configured clifx");
            });
        },

        options: {
            token: {
                help: "LIFX Cloud token",
                required: true
            }
        }
    },

    list: {

        init: function(options){
            utils.setup_api(function(err, api){
                if(err)
                    throw err;

                var headers = {
                    ID: 20,
                    Label: 40,
                    Group: 30,
                    Location: 30,
                    Connected: 15,
                    Power: 10
                }

                var table = new Table({
                    head: _.keys(headers),
                    colWidths: _.values(headers)
                });

                if(_.has(options, "location"))
                    var selector = ["location", options.location].join(":");
                else if(_.has(options, "group"))
                    var selector = ["group", options.group].join(":");
                else if(_.has(options, "label"))
                    var selector = ["label", options.label].join(":");
                else if(_.has(options, "id"))
                    var selector = ["id", options.id].join(":");
                else
                    var selector = "all";

                api.list_lights(selector, function(err, response){
                    _.each(response, function(light){
                        table.push([
                            light.id,
                            light.label,
                            light.group.name,
                            light.location.name,
                            light.connected ? "Yes".green : "No".red,
                            light.power ? "Yes".green : "No".red
                        ]);
                    });

                    console.log(table.toString());
                });
            });
        },

        options: {
            group: {
                help: "Name of the group of lights to target",
                required: false
            },
            id: {
                help: "ID of light to target",
                required: false
            },
            label: {
                help: "Label of the light to target",
                required: false
            },
            location: {
                help: "Location of the lights to target",
                required: false
            }
        }
    },

    "power-on": {
        init: function(options){
            utils.setup_api(function(err, api){
                if(err)
                    throw err;

                if(_.has(options, "location"))
                    var selector = ["location", options.location].join(":");
                else if(_.has(options, "group"))
                    var selector = ["group", options.group].join(":");
                else if(_.has(options, "label"))
                    var selector = ["label", options.label].join(":");
                else if(_.has(options, "id"))
                    var selector = ["id", options.id].join(":");
                else
                    var selector = "all";

                api.power_on_lights(selector, function(err, response){
                    if(err)
                        throw err;

                    if(_.isArray(response))
                        console.log(["Successully turned on ", response.length, "lights!"].join(" "));
                    else
                        console.log("Successfully turned on 1 light!");
                });
            });
        },

        options: {
            group: {
                help: "Name of the group of lights to target",
                required: false
            },
            id: {
                help: "ID of light to target",
                required: false
            },
            label: {
                help: "Label of the light to target",
                required: false
            },
            location: {
                help: "Location of the lights to target",
                required: false
            }
        }

    },

    "power-off": {
        init: function(options){
            utils.setup_api(function(err, api){
                if(err)
                    throw err;

                if(_.has(options, "location"))
                    var selector = ["location", options.location].join(":");
                else if(_.has(options, "group"))
                    var selector = ["group", options.group].join(":");
                else if(_.has(options, "label"))
                    var selector = ["label", options.label].join(":");
                else if(_.has(options, "id"))
                    var selector = ["id", options.id].join(":");
                else
                    var selector = "all";

                api.power_off_lights(selector, function(err, response){
                    if(err)
                        throw err;

                    if(_.isArray(response))
                        console.log(["Successully turned off", response.length, "lights!"].join(" "));
                    else
                        console.log("Successfully turned off 1 light!");
                });
            });
        },

        options: {
            group: {
                help: "Name of the group of lights to target",
                required: false
            },
            id: {
                help: "ID of light to target",
                required: false
            },
            label: {
                help: "Label of the light to target",
                required: false
            },
            location: {
                help: "Location of the lights to target",
                required: false
            }
        }
    }
}

_.each(commands, function(command, name){
    nomnom.command(name).options(command.options).callback(command.init);
});

nomnom.parse();
