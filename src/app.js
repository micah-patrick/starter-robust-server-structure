const express = require("express");
const app = express();
const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./counts/counts.router");

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");
app.use(express.json());

//get the count of a specific result (heads,tails, edge)
app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  //check if the countId exists
  if (foundCount === undefined) {
    next({
      status: 404,
      message: `Count id not found: ${countId}`,
    });
  } else {
    res.json({ data: foundCount });
  }
});

//get the counts data
app.use("/counts", countsRouter);

//get the results of all the flips
app.use("/flips", flipsRouter); 





///////////////////////////////////////////
///////////////////////////////////////////
// Not found handler
app.use((request, response, next) => {
  next({
    status: 404,
    message: `Not found: ${request.originalUrl}`,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
