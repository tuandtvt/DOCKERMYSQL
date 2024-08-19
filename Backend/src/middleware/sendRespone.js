const sendResponse = (res, result) => {
    const status = result.errCode === 0 ? 200 : 400;
    res.status(status).json(result);
};

export default sendResponse;