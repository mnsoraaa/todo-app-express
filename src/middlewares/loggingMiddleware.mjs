// middleware for loggin
const loggingMiddleware = (request, response, next) => {
    console.log(request.method + "-" + request.path);
    next();
}

export default loggingMiddleware;