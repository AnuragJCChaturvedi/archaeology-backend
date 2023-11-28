class CustomError extends Error {
  constructor(msg, code, suppress = false) {
    super(msg);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    this.suppress = suppress;
    this.status = code;
  }
}

const errCodeWithMsg = ({ code, msg }) => {
  throw new CustomError(msg, code);
};

module.exports = {
  CustomError,
  errCodeWithMsg,
};
