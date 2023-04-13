import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import {
    authMiddleware,
    doctorOnlyMiddleware,
    patientOnlyMiddleware,
} from  "../middleware/authMiddleware";
import { parseParams } from "../utils/params";


const reviewRouter = Router();
//get reviews
reviewRouter.get("/", authMiddleware, async (req, res) => {
    const params = parseParams(req);
    const reviews = await prisma.review.findMany({
        where: {
            id: params.id,
            doctorId: params.doctorId,
            patientId: params.patientId,
        },
        orderBy: params.orderBy
        ? {
            [params.orderBy]: params.order || "desc",
        }
        : undefined,
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true, 
                    username: true,
                    id: true,
                },
            },
            patient: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    id: true,
                },
            },
        },
    });
    res.json(reviews);
});
//get reviews of specific doctor by ID
reviewRouter.get("/:doctorId", authMiddleware, async (req, res) => {
    const params = parseParams(req);
    const reviews = await prisma.review.findMany({
        where: {
            doctorId: params.doctorId,
        },

        orderBy: params.orderBy
        ? {
            [params.orderBy]: params.order || "desc",
        }
        : undefined,
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    id: true,
                },
            },
        }
    });
    res.json(reviews);
});

//create review
reviewRouter.post("/", patientOnlyMiddleware, async (req, res) => {
    const body = req.body;
    if(!body) {
        throw new APIError("Missing body", 400);
    }
    if(!body.comments){
        throw new APIError("Missing comments", 400);
    }
    if(!body.rating){
        throw new APIError("Missing rating", 400);
    }

    const review = await prisma.review.create({
        data: {
            patientId: req.user.id,
            doctorId: body.doctorId,
            content: body.content,
            rating: body.rating,
        },
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    id: true,
                }
            },
            patient: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    id: true,
                }
            }
        }
    });
    res.json(review);
});

//edit review
reviewRouter.put("/:id", doctorOnlyMiddleware, async (req, res) => {
    const review = await prisma.review.findUnique({
        where: {
            id: req.params.id,
        }
    });
    const body = req.body;
    if(!review) {
        throw new APIError("Review not found", 400);
    }
    if(!body) {
        throw new APIError("Missing body", 400);
    }
    if(!body.comments){
        throw new APIError("Missing comments", 400);
    }
    if(!body.rating){
        throw new APIError("Missing rating", 400);
    }
    const updatedReview = await prisma.review.update({
        where: {
            id: req.params.id,
        },
        data: {
            rating: body.rating,
            content: body.content,
        },
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    id: true,
                }
            },
            patient: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    id: true,
                }
            }
        }
    });
    res.json(updatedReview);
});

//delete review
reviewRouter.delete("/:id", doctorOnlyMiddleware, async (req, res) => {
   const review = await prisma.appointment.findUnique({
    where: {
        id: req.params.id,
    },
    include: {
        doctor: true,
        patient: true
    },
   });
   if(!review){ throw new APIError("Appointment not found", 404) }
   if (
    review.patientId !== req.user.id &&
    req.user.id !== review.doctorId
   ) throw new APIError("Unauthorized", 401);

   await prisma.appointment.delete({
    where: {
        id: req.params.id,
    },
   });
   return res.json({ success: true})
})


//export router
export { reviewRouter };