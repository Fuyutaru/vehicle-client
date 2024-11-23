import { request } from "http";

export function sendHttpRequest(
  hostname: string,
  port: number,
  path: string,
  method: string,
  body?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : "";

    const options = {
      hostname,
      port,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch {
            reject(new Error("Impossible de parser la réponse JSON"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(responseData);

            const detailedMessage =
              errorResponse.error?.details?.violations?.join(", ") ||
              errorResponse.message ||
              responseData;

            reject(
              new Error(
                `Erreur HTTP ${res.statusCode}: ${res.statusMessage}\nDétails de l'erreur : ${detailedMessage}`
              )
            );
          } catch {
            reject(
              new Error(
                `Erreur HTTP ${res.statusCode}: ${res.statusMessage}\nRéponse brute : ${responseData}`
              )
            );
          }
        }
      });
    });

    req.on("error", (e) => {
      reject(new Error(`Erreur réseau : ${e.message}`));
    });

    req.write(data);
    req.end();
  });
}
