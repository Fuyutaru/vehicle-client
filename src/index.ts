#!/usr/bin/env node

import { Command } from "commander";
import { createVehicleCommand } from "./controller/createVehicule";

const program = new Command();


program
  .name("vehicle-cli")
  .description("CLI pour interagir avec le serveur des véhicules")
  .version("1.0.0");


program.option("--address <url>", "Adresse du serveur à interroger");

createVehicleCommand(program);


program.parse(process.argv);
