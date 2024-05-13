export const convertError = (error) => {
    return {
        cause: error.cause,
        stack: error.stack,
        lineNumber: error.lineNumber,
        fileName: error.fileName,
        name: error.name,
        message: error.message,
    };
};