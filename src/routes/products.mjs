import { Router } from "express";
import createNewProductRequest from "../requests/createNewProductRequest.mjs";

const router = Router();

let products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
];

// Get all products
router.get('/api/products', (request, response) => {
    const { query: { filter, value } } = request;

    if (filter && value) {
        let filteredProducts = products.filter((product) => product[filter].includes(value));

        return response.send(filteredProducts);
    }

    return response.send(products); 
});

// Get product by id
router.get('/api/products/:id', (request, response) => {
    let product = products.find((product) => product.id == request.params.id);

    if (! product) return response.status(404).send({"message": "Product not found"});

    return response.send(product);
});

// Create a new product
router.post('/api/products', (request, response) => {
    try {
        const validateCreateProductBody = createNewProductRequest.parse(request.body);

        products.push({ id: products.length + 1, ...validateCreateProductBody });
    
        return response.send(products);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({ "message": error.errors[0].message });
        }

        console.log(error);
    }   
    return response.status(503).json({ "message": "Service unavailable" });
});

// Update a product
router.put('/api/products/:id', (request, response) => {
    const { body } = request;

    let product = products.find((product) => product.id == request.params.id);

    if (! product) return response.status(404).send({"message": "Product not found"});

    product = { ...product, ...body };

    return response.send(product);
});

// Delete a product
router.delete('/api/products/:id', (request, response) => {
    products = products.filter((product) => product.id != request.params.id);

    return response.send(products);
});

export default router;
