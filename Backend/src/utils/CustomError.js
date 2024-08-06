class CustomError extends Error {
  constructor(errorCode) {
    super(errorCode.message);
    this.code = errorCode.code;
    this.statusCode = errorCode.statusCode;
  }
}

export default CustomError;
