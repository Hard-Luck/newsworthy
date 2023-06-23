"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle500s = exports.handleCustomErrors = void 0;
const handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg || 'Bad request' });
    }
    else {
        next(err);
    }
};
exports.handleCustomErrors = handleCustomErrors;
const handle500s = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};
exports.handle500s = handle500s;
