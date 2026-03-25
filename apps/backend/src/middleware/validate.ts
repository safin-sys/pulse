import { ZodObject } from "zod";
import { zValidator } from "@hono/zod-validator";
import response from "../utils/response";
import { ValidationTargets } from "hono";

export const validate = <T extends ZodObject>(
    type: keyof ValidationTargets,
    schema: T
) =>
    zValidator(type, schema, (result, c) => {
        if (!result.success) {
            return response(c, {
                success: false,
                message: "Invalid data received",
                data: null,
                error: result.error.issues[0].message,
                code: 400,
            });
        }
    });
