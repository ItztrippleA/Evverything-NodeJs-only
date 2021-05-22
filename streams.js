const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //solution 1:
  //   fs.readFile("./txt/test-file.txt", (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.end(data);
  //     }
  //   });

  //solution 2

  //   const readable = fs.createReadStream("./txt/test-file.txt");
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });

  //   //once streaming is done,
  //   readable.on("end", () => {
  //     res.end();
  //   });

  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("file not found");
  //   });

  //solution 3 (solution 3 is as a result od the speed of read is faster than the speed of write hence:)
  const readable = fs.createReadStream("./txt/test-file.txt");
  readable.pipe(res);

  //readablesource.pipe(writableDestination);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening on port 8000");
});
