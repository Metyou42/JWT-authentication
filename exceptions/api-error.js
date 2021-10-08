module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, massage, errors = []) {
        super(massage);
        this.status = status;
        this.errors = errors;
    }

    static Unauthorizederror() {
        return new ApiError(401, 'User is unauthorized');
    }

    static BadRequest(massage, errors = []) {
        return new ApiError(400, massage, errors);
    }
};
