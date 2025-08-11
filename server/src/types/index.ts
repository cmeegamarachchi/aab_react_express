import { Request, Response } from "express";

export interface RouteHandler {
  route: string;
  method: string;
  handler: (req: Request<any>, res: Response) => void | Promise<void>;
}

export type RouteHandlers = RouteHandler | RouteHandler[];
