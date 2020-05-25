var ctx = document.getElementById("myChart").getContext("2d");
let options = {
  scales: {
    xAxes: [
      {
        gridLines: {
          offsetGridLines: true,
        },
      },
    ],
  },
};

let data = {
  datasets: [
    {
      barPercentage: 0.5,
      barThickness: 6,
      maxBarThickness: 8,
      minBarLength: 2,
      data: [10, 20, 30, 40, 50, 60, 70],
    },
  ],
};
console.log(SERVERS);
var myBarChart = new Chart(ctx, {
  type: "bar",
  options: options,
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  },
});

myBarChart.canvas.parentNode.style.height = "500px";
myBarChart.canvas.parentNode.style.width = "500px";
