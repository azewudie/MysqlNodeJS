const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyparser = require("body-parser");
let app = express();

const port = 4000;
app.get("", function (req, res) {
  res.send("Hello World");
});
app.use(cors());
//middle ware
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
//optional
// app.use(express.json());
app.listen(port, function (err) {
  if (err) {
    console.log("got error");
  } else {
    console.log(`listing local host http://localhost:${port}`);
  }
});

var mysqlConnection = mysql.createConnection({
  socketPath: "/Applications/MAMp/tmp/mysql/mysql.sock",
  user: "nodeJsMYSql",
  password: "nodeJsMYSql",
  host: "127.0.0.1",
  database: "nodeJsMYSql",
});
mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});
app.get("/tableCreat", (req, resp) => {
  let massage = "table created...";
  // table product
  let tableCreatProduct = `CREATE TABLE if not exists product(
    product_id int AUTO_INCREMENT,
    product_name varchar(255) NOT NULL,
    product_url varchar(255) NOT NULL,
    PRIMARY KEY (product_id)
  )`;

  // table tableCreatDescription

  let tableCreatDescription = `CREATE TABLE if not exists description(
    description_id int AUTO_INCREMENT,
    product_id int not null,
    product_brief_description varchar(255) NOT NULL,
    product_description varchar(255) NOT NULL,
    product_img  varchar(255) NOT NULL,
    product_link VARCHAR(255) NOT NULL,
    PRIMARY KEY (description_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
  )`;

  // table price
  let tableCreatPrice = `CREATE TABLE if not exists price(
    price_id int AUTO_INCREMENT,
    product_id int NOT NULL,
    start_price NUMERIC NOT NULL,
    price_range NUMERIC NOT NULL,
    PRIMARY KEY ( price_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
  )`;

  //user tabel

  let tableCreatUser = `CREATE TABLE if not exists user(
    user_id int AUTO_INCREMENT,
    user_name text NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
  )`;
  // table order
  let tableCreatOrder = `CREATE TABLE if not exists orderId(
    order_id int AUTO_INCREMENT,
    product_id int NOT NULL,
    user_id int NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (user_id ) REFERENCES user(user_id)
  )`;

  mysqlConnection.query(tableCreatProduct, (err, result, fields) => {
    if (err) {
      console.log(err);
    }
  });

  mysqlConnection.query(tableCreatDescription, (err, result, fields) => {
    if (err) {
      console.log(err);
    }
  });
  mysqlConnection.query(tableCreatPrice, (err, result, fields) => {
    if (err) {
      console.log(err);
    }
  });

  mysqlConnection.query(tableCreatUser, (err, result, fields) => {
    if (err) {
      console.log(err);
    }
  });

  mysqlConnection.query(tableCreatOrder, (err, result, fields) => {
    if (err) {
      console.log(err);
    }
  });

  resp.end(massage);
});
//Insert Section
app.post("/addProduct", (req, resp) => {
  console.table(req.body);
  //product section
  let Id = req.body.productId;
  let productName = req.body.productName;
  let url = req.body.productUrl;
  let productDiscretion = req.body.productDiscretion;
  let productBriefDiscretion = req.body.productBriefDiscretion;
  let productImage = req.body.productImage;
  let productLink = req.body.productLink;
  let productStartPrice = req.body.productStartPrice;
  let productPriceRange = req.body.productPriceRange;
  let productUser = req.body.productUser;
  let productUserPassword = req.body.productUserPassword;

  let sqlAddToProduct = `INSERT INTO product(product_url, product_name )
   VALUES('${Id}','${productName}')`;
  mysqlConnection.query(sqlAddToProduct, (err, result, fields) => {
    if (err) {
      console.log(err);
    } else {
      console.log("information recorded ");
    }
  });

  // description section 2
  let addedProductID = 0;

  // addedProductID = row[0].sqlAddToProduct;
  let getMeTheID = `SELECT * FROM product Where product_url = '${Id}'`;

  //creat query for getMeThe ID ......> in order to use as foreign key

  mysqlConnection.query(getMeTheID, (err, result, fields) => {
    console.log(result);

    addedProductID = result[0].product_id;
    // test
    console.log(addedProductID);
    if (err) console.log(err);
    if (addedProductID != 0) {
      let sqlEnterDescription = `INSERT INTO description(product_id, product_brief_description, product_description,product_img, product_link)
      VALUES( '${addedProductID}', '${productBriefDiscretion}','${productDiscretion}', '${productImage}', '${productLink}' )`;

      // write the query for the new table
      mysqlConnection.query(sqlEnterDescription, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          console.log("product description is inserted  ");
        }
      });
    }
  });

  // product price section

  let addedPriceProductID = 0;
  // user id
  let userId = 0;

  // addedProductID = row[0].sqlAddToProduct;
  let getMePriceID = `SELECT * FROM product Where product_url = '${Id}'`;

  //creat query for getMeThe ID ......> in order to use as foreign key

  mysqlConnection.query(getMePriceID, (err, result, fields) => {
    console.log(result);

    addedPriceProductID = result[0].product_id;
    // test
    console.log(addedPriceProductID);
    if (err) console.log(err);
    if (addedPriceProductID != 0) {
      let sqlEnterPriceDescription = `INSERT INTO price(product_id, start_price, price_range)
      VALUES( '${addedPriceProductID}', '${productStartPrice}','${productPriceRange}' )`;

      // write the query for the new table
      mysqlConnection.query(sqlEnterPriceDescription, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          console.log("product price is inserted  ");
        }
      });
    }
  });

  // user insert section
  let sqlAddedUser = `INSERT INTO user(user_name, user_password)
   VALUES('${Id}','${productUserPassword}')`;
  mysqlConnection.query(sqlAddedUser, (err, result, fields) => {
    if (err) {
      console.log(err);
    } else {
      console.log("User information recorded ");
    }
  });

  //order table selection
  let getMeUserId = `SELECT * FROM user Where user_name = '${Id}'`;

  //creat query for getMeThe ID ......> in order to use as foreign key

  mysqlConnection.query(getMeUserId, (err, result, fields) => {
    console.log(result);

    userId = result[0].user_id;
    // test
    console.log(userId);
    if (err) console.log(err);
    if (addedProductID != 0 && userId != 0) {
      let sqlEnterOrderId = `INSERT INTO orderId(product_id, user_id)
      VALUES( '${addedProductID}', '${userId}' )`;

      // write the query for the new table
      mysqlConnection.query(sqlEnterOrderId, (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          console.log("product order ID  is inserted  ");
        }
      });
    }
  });

  resp.end("information send to the DB");
});
