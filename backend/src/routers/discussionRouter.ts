import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import { doctorOnlyMiddleware } from "../middleware/authMiddleware";
import { parseParams } from "../utils/params";

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

discussionRouter.get("/", async (req, res) => {
  const params = parseParams(req);
  console.log(params);
  const posts = await prisma.discussion.findMany({
    where: {
      id: params.id,
      createdById: params.doctorId,
      body: {
        contains: params.query,
      },
    },

    // More testing might be needed here
    orderBy: {
      [params.orderBy]: params.order || "desc",
    },
  });
  res.json(posts);
});

export { discussionRouter };
