/** Structured errors: never expose stack traces or database secrets to customers. */
export function notFound(req, res) {
    res.status(404).json({ message: 'Route not found' });
}
export function errorHandler(error, req, res, next) {
    const status = error.status || (['CastError', 'ValidationError', 'MulterError'].includes(error.name) ? 400 : error.code === 11000 ? 409 : 500);
    if (status >= 500)
        console.error(error);
    const message = error.code === 11000 ? 'Record already exists' : status === 500 ? 'Internal server error' : error.message || 'Something went wrong';
    res.status(status).json({ message });
}
