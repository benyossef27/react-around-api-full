function handleInvalidDataError(err, res) {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Invalid data' });
  }
}

module.exports = handleInvalidDataError;
