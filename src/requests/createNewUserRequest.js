import { z } from "zod";

const createNewUserSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3)
      .max(255),
    age: z.number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number",
      })
      .int()
      .positive()
});

export default createNewUserSchema;