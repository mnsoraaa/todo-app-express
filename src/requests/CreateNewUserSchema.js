import { z } from "zod";

const createNewUserSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3)
      .max(255)
});

export default createNewUserSchema;