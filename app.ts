import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import middie from "@fastify/middie";
import fastify from "fastify";
// import { initializeApp } from "firebase/app";
import path from "path";

const startServer = async (port: number) => {
  //   const firebaseConfig = {
  //     apiKey: "AIzaSyB0E5t0uZnz6R0PXQuOR7DVx7we2Gb-Gqg",
  //     authDomain: "jenosize-bc15f.firebaseapp.com",
  //     projectId: "jenosize-bc15f",
  //     storageBucket: "jenosize-bc15f.appspot.com",
  //     messagingSenderId: "77726164123",
  //     appId: "1:77726164123:web:0a68835f35d4c9fd69523e",
  //   };
  //   const app = initializeApp(firebaseConfig);

  const server = fastify({ logger: true });
  await server.register(middie);
  server.register(cors);
  server.register(helmet, { contentSecurityPolicy: false });
  await server.decorate("authenticate", async (req: any, res: { statusCode: number }) => {
    try {
      console.log(req);
      if (false) {
        res.statusCode = 401;
        throw new Error("401 Unauthorized");
      }
    } catch {
      res.statusCode = 401;
      throw new Error("401 Unauthorized");
    }
  });
  server.register(autoload, {
    dir: path.join(__dirname, "controller"),
  });

  server.listen({ port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

startServer(3001);
