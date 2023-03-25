import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import { doctorOnlyMiddleware } from "../middleware/authMiddleware";

const discussionRouter = Router();
discussionRouter.use(doctorOnlyMiddleware);

discussionRouter.post("/", async (req, res) => {
  const body = req.body;

  if (!body?.title || !body?.body) {
    throw new APIError("Missing title or body", 400);
  }

  const post = await prisma.discussion.create({
    data: {
      title: body.title,
      body: body.body,
      createdBy: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  return res.json(post);
});

export { discussionRouter };
