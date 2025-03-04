class HttpError extends Error {
    private code: number;
    constructor(message: string, errorCode: number) {
        super(message); // Add a "message" property
        this.code = errorCode; // Adds a "code" property
    }
}

export { HttpError };