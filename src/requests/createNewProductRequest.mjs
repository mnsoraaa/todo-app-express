import { z } from 'zod';

const createNewProductSchema = z.object({
    name: z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
    })
    .min(1)
    .max(255),
    price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a string",
    })
    .min(1)
});

export default createNewProductSchema;