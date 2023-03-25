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

    orderBy: params.orderBy
      ? {
          [params.orderBy]: params.order || "desc",
        }
      : undefined,
  });
  res.json(posts);
});

discussionRouter.delete("/:id", async (req, res) => {
  // Delete all comments
  try {
    await prisma.comment.deleteMany({
      where: {
        discussionId: req.params.id,
      },
    });
  } catch (error) {
    throw new APIError("Could not delete comments", 500);
  }

  const post = await prisma.discussion.deleteMany({
    where: {
      id: req.params.id,
      createdById: req.user.id,
    },
  });

  // If no post was deleted, throw an error
  if (post.count === 0) {
    throw new APIError("No post was deleted", 400);
  }

  res.json(post);
});

discussionRouter.get("/:id", async (req, res) => {
  const post = await prisma.discussion.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      comments: true,
    },
  });
  res.json(post);
});

discussionRouter.post("/comment", async (req, res) => {
  const body = req.body;

  if (!body?.content || !body?.discussionId) {
    throw new APIError("Missing content or discussionId", 400);
  }

  const comment = await prisma.comment.create({
    data: {
      content: body.content,
      createdBy: {
        connect: {
          id: req.user.id,
        },
      },
      discussion: {
        connect: {
          id: body.discussionId,
        },
      },
    },
  });

  return res.json(comment);
});

// Delete a comment
discussionRouter.delete("/comment/:id", async (req, res) => {
  if (!req.params.id) {
    throw new APIError("Missing comment id", 400);
  }
  const comment = await prisma.comment.deleteMany({
    where: {
      id: req.params.id,
      createdById: req.user.id,
    },
  });

  // If no comment was deleted, throw an error
  if (comment.count === 0) {
    throw new APIError("No comment was deleted", 400);
  }

  res.json(comment);
});

export { discussionRouter };
