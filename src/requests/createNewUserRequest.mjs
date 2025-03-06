import { z } from "zod";

const createNewUserSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
    .email(),
    first_name: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
    })
    .min(3)
    .max(255),
    last_name: z.string({
          required_error: "Last name is required",
          invalid_type_error: "Last name must be a string",
    })
    .min(3)
    .max(255),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
    .min(8) 
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
});

export default createNewUserSchema;