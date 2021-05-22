const fs = require("fs");
const http = require("http");
const url = require("url");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  `utf-8`
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  `utf-8`
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  `utf-8`
);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, `not-organic`);

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  // parsing the url returns an object with the query parameter and pathname
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join(" ");

    const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
    res.end(output);
    //PRODUCTS PAGE
  } else if (pathname === "/products") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const products = dataObject[query.id];
    const output = replaceTemplate(tempProduct, products);
    res.end(output);

    //API PAGE
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    //NOT FOUND PAGE
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listenning on the sever");
});
