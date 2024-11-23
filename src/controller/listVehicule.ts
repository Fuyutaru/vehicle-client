import { Command } from "commander";

interface Vehicle { 
    id: number;
    shortcode: string;
    battery: number;
    position: { latitude: number; longitude: number}; 
}

export function listVehicleCommand(program: Command) {
  program
    .command("list-vehicle")
    .description("Lister les vehicules de la base de données")
    .action(async () => {
    const { address } = program.opts();

    if (!address) {
    console.error("Erreur : Veuillez fournir une adresse avec --address");
    process.exit(1);
    }

    const req  = `http://${address}/vehicles`;

    try {
        const promise = await fetch(req);
        if (!promise.ok) {
            throw new Error(`HTTP error! status: ${promise.status}`);
        }
        const result : {vehicles: Vehicle[]} = await promise.json();

        if (result.vehicles.length === 0){
            console.log('-------------------------------');
            console.log("Ah, il n'y a pas de vehicules...")
        }
        else {
            console.log('-------------------------------');
            console.log("Voici la liste des vehicules");
            result.vehicles.forEach((vehicle: Vehicle) => {
                console.log('-------------------------------');
                console.log(`Vehicle id: ${vehicle.id}`);
                console.log(`Shortcode: ${vehicle.shortcode}`);
                console.log(`Battery: ${vehicle.battery}`);
                console.log(`Position: Latitude ${vehicle.position.latitude}, Longitude ${vehicle.position.longitude}`);
            })
        }
    } catch (error) { console.error('Erreur:', error); }

    });
}
