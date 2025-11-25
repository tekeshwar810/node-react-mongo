const pagination = (page, limit) => {
    let pageSize = Number(limit) || 10;
    let offset = page == 0 ? page * pageSize || 0 : (page - 1) * pageSize || 0;
    return { pageSize: pageSize, offset: offset }
}

module.exports = { pagination }