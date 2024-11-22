#!/usr/bin/env node

import { Command } from "commander";
import { request } from "http";

const program = new Command();


program
  .name("vehicle-cli")
  .description("CLI pour interagir avec le serveur des véhicules")
  .version("1.0.0");


program.option("--address <url>", "Adresse du serveur à interroger");


program
  .command("create-vehicle")
  .description("Créer un nouveau véhicule dans la base de données")
  .requiredOption("--shortcode <shortcode>", "Code unique du véhicule")
  .requiredOption("--battery <battery>", "Niveau de la batterie (en pourcentage)")
  .requiredOption("--longitude <longitude>", "Longitude actuelle du véhicule")
  .requiredOption("--latitude <latitude>", "Latitude actuelle du véhicule")
  .action(async (options) => {
    const { address } = program.opts();
    if (!address) {
      console.error("Erreur : Veuillez fournir une adresse avec --address");
      process.exit(1);
    }

    const [host, port] = address.split(":");
    const postData = JSON.stringify({
      shortcode: options.shortcode,
      battery: parseInt(options.battery, 10),
      longitude: parseFloat(options.longitude),
      latitude: parseFloat(options.latitude),
    });

    const requestOptions = {
      hostname: host,
      port: port || 80,
      path: "/vehicles",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(
            `Created vehicle \`${options.shortcode}\``
          );
        } else {
          console.error(
            `Erreur : Le serveur a renvoyé le code ${res.statusCode} - ${res.statusMessage}`
          );
          try {
            const errorBody = JSON.parse(data);
            console.error(`Détails de l'erreur : ${errorBody.message || data}`);
          } catch {
            console.error("Réponse non interprétable : ", data);
          }
        }
      });
    });

    req.on("error", (e) => {
      console.error(
        `Erreur réseau : Impossible de contacter le serveur - ${e.message}`
      );
    });

    req.write(postData);
    req.end();
  });


program.parse(process.argv);
