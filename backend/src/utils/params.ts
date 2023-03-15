// Safe interface for using query params with prisma/typescript

import { Request } from "express";

type SafeParams = {
  [s: string]: string;
};

export function parseParams(req: Request): SafeParams {
  const raw = req.query;
  const safe: SafeParams = {};
  for (const key in raw) {
    if (typeof raw[key] !== "string") continue;
    safe[key] = (raw[key] as string) || undefined || undefined;
  }
  return safe;
}
