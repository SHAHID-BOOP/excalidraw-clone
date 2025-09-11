import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUSerSchema,CreateRoomSchema,SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup",async (req,res) => {
    // db call
    
    const parsedData = CreateUSerSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return
    };
    try{
        await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: parsedData.data.password,
                name: parsedData.data?.name  
            }  
        })
        res.json({
            userId: "               "
        });
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    };

});

app.post("/signin", (req,res) => {
    const data = SigninSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return
    }

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
});

app.get("/room", middleware, (req,res) => {
    //db call 
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        });
        return
    };

    res.json({
        roomId: 123
    })
});

app.listen(3001);