/* eslint-disable global-require */
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import middie from "@fastify/middie";
import fastify from "fastify";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import path from "path";

const startServer = async (port: number) => {
  const serviceAccount = require("./public/jenosize-bc15f-firebase-adminsdk-a288x-1237f5f066.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const server = fastify({ logger: true });
  server.register(middie);
  server.register(cors);
  server.register(helmet, { contentSecurityPolicy: false });

  server.addHook("preHandler", async (req, res) => {
    const newToken = req.headers.authorization?.split(" ") || [];
    getAuth()
      .verifyIdToken(newToken[1])
      .then((decodedToken) => {
        console.log(decodedToken);
      })
      .catch(() => {
        res.statusCode = 401;
      });

    // validate ด้วย uid
    // getAuth()
    //   .getUser(String(req.headers["api-key"]))
    //   .then((userRecord: any) => {
    //     console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    //   })
    //   .catch(() => {
    //     res.statusCode = 401;
    //   });
  });

  // ใช้งานไม่ได้
  // server.decorate("authenticate", async (req: any, res: { statusCode: number }) => {
  //   try {
  //     console.log(req);
  //     if (false) {
  //       res.statusCode = 401;
  //       throw new Error("401 Unauthorized");
  //     }
  //   } catch {
  //     res.statusCode = 401;
  //     throw new Error("401 Unauthorized");
  //   }
  // });
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
