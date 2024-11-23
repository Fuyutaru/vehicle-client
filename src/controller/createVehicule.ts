import { Command } from "commander";
import { sendHttpRequest } from "./request";

interface CreateVehicleOptions {
  shortcode: string;
  battery: number;
  longitude: number;
  latitude: number;
}

interface ServerError extends Error {
  statusCode?: number;
}

export function createVehicleCommand(program: Command) {
  program
    .command("create-vehicle")
    .description("Créer un nouveau véhicule dans la base de données")
    .requiredOption("--shortcode <shortcode>", "Code unique du véhicule")
    .requiredOption("--battery <battery>", "Niveau de la batterie (en pourcentage)")
    .requiredOption("--longitude <longitude>", "Longitude actuelle du véhicule")
    .requiredOption("--latitude <latitude>", "Latitude actuelle du véhicule")
    .action(async (options: Record<string, string>) => {
      const { address } = program.opts();

      if (!address) {
        console.error("Erreur : Veuillez fournir une adresse avec --address");
        process.exit(1);
      }

      const [host, port] = address.split(":");

      const battery = parseInt(options.battery, 10);
      const longitude = parseFloat(options.longitude);
      const latitude = parseFloat(options.latitude);

      if (isNaN(battery) || battery < 0 || battery > 100) {
        console.error("Erreur : Le niveau de batterie doit être un entier entre 0 et 100.");
        process.exit(1);
      }

      if (isNaN(longitude) || isNaN(latitude)) {
        console.error("Erreur : Longitude et latitude doivent être des nombres valides.");
        process.exit(1);
      }

      const vehicleData: CreateVehicleOptions = {
        shortcode: options.shortcode,
        battery,
        longitude,
        latitude,
      };

      try {
        const response = await sendHttpRequest(
          host,
          parseInt(port || "80", 10),
          "/vehicles",
          "POST",
          vehicleData
        );

        console.log(
          `Created vehicle \`${response.vehicle.shortcode}\`, with ID \`${response.vehicle.id}\``
        );
      } catch (error) {
        const serverError = error as ServerError;

        console.error("Erreur lors de la création du véhicule :", serverError.message);
        if (serverError.statusCode) {
          console.error(`Code HTTP : ${serverError.statusCode}`);
        }
      }
    });
}
