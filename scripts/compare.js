var server_ctx = document.getElementById("server-com").getContext("2d");
var utils_ctx = document.getElementById("utils-com").getContext("2d");
var cost_ctx = document.getElementById("cost-com").getContext("2d");
var wait_ctx = document.getElementById("wait-com").getContext("2d");
var exec_ctx = document.getElementById("exec-com").getContext("2d");
var turn_ctx = document.getElementById("turn-com").getContext("2d");
/* const labels = [
  "Servers Used",
  "Average Utilisation",
  "Total Cost",
  "Avg Waiting Time",
  "Avg Exec Time",
  "Avg Turnaround",
];*/

const labels = [
  "Config 1",
  "Config 2",
  "Config 3",
  "Config 4",
  "Config 5",
  "Config 6",
];

const algos = {
  bf: {
    servers: [26, 42, 41, 29, 53, 6],
    util: [51.17, 24.02, 27.19, 28.25, 17.73, 29.83],
    cost: [249.43, 9742.78, 23416.02, 1192.84, 2340.77, 821.04],
    wait: [22, 4, 88646, 3, 3194, 255816],
    exec: [6140, 19578, 64273, 3054, 1353, 4751],
    turnaround: [6162, 19583, 152919, 3057, 4547, 260567],
  },
  ff: {
    servers: [32, 51, 65, 39, 75, 6],
    util: [20.54, 26.35, 30.94, 32.06, 30.21, 37.65],
    cost: [389.26, 10258.19, 24723.36, 1335.47, 2057.34, 787.8],
    wait: [23, 5, 64893, 3, 1415, 51418],
    exec: [5691, 19286, 60609, 3005, 1325, 4751],
    turnaround: [5714, 19291, 125502, 3009, 2741, 56170],
  },
  wf: {
    servers: [20, 20, 22, 20, 25, 5],
    util: [36.61, 56.51, 15.47, 55.57, 17.86, 36.17],
    cost: [357.49, 7856.17, 59083.64, 1413.98, 4289.39, 784.68],
    wait: [17, 11949, 354559, 35, 16419, 58963],
    exec: [6666, 20333, 67503, 3100, 1390, 4760],
    turnaround: [6683, 32282, 422062, 3136, 17809, 63724],
  },
  mf: {
    servers: [29, 45, 45, 34, 55, 6],
    util: [22.63, 25.52, 32.14, 27.58, 22.18, 36.56],
    cost: [371.04, 9694.45, 23200.63, 1291.66, 2221.37, 799.22],
    wait: [22, 4, 77829, 3, 2348, 48270],
    exec: [5907, 19480, 63631, 3029, 1350, 4751],
    turnaround: [5929, 19484, 141461, 3033, 3699, 53022],
  },
};

let options = (title) => {
  return {
    title: {
      display: true,
      text: title,
    },
    responsive: true,
    hover: {
      animationDuration: 0,
    },
    animation: {
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(
          Chart.defaults.global.defaultFontFamily,
          "normal",
          Chart.defaults.global.defaultFontFamily
        );
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            for (var key in dataset._meta) {
              var model = dataset._meta[key].data[i]._model;
              ctx.fillText(dataset.data[i], model.x, model.y - 5);
            }
          }
        });
      },
    },
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
};
const data_ingest = (label, color, data) => {
  return {
    label: label,
    backgroundColor: color,
    data: data,
  };
};

let server_chart = new Chart(server_ctx, {
  type: "bar",
  options: options("Servers Used"),
  data: {
    labels: labels,
    datasets: [
      data_ingest("wf", "#355c7d", algos.wf.servers),
      data_ingest("bf", "#6C5B7B", algos.bf.servers),
      data_ingest("ff", "#C06C84", algos.ff.servers),
      data_ingest("mf", "#F67280", algos.mf.servers),
    ],
  },
});
let utils_chart = new Chart(utils_ctx, {
  type: "bar",
  options: options("Average Utilisation"),
  data: {
    labels: labels,
    datasets: [
      data_ingest("wf", "#355c7d", algos.wf.util),
      data_ingest("bf", "#6C5B7B", algos.bf.util),
      data_ingest("ff", "#C06C84", algos.ff.util),
      data_ingest("mf", "#F67280", algos.mf.util),
    ],
  },
});
let cost_chart = new Chart(cost_ctx, {
  type: "bar",
  options: options("Cost"),
  data: {
    labels: labels,
    datasets: [
      data_ingest("wf", "#355c7d", algos.wf.cost),
      data_ingest("bf", "#6C5B7B", algos.bf.cost),
      data_ingest("ff", "#C06C84", algos.ff.cost),
      data_ingest("mf", "#F67280", algos.mf.cost),
    ],
  },
});
let wait_chart = new Chart(wait_ctx, {
  type: "bar",
  options: options("Average Wait Time"),
  data: {
    labels: labels,
    datasets: [
      data_ingest("wf", "#355c7d", algos.wf.wait),
      data_ingest("bf", "#6C5B7B", algos.bf.wait),
      data_ingest("ff", "#C06C84", algos.ff.wait),
      data_ingest("mf", "#F67280", algos.mf.wait),
    ],
  },
});
let exec_chart = new Chart(exec_ctx, {
  type: "bar",
  options: options("Average Execution Time"),
  data: {
    labels: labels,
    datasets: [
      data_ingest("wf", "#355c7d", algos.wf.exec),
      data_ingest("bf", "#6C5B7B", algos.bf.exec),
      data_ingest("ff", "#C06C84", algos.ff.exec),
      data_ingest("mf", "#F67280", algos.mf.exec),
    ],
  },
});
let turn_chart = new Chart(turn_ctx, {
  type: "bar",
  options: options("Average Turnaround"),
  data: {
    labels: labels,
    datasets: [
      data_ingest("wf", "#355c7d", algos.wf.turnaround),
      data_ingest("bf", "#6C5B7B", algos.bf.turnaround),
      data_ingest("ff", "#C06C84", algos.ff.turnaround),
      data_ingest("mf", "#F67280", algos.mf.turnaround),
    ],
  },
});
