import Yargs from "yargs";

Yargs.command(require("./cli")).parse(process.argv.slice(2));
