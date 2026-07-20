export const testController = (req, res) => {
  console.log(req.body);

  res.send("Data received");
};