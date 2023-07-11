const Admin = require('../../model/adminModel');
const User = require('../../model/userModel');
const Product = require('../../model/productModel');
const Category = require('../../model/categoryModel');
const moment = require('moment');
const Order = require('../../model/orderModel');
// const PDFDocument = require('pdfkit');
const hbs = require('hbs');
const ExcelJS = require('exceljs');
const { log } = require('handlebars/runtime');


let dailyorders;
let totalOrderBill;
let monthlyOrders;
let totalMonthlyBill;
let yearlyorders;
let totalYearlyBill;



hbs.registerHelper("json", function (context) {
  return JSON.stringify(context);
});


// const loadDashboard = async (req, res) => {
//     try {

//         res.render('dashboard')
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadDashboard = async (req, res) => {
  try {
    const users = await User.find({}).count();
    const products = await Product.find({}).count();
    const orders = await Order.find({}).count();
    const allOrders = await Order.find({ status: "delivered" });
    const totalRevenue = allOrders.reduce((total, order) => total + Number(order.orderBill), 0);

    const orderdata = await Order.aggregate([
      {
        $sort: {
          "date": 1,
        }
      },
      {
        $group: {
          _id: {
            $month: "$date"
          },
          orders: {
            $push: "$$ROOT"
          }
        }
      },

      {
        $project: {
          _id: 0,
          month: "$_id",
          orders: 1
        }
      },
      {
        $sort: {
          "month": 1
        }
      }
    ])

// console.log(orderdata,75555)

const ordersnum = []

    orderdata.forEach(element => {
      const num = element.orders.length
      ordersnum.push(num)
    });

    const ordermonth = []
    orderdata.forEach(element => {
      const num = element.month
      ordermonth.push(num)
    });
console.log(ordermonth,8999999)
const monthNames = ordermonth.map(monthNumber =>
  new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' })
);  
    // category sales
    const categorysale = await Order.aggregate([
      {
        $lookup: {
          from: "addresses", // Name of the collection joining with
          localField: "address",
          foreignField: "_id",
          as: "address", // Name of the array field where the joined documents will be stored
        },
      },
      {
        $unwind: "$items", // Deconstruct the items array
      },
      {
        $lookup: {
          from: "products", // Name of the collection joining with
          localField: "items.product",
          foreignField: "_id",
          as: "product", // Name of the array field where the joined documents will be stored
        },
      },
      {
        $unwind: "$product", // Deconstruct the product array
      },
      {
        $group: {
          _id: "$product.category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories", // Name of the collection joining with
          localField: "_id",
          foreignField: "_id",
          as: "category", // Name of the array field where the joined documents will be stored
        },
      },
      {
        $unwind: "$category", // Deconstruct the category array
      },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          count: 1,
        },
      },
    ]).exec();

    const cashOnDeliveryCount = await Order.countDocuments({
      paymentMode: "cashondelivery",
    });
    const razorpayCount = await Order.countDocuments({
      paymentMode: "razorapay",
    });

    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $ifNull: [
              {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1,
                },
              },
              Order.date // Provide a default date value, such as the epoch date (January 1, 1970)
            ],
          },
          count: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ];

    const ordersByMonth = await Order.aggregate(pipeline).exec();
    console.log(ordersByMonth, 132222)

    // const monthNames = ordermonth.map(monthNumber =>
    //   new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' })
    // );

    const orderCounts = ordersByMonth.map(({ date, count }) => ({
      month: date ? date.toLocaleString("default", { month: "long" }) : null,
      count,
    }));

    console.log(orderCounts, "OrderCountsssssssssss")
    console.log(categorysale, "categorysaleeeeeeeeeeee");
    res.render('dashboard', {
      categorysale,
      cashOnDeliveryCount,
      razorpayCount,
      orderCounts,
      users,
      products,
      orders,
      totalRevenue,
      monthNames,
      ordersnum
    });
  } catch (error) {
    console.log(error.message);
  }
};
const dailySales = async (req, res) => {
  try {
    const orderDate = req.body.daily;
    const oDate = moment(orderDate).format('DD-MM-YYYY');
    dailyorders = await Order.find({ orderDate: oDate }).populate("address");
    totalOrderBill = dailyorders.reduce(
      (total, order) => total + Number(order.orderBill),
      0
    );
    res.render('dailysales', { dailyorders, totalOrderBill })
  } catch (error) {
    console.log(error.meassage)
  }
}

const dailyDownload = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Data");
  worksheet.columns = [
    { header: "Order ID", key: "orderId", width: 10 },
    { header: "Delivery Name", key: "deliveryName", width: 20 },
    { header: "Order Date", key: "orderDate", width: 15 },
    { header: "Discount", key: "discount", width: 10 },
    { header: "Total Bill", key: "totalBill", width: 10 },
    { header: "totalOrders", key: "totalOrders", width: 10 },
    { header: "totalRevenue", key: "totalRevenue", width: 20 },
  ];

  dailyorders.forEach((order) => {
    worksheet.addRow({
      orderId: order.orderId,
      deliveryName: order.address.name,
      orderDate: order.orderDate,
      discount: order.discount,
      totalBill: order.orderBill,
    });
  });
  worksheet.addRow({
    totalOrders: dailyorders.length,
    totalRevenue: totalOrderBill,
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "SalesData.xlsx"
  );

  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((err) => {

      res.status(500).send("An error occurred while generating the Excel file");
    });
};

const monthlysales = async (req, res) => {
  try {
    const monthinput = req.body.month;
    const year = parseInt(monthinput.substring(0, 4));
    const month = parseInt(monthinput.substring(5));
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    monthlyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $sort: {
          orderDate: 1, // Sort the documents by order date in ascending order
        },
      },
    ]);

    totalMonthlyBill = monthlyOrders.reduce(
      (total, order) => total + Number(order.orderBill),
      0
    );

    res.render("monthlyOrders", { monthlyOrders, totalMonthlyBill });
  } catch (error) {
    console.log(error.message);
  }
};

const monthlyDownload = async (req, res) => {
  const workbook = new ExcelJS.workbook();
  const worksheet = workbook.addWorksheet('Sales Data');
  // Add headers to the worksheet
  worksheet.columns = [
    { header: "Order ID", key: "orderId", width: 10 },
    { header: "Order Date", key: "orderDate", width: 15 },
    { header: "Discount", key: "discount", width: 10 },
    { header: "Total Bill", key: "totalBill", width: 10 },
    { header: "totalOrders", key: "totalOrders", width: 10 },
    { header: "totalRevenue", key: "totalRevenue", width: 20 },
  ];

  monthlyOrders.forEach((order) => {
    worksheet.addRow({
      orderId: order.orderId,
      orderDate: order.orderDate,
      discount: order.discount,
      totalBill: order.orderBill,
    })
  })
  worksheet.addRow({
    totalOrders: monthlyOrders.length,
    totalRevenue: totalMonthlyBill,
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "SalesData.xlsx"
  );
  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      res.status(500).send("An error occurred while generating the Excel file");
    });
};

const yearlysales = async (req, res) => {
  try {
    const orders = await Order.find();
    const year = req.body.yearly;
    yearlyorders = orders.filter(
      (order) => order.createdAt.getFullYear() === parseInt(year)
    );
    totalYearlyBill = yearlyorders.reduce(
      (total, order) => total + Number(order.orderBill),
      0
    );
    res.render("yearlyOrder", { yearlyorders, totalYearlyBill });
  } catch (error) {
    res.status(500).send({ message: `${error}` })
  }
};


const yearlydownload = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Data");

  // Add headers to the worksheet
  worksheet.columns = [
    { header: "Order ID", key: "orderId", width: 10 },
    { header: "Order Date", key: "orderDate", width: 15 },
    { header: "Discount", key: "discount", width: 10 },
    { header: "Total Bill", key: "totalBill", width: 10 },
    { header: "totalOrders", key: "totalOrders", width: 10 },
    { header: "totalRevenue", key: "totalRevenue", width: 20 },
  ];

  yearlyorders.forEach((order) => {
    worksheet.addRow({
      orderId: order.orderId,
      orderDate: order.orderDate,
      discount: order.discount,
      totalBill: order.orderBill,
    });
  });
  worksheet.addRow({
    totalOrders: yearlyorders.length,
    totalRevenue: totalYearlyBill,
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "SalesData.xlsx"
  );

  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((err) => {

      res.status(500).send("An error occurred while generating the Excel file");
    });
};



module.exports = {
  loadDashboard,
  dailySales,
  dailyDownload,
  monthlysales,
  monthlyDownload,
  yearlysales,
  yearlydownload

}