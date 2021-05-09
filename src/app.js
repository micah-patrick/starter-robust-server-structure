const express = require("express");
const app = express();

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");
app.use(express.json())

//get the count of a specific result (heads,tails, edge)
app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  //check if the countId exists
  if (foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount });
  }
});

//get the counts data
app.use("/counts", (req, res) => {
  res.json({ data: counts });
});

// get the results of a specific flip
app.use("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next(`Flip id not found: ${flipId}`);
  }
});

//get the results of all the flips
app.get("/flips", (req, res) => {
  res.json({ data: flips });
});

// Variable to hold the next id.
// Since some ID's may already be used, you find the largest assigned id.
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

// post new flip results
app.post("/flips", (req, res, next) => {
  const { data: { result } = {} } = req.body;
  if (result){
    const newFlip = {
      id: ++lastFlipId, // Increment last id then assign as the current ID
      result,
    };
    flips.push(newFlip);
    counts[result] = counts[result] + 1; // Increment the counts
    res.status(201).json({ data: newFlip });
  } else {
    res.sendStatus(400);
  }
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
}); 

module.exports = app;
