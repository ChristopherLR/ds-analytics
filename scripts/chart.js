var util_ctx = document.getElementById("util").getContext("2d");
var cost_ctx = document.getElementById("cost").getContext("2d");
let options = {
  scales: {
    xAxes: [
      {
        gridLines: {
          offsetGridLines: true,
        },
      },
    ],
    yAxes: [{ ticks: { beginAtZero: true, max: 100 } }],
  },
};

let cost_options = {
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
let cost_chart = new Chart(cost_ctx, {
  type: "bar",
  options: cost_options,
  data: {
    labels: [],
    datasets: [
      {
        label: "Server Cost",
        backgroundColor: "rgb(0, 99, 132)",
        borderColor: "rgb(0, 99, 132)",
        data: [],
      },
    ],
  },
});

let util_chart = new Chart(util_ctx, {
  type: "bar",
  options: options,
  data: {
    labels: [],
    datasets: [
      {
        label: "Server Utilisation",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  },
});

// myBarChart.canvas.parentNode.style.height = "500px";
// myBarChart.canvas.parentNode.style.width = "500px";
