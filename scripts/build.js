let SERVERS = undefined;
let JOBS = undefined;

d3.json("data.json").then((json) => {
  console.log(json);
  SERVERS = json.servers;
  JOBS = $.map(json.jobs, function (value, index) {
    value.key = index;
    return value;
  }).sort(function (a, b) {
    return a.start - b.start;
  });

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
});

function build_t_buttons() {
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

  console.log(servers);
  $("#servers").empty();

  let keys = Object.keys(servers);
  keys.map((server) => {
    let jobs = servers[server];
    console.log(jobs);
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

    console.log(server, SERVERS);
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
