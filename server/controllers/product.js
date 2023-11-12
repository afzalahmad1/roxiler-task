import fetch from "node-fetch";
import { Product } from "../models/Product.js";
const initializeDB = async (req, res) => {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await response.json();
    // console.log(data);
    data.forEach(async (product) => {
      const prodObj = new Product(product);
      await prodObj.save();
    });
    res.send("Database initialized!");
  } catch (error) {
    console.log(error);
    res.send({
      message: "server error",
      error: error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    // console.log(page);
    const perPage = 10;

    // Pagination
    const products = await Product.find({})
      .skip(perPage * (page - 1))
      .limit(perPage);

    // Send the response
    res.send(products);
  } catch (error) {
    res.send(error);
  }
};

const getProductByMonth = async (req, res) => {
  console.log("param", req.params.month);
  if (req.params.month === "") {
    return res.status(200).send({ products: [] });
  }
  const month = parseInt(req.params.month);
  console.log(typeof month);
  console.log(month);

  // Get the total sale amount of the selected month
  const products = await Product.aggregate([
    {
      $project: {
        month: { $month: "$dateOfSale" },
        year: { $year: "$dateOfSale" },
        id: 1,
        price: 1,
        sold: 1,
        title: 1,
        description: 1,
        catagory: 1,
        image: 1,
      },
    },
    {
      $match: { month: month },
    },
    // { $group: { _id: null, totalSaleAmount: { $sum: '$price' } } }
  ]);

  //   Send the response
  res.send({
    products,
  });
};

const barChart = async (req, res) => {
  const month = parseInt(req.params.month);
  try {
    const chartData = await Product.aggregate([
      { $project: { month: { $month: "$dateOfSale" }, price: 1 } },
      { $match: { month: month } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0,101,201,301,401,501,601,701,801],
          default: 901,
          output: {
            count: { $sum: 1 },
          },
          
        },
      },
    ]);

    res.send({ chartData });
  } catch (error) {
    console.log(error);
  }
};

export { initializeDB, getAllProducts, getProductByMonth, barChart };
