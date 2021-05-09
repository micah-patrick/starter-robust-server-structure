const counts = require("../data/counts-data");


function countExists(req, res, next){
    const { countId } = req.params;
    const foundCount = counts[countId];
    //check if the countId exists
    if (foundCount === undefined) {
      next({
        status: 404,
        message: `Count id not found: ${countId}`,
      });
    } else {
        res.locals.count = foundCount;
        return next();
    }
}

function list(req, res) {
    res.json({ data: counts });
}

//get the count of a specific result (heads,tails, edge)
function read(req, res, next){
    res.json({ data: res.locals.count })
  };

module.exports = {
    list,
    read: [countExists, read],
    countExists,
};