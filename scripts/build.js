let SERVERS = undefined;
let json = undefined;
let JOBS = undefined;
async function init() {
  await d3
    .json("data.json")
    .then((data) => {
      SERVERS = data.servers;
      JOBS = $.map(data.jobs, function (value, index) {
        value.key = index;
        return value;
      }).sort(function (a, b) {
        return a.start - b.start;
      });
      json = data;
      console.log(SERVERS);
      console.log(data.jobs);
    })
    .catch((err) => console.log(err));
  await init_page();
}

async function init_page() {
  $(document).ready(function () {
    build_t_buttons();
    build_servers(JOBS[0].start);

    $(".t").on("click", function () {
      build_servers(parseInt($(this).text()));
    });

    $(document).delegate(".server-jobs", "click", function () {
      $(this).find(".job-stats").toggle("hide");
    });
  });
}

// INITIALISING the servers and jobs
init();
function build_t_buttons() {
  $("#times").empty();
  let times = [];

  for (let job in JOBS) {
    times.push(JOBS[job].start);
    times.push(JOBS[job].end);
  }

  /* Sort in ascending order, remove duplicates */
  times.sort(function (a, b) {
    return a - b;
  });
  times = [...new Set(times)];

  for (const time of times) {
    $("#times").append(`<button class="t">${time}</button>`);
  }
}

function run_simulation(t) {
  build_chart(t);

  $("#update").empty();
  let servers = {};
  let update = "";
  JOBS.map((job) => {
    let start = job.start;
    let end = job.end;
    if (start > t || end < t) return;
    let server_type = job.server_type;
    let server_id = job.server_id;
    let key = `${server_type} (#${server_id})`;

    if (!servers[key]) servers[key] = [];

    servers[key].push({
      id: job,
      req_cores: job.req_cores,
      req_memory: job.req_memory,
      req_disk: job.req_disk,
    });
    if (start === t) {
      update = `job ${job} started on server ${server_type} (#${server_id})`;
    } else if (end === t) {
      update = `job ${job} finished, removed from server ${server_type} (#${server_id})`;
    }
  });

  $("#update").html(`<strong>At t = ${t}</strong>: <i>${update}</i>`);
  return servers;
}

function build_chart(t) {
  let keys = Object.keys(SERVERS);
  let avg_util = {};
  let current_jobs = [];
  let active_servers = [];
  keys.map((key) => {
    avg_util[key] = {};
    avg_util[key]["avg"] = 0.0;
    avg_util[key]["total"] = 0.0;
    avg_util[key]["total_boot"] = 0.0;
    for (let i = 0; i < parseInt(SERVERS[key].limit); i++) {
      avg_util[key][i] = {
        bootup: false,
        bootup_time: 0,
        util: 0,
      };
    }
  });
  JOBS.map((job) => {
    if (t >= job.start) {
      current_jobs.push(job);
    }
  });
  current_jobs.map((job) => {
    if (avg_util[job.server_type][job.server_id]["bootup"]) {
      if (t > job.end) {
        avg_util[job.server_type][job.server_id]["util"] += job.end - job.start;
      } else {
        avg_util[job.server_type][job.server_id]["util"] += t - job.start;
      }
      /*console.log(
        `${job.server_type}${job.server_id}:${t} - ${job.start}: ${
          t - job.start
        }`
      );*/
    } else {
      avg_util[job.server_type][job.server_id]["bootup_time"] = job.start;
      avg_util[job.server_type][job.server_id]["bootup"] = true;
      if (t > job.end) {
        avg_util[job.server_type][job.server_id].util = job.end - job.start;
      } else {
        avg_util[job.server_type][job.server_id].util = t - job.start;
      }
      /*console.log(
        job.server_id + `adding:${t} - ${job.start}: ${t - job.start}`
      );*/
    }
  });

  keys.map((key) => {
    let count = 0;
    Object.keys(avg_util[key]).map((s_k) => {
      if (avg_util[key][s_k].bootup) {
        count += 1;
        avg_util[key].total += avg_util[key][s_k].util;
        avg_util[key].total_boot += t - avg_util[key][s_k].bootup_time;
      }
    });
    avg_util[key].avg = (avg_util[key].total / avg_util[key].total_boot) * 100;
  });

  util_chart.data.labels = [];
  cost_chart.data.labels = [];
  util_chart.data.datasets[0].data = [];
  cost_chart.data.datasets[0].data = [];
  keys.map((server) => {
    util_chart.data.labels.push(server);
    cost_chart.data.labels.push(server);
    cost_chart.data.datasets.forEach((dataset) => {
      dataset.data.push(
        (avg_util[server].total_boot / 60 / 60) *
          parseFloat(SERVERS[server].rate)
      );
    });
    util_chart.data.datasets.forEach((dataset) => {
      dataset.data.push(avg_util[server].avg);
    });
  });
  util_chart.update();
  cost_chart.update();
}

function get_jobs_usage(jobs) {
  let total_cores = 0;
  let total_memory = 0;
  let total_disk = 0;

  for (let job of jobs) {
    total_cores += parseInt(job.req_cores);
    total_memory += parseInt(job.req_memory);
    total_disk += parseInt(job.req_disk);
  }

  return {
    cores: total_cores,
    memory: total_memory,
    disk: total_disk,
  };
}

function build_servers(t) {
  let servers = run_simulation(t);
  $("#servers").empty();

  let keys = Object.keys(servers);
  keys.map((server) => {
    let jobs = servers[server];
    let jobs_html = "";
    if (jobs.length !== 0) {
      for (let job of jobs) {
        jobs_html += `
                            <li>
                                <strong>job ${job.id.key}</strong>
                                <ul class="job-stats" style="display:none">
                                    <li>C: ${job.req_cores}</li>
                                    <li>M: ${job.req_memory}</li>
                                    <li>D: ${job.req_disk}</li>
                                </ul>
                            </li>
                        `;
      }
    } else {
      jobs_html = "<i>No running jobs</i>";
    }

    let stats = SERVERS[server.split(" ")[0]];
    let usage = get_jobs_usage(jobs);

    /* O LAWD HE COMIN */
    $("#servers").append(`<div class="server">
                        <strong class="server-header">${server}</strong>
                        <div class="server-stats">
                            <div class="server-stat" title="${Math.round(
                              (usage.cores / stats.cores) * 100
                            )}% cores used">
                                <span>C: ${usage.cores}/${stats.cores}</span>
                                <progress value="${usage.cores}" max="${
      stats.cores
    }"></progress>
                            </div>
                            <div class="server-stat" title="${Math.round(
                              (usage.memory / stats.memory) * 100
                            )}% memory used">
                                <span>M: ${usage.memory}/${stats.memory}</span>
                                <progress value="${usage.memory}" max="${
      stats.memory
    }"></progress>
                            </div>
                            <div class="server-stat" title="${Math.round(
                              (usage.disk / stats.disk) * 100
                            )}% disk used">
                                <span>D: ${usage.disk}/${stats.disk}</span>
                                <progress value="${usage.disk}" max="${
      stats.disk
    }"></progress>
                            </div>
                        </div>
                        <hr>
                        <ul class="server-jobs">
                            ${jobs_html}
                        </ul>
                    </div>`);
  });
}
