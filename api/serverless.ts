import app from "../app";

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit("request", req, res);
};
