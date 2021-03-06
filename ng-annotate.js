// ng-annotate.js
// MIT licensed, see LICENSE file
// Copyright (c) 2013-2014 Olov Lassus <olov.lassus@gmail.com>

"use strict";

const t0 = Date.now();
const fs = require("fs");
const fmt = require("simple-fmt");
const tryor = require("tryor");
const ngAnnotate = require("./ng-annotate-main");
const version = require("./package.json").version;
const optimist = require("optimist")
    .usage("ng-annotate v" + version + "\n\nUsage: ng-annotate OPTIONS <file>\n\n" +
        "provide - instead of <file> to read from stdin\n" +
        "use -a and -r together to remove and add (rebuild) annotations in one go")
    .options("a", {
        alias: "add",
        boolean: true,
        describe: "add dependency injection annotations where non-existing"
    })
    .options("r", {
        alias: "remove",
        boolean: true,
        describe: "remove all existing dependency injection annotations"
    })
    .options("o", {
        describe: "write output to <file>. output is written to stdout by default"
    })
    .options("single_quotes", {
        boolean: true,
        describe: "use single quotes (') instead of double quotes (\")"
    })
    .options("regexp", {
        describe: "detect short form myMod.controller(...) iff myMod matches regexp"
    })
    .options("rename", {
        describe: "rename declarations and annotated refernces\n" +
            "originalName newName anotherOriginalName anotherNewName ...",
        default: ""
    })
    .options("plugin", {
        describe: "use plugin with path (experimental)"
    })
    .options("stats", {
        boolean: true,
        describe: "print statistics on stderr (experimental)"
    });

const argv = optimist.argv;

function exit(msg) {
    if (msg) {
        process.stderr.write(msg);
        process.stderr.write("\n");
    }
    process.exit(-1);
}

// validate options
if (argv._.length !== 1) {
    optimist.showHelp();
    exit("error: no input file provided");
}

if (!argv.add && !argv.remove) {
    optimist.showHelp();
    exit("error: missing option --add and/or --remove");
}

const filename = argv._.shift();

(filename === "-" ? slurpStdin : slurpFile)(runAnnotate);


function slurpStdin(cb) {
    let buf = "";

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function(d) {
        buf += d;
    });
    process.stdin.on("end", function() {
        cb(null, buf);
    });
    process.stdin.resume();
}

function slurpFile(cb) {
    if (!fs.existsSync(filename)) {
        cb(new Error(fmt('error: file not found {0}', filename)));
    }

    fs.readFile(filename, cb);
}

function runAnnotate(err, src) {
    if (err) {
        exit(err.message);
    }

    src = String(src);

    const config = tryor(function() {
        return JSON.parse(String(fs.readFileSync("ng-annotate-config.json")));
    }, {});


    ["add", "remove", "o", "regexp", "rename", "single_quotes", "plugin", "stats"].forEach(function(opt) {
        if (opt in argv) {
            config[opt] = argv[opt];
        }
    });

    if (config.plugin) {
        if (!Array.isArray(config.plugin)) {
            config.plugin = [config.plugin];
        }
        config.plugin = config.plugin.map(function(path) {
            const absPath = tryor(fs.realpathSync.bind(fs, path), null);
            if (!absPath) {
                exit(fmt('error: plugin file not found {0}', path));
            }
            // the require below may throw an exception on parse-error
            try {
                return require(absPath);
            } catch (e) {
                // node will already print file:line and offending line to stderr
                exit(fmt("error: couldn't require(\"{0}\")", absPath));
            }
        });
    }

  if (config.rename) {
    var flattenRename = config.rename.split(" ");
    var renameMap = {};
    for (var i = 0; i < flattenRename.length; i = i + 2) {
      renameMap[flattenRename[i]]= flattenRename[i+1];
    }
    config.rename = renameMap;
  }

    const run_t0 = Date.now();
    const ret = ngAnnotate(src, config);
    const run_t1 = Date.now();

    if (ret.errors) {
        exit(ret.errors.join("\n"));
    }

    const stats = ret._stats;
    if (config.stats && stats) {
        const t1 = Date.now();
        const all = t1 - t0;
        const run_esprima = stats.esprima_parse_t1 - stats.esprima_parse_t0;
        const all_esprima = run_esprima + (stats.esprima_require_t1 - stats.esprima_require_t0);
        const nga_run = (run_t1 - run_t0) - run_esprima;
        const nga_init = all - all_esprima - nga_run;

        const pct = function(n) {
            return Math.round(100 * n / all);
        };

        process.stderr.write(fmt("[{0} ms] esprima: {1}, nga init: {2}, nga run: {3}\n", all, all_esprima, nga_init, nga_run));
        process.stderr.write(fmt("[%] esprima: {0}, nga init: {1}, nga run: {2}\n", pct(all_esprima), pct(nga_init), pct(nga_run)));
    }

    if (ret.src && config.o) {
        try {
            fs.writeFileSync(config.o, ret.src);
        } catch (e) {
            exit(e.message);
        }
    } else if (ret.src) {
        process.stdout.write(ret.src);
    }
}
