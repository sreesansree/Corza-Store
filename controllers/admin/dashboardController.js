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
    const allOrders = await Order.find({ status: "Delivered" });
    const totalRevenue = allOrders.reduce((totall, order) => totall + Number(order.total), 0);


    // const delivered = await Order.find({ status: 'Delivered' })
    // console.log(delivered,'delivered')


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
    console.log(ordermonth, 8999999)

    const monthNames = ordermonth.map(monthNumber =>
      new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' })
    );
    console.log(monthNames, "monthnamessss")


    // category sales
    const categorysale = await Order.aggregate([
      {
        $lookup: {
          from: "products", // Name of the collection joining with
          localField: "product.id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
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
          as: "category",
        },
      },
      {
        $unwind: "$category",
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
      paymentMethod: "cash-on-delivery",
    });

    const razorpayCount = await Order.countDocuments({
      paymentMethod: "razorpay",
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
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: 1,
            },
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
    // console.log(pipeline, "pipelineeeeeeeee")
    const ordersByMonth = await Order.aggregate(pipeline).exec();
    // console.log(ordersByMonth, 132222)

    const orderCounts = ordersByMonth.map(({ date, count }) => ({
      month: date ? date.toLocaleString("default", { month: "long" }) : null,
      count,
    }));

    // console.log(orderCounts, "OrderCountsssssssssss")
    // console.log(categorysale, "categorysaleeeeeeeeeeee");
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
    const startDate = moment(orderDate, 'YYYY-MM-DD').startOf('day').toDate();
    const endDate = moment(orderDate, 'YYYY-MM-DD').endOf('day').toDate();
    console.log(orderDate, "orderDate");
    console.log(startDate, "startDate");
    console.log(endDate, "endDate");

    dailyorders = await Order.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("address");
    // console.log(dailyorders, "DailyOrdersssss");
    totalOrderBill = dailyorders.reduce(
      (total, order) => total + Number(order.total),
      0
    );
    // console.log(totalOrderBill, "totalOrderBill");
    res.render('dailysales', { dailyorders, totalOrderBill });
  } catch (error) {
    console.log(error.message);
  }
};

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
      orderDate: order.date,
      discount: order.discount,
      totalBill: order.total,
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
    // console.log(monthinput,"Monthhhhh")
    const year = parseInt(monthinput.substring(0, 4));
    const month = parseInt(monthinput.substring(5));

    // console.log(year,"year123",)
    // console.log(month,"month123")

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // console.log(startDate,"startDate")
    // console.log(endDate,"endDate")

    monthlyOrders = await Order.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: 'Delivered' // Filter by status
    })
      .sort({ date: 'desc' });
    totalMonthlyBill = monthlyOrders.reduce(
      (totall, order) => totall + Number(order.total),
      0
    );


    res.render("monthlyOrders", { monthlyOrders, totalMonthlyBill });
  } catch (error) {
    console.log(error.message);
  }
};

const monthlyDownload = async (req, res) => {
  const workbook = new ExcelJS.Workbook
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
      orderDate: order.date,
      discount: order.discount,
      totalBill: order.total,
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

    yearlyorders = orders.filter((order) => {
      const orderYear = new Date(order.date).getFullYear();
      return orderYear === parseInt(year);
    });

    totalYearlyBill = yearlyorders.reduce(
      (total, order) => total + Number(order.total),
      0
    );
    res.render("yearlyOrder", { yearlyorders, totalYearlyBill });
  } catch (error) {
    res.status(500).send({ message: `${error}` });
  }
};

const yearlydownload = async (req, res) => {
  const workbook = new ExcelJS.Workbook;
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
      orderDate: order.date,
      discount: order.discount,
      totalBill: order.total,
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