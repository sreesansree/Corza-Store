const data1 = document.getElementById("razorpay").value;
const data2 = document.getElementById("cashondelivery").value;
console.log(data1, data2, "dataaa");

const ctx2 = document.getElementById("myChart2");

new Chart(ctx2, {
  type: "doughnut",

  data: {
    labels: ["Cash On Delivery", "Razor Pay", "others"],
    datasets: [
      {
        label: "Total Count",
        data: [data2, data1, 0],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  },
});
