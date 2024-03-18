/* eslint-disable no-console */
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
  const serviceAccount = {
    type: "service_account",
    project_id: "jenosize-bc15f",
    private_key_id: "1237f5f066532ed714ce48ed8ce3d452ad3d65d3",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCODHDJ4eiLJ/ph\nYNmLnYLx6ztr4ACZOindKRYN5snJCeRiuy2ePjugd42ugQgN6S32uHGJF/18E8mz\nx35rW/N+P52qtRhxLgfatUNeuHQ2qPFepTu1Nn3F1EMq1MVWJr7hpC4hLmFwaMV6\nsk5Y1Ren/bq/R2K/dFl/VUfshY2oKwwH3wsreibuBeIXEVGGWa9rmBtXkKWqLZat\nH5fsblQlSuyKD/tc7o1/Std2lLsYCguJ7xWeRm42Vz6iMLtkwi9nTRY6c+zpvas+\n9XdH+fUlgnfxwOy+D1m7CFfjru55sb7AauEsZgTs1bLbBR+uHS+QeGVFeOlH0Vpt\nVRY7JASbAgMBAAECggEABku1hrJv32sK2odeXPptiVIHCjBIFoJ7by/uUvi9oh7B\nc+weiNBH+EQUOtMWi6H1cDqbMvD7QnqQtVp210SgtXcVrTE66hlDg9qw0mE+gAWw\n3PmvJx2efsbPoKBZjAifloSeVB4oIhair14jwXrVrOkT/nz9esV/X04PqANV/0ld\njvAA7pUr7/BZ43Yy6/xAyzloUbJjN6Nrze9urZKxRT6YAX3B7NaVhXW7HPwbhP6I\nzPhNl4tgKtpTvWZ5S2x4Cvs/GXwFjBfTzyV9hkJk+IujE1VXGrxe1PqZQoz1swdt\n/eBy3cr9WXNB2hhxwuRx3DfHt+ka7VMCW/zYGK4psQKBgQDFtdGOZhyEhnh7le3y\ne21t90z9u3rj4I3EPVXBPdBwO/6Z/hWr5+Q5kyXoP/c8GsBZi9ojjAUZnO4VrD8E\n7mRYJjjdcT09oeKc3P3pyUr6DIEKdNatMAKe0oFKxSO3ChKkWVzH9VYjSKtLFyCP\n0WENLWaVOprW9WUOkSl0AdpxVwKBgQC37Y9Ke54pU/YPYsDrzkz1SzSI6xu6cNiw\nLgyICWQ8Kx3pmd10L5rG9n4TWA6sqcpyo3EGiCbqaDA7YBj1k0udXoUGuF6MQIHu\nkY/3KQY+HT2+qXll6nXh+srGoNhmYhEeDDz6pAImOsM7hSyM+59WF7egtlzLEmJ0\nBSKE4z7oXQKBgGd/FVLoyzboubtgMe6EhDVTht8wPFV74FqBDRoahLmr/kyYgLm7\nq3IkQGzCx2aUTmrR1gBTtPvCdbOstlSbgrXOVGg/diKEUv9whA7VC8W3s/lITnTc\ntBJ1+a6tYlPYFwgnq3UVTeEskla9pZMDtT1TreaihhnO3fbxMHUE31gDAoGBALKz\nyqQIhXwMCqeaQG0brSQq5KkfHXrBB5fttdk6nrvi/JYqG8M2OYCUn5w101QpR/yo\nFjnNcVoQzsPxs25upWoKGt+TpLFKP7PGlAUFQ/53tLUZvkyqR8y/OeNRBdA7+fui\n0mCHl1sDfwrGcqmsFHy2YIByjqfzfdrR3l8U19s1AoGAfZct54cOhNZtq9LvCegl\n7PAVRLetqBanYRZCDlyIPFNX2utGljKIT8eHjA7tua69qyMFD10PfI63TmndPxbZ\nodr31Yq9VBpwS6wJkrbzhSYdeUhIhJ+Pw3S36g7h2zuZ2Lyv/ZueXI9Dm2FlZxLr\n2jaXQozUeXu+U5R5CJi579o=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-a288x@jenosize-bc15f.iam.gserviceaccount.com",
    client_id: "105573902002195340047",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-a288x%40jenosize-bc15f.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  } as any;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const server = fastify({ logger: true });
  server.register(middie);
  server.register(cors);
  server.register(helmet, { contentSecurityPolicy: false });

  server.addHook("preHandler", async (req, res) => {
    getAuth()
      .verifyIdToken(String(req.headers["api-key"]))
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
