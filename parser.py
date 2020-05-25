#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import multiprocessing.pool
import time
import subprocess
import json
import sys
import os
import xml.etree.ElementTree as et


def start_server(config=None):
    cmd = ['./ds-server']

    if config:
        cmd.extend(['-c', config])

    output = subprocess.run(cmd, stdout=subprocess.PIPE).stdout

    return output.strip().decode()


def get_servers():
    servers = {}
    elements = et.parse('system.xml').getroot()

    for element in elements.findall('servers/server'):
        servers[element.get('type')] = {
            'cores': element.get('coreCount'),
            'memory': element.get('memory'),
            'rate': element.get('rate'),
            'limit': element.get('limit'),
            'bootup_time': element.get('bootupTime'),
            'disk': element.get('disk')
        }

    return servers


def get_jobs_stats():
    jobs = {}
    elements = et.parse('ds-jobs.xml').getroot()

    for element in elements.findall('job'):
        jobs[element.get('id')] = {
            'req_cores': element.get('cores'),
            'req_memory': element.get('memory'),
            'req_disk': element.get('disk')
        }

    return jobs


def parse(input):
    jobs = {}
    jobs_stats = get_jobs_stats()

    for line in input.splitlines():
        if not line.startswith('t:'):
            continue

        parts = line.split()
        server_id_pos = 0
        server_type_pos = 9
        for idx, token in enumerate(parts):
            if '#' in token:
                if len(token) > 1:
                    parts[0] = token[1:]
                else:
                    server_id_pos = idx + 1
            if 'server' in token:
                server_type_pos = idx + 1

        time = int(parts[1])
        job_id = int(parts[3])
        server_id = int(parts[server_id_pos])
        server_type = parts[server_type_pos]

        if job_id in jobs:
            jobs[job_id]['end'] = time
            continue

        stats = jobs_stats[str(job_id)]

        jobs[job_id] = {
            'server_id': server_id,
            'server_type': server_type,
            'start': time,
            'end': None,
            'req_cores': stats['req_cores'],
            'req_memory': stats['req_memory'],
            'req_disk': stats['req_disk']
        }

    return jobs


if __name__ == '__main__':
    args = ()

    if len(sys.argv) == 2:
        if not os.path.isfile(sys.argv[1]):
            sys.exit('ABORTED: Config file "%s" does not exist' % sys.argv[1])

        args = (sys.argv[1],)

    if not os.path.isfile('./ds-server'):
        print("ds-server not in directory")
        sys.exit('ABORTED: ds-server not in the script\'s directory')


    print('Starting server with config {}'.format(args))
    sys.stdout.flush()

    thread_pool = multiprocessing.pool.ThreadPool(processes=1)
    s_thread = thread_pool.apply_async(start_server, args)

    time.sleep(1) # Wait a bit to ensure server has time to start
    print('Waiting for client... \n... (run your client now)')
    sys.stdout.flush()

    s_output = s_thread.get()

    if not s_output:
        print("no output from server")
        sys.exit('ABORTED: no output from server')

    # system.xml and ds-jobs.xml should exist now. Abort if they don't
    if not os.path.isfile('system.xml'):
        sys.exit('ABORTED: system.xml doesn\'t exist')
    elif not os.path.isfile('ds-jobs.xml'):
        sys.exit('ABORTED: ds-jobs.xml doesn\'t exist')

    print('Parsing server output...')

    data = {
        'servers': get_servers(),
        'jobs': parse(s_output)
    }

    print('Writing to JS file...')

    with open('data.json', 'w') as fp:
        fp.write(json.dumps(data))

    print("Parser Done")
