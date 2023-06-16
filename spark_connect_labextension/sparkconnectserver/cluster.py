import os
import subprocess
import tempfile
import glob
import socket
from enum import Enum

SPARK_HOME = os.getenv('SPARK_HOME')
SPARK_CONNECT_PACKAGE = os.getenv('SPARK_CONNECT_PACKAGE', 'org.apache.spark:spark-connect_2.12:3.4.0')
SPARK_CONNECT_PORT = int(os.getenv('SPARK_CONNECT_PORT', '15002'))

class ClusterStatus(Enum):
    STOPPED = "STOPPED"
    PROVISIONING = "PROVISIONING"
    READY = "READY"

class _SparkConnectCluster:
    def __init__(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.cluster_name = None

    def start(self, cluster_name: str, options: dict = {}, envs: dict = None):
        print("Starting Spark Connect server...")
        self.cluster_name = cluster_name

        self.tmpdir.cleanup()

        env_variables = self.get_envs(envs)
        env_variables['SPARK_LOG_DIR'] = self.tmpdir.name
        print("Spark log dir", self.tmpdir.name)

        options['spark.connect.grpc.binding.port'] = str(SPARK_CONNECT_PORT)
        options['spark.ui.proxyRedirectUri'] = "/"
        config_args = self.get_config_args(options)
        run_script = f"{SPARK_HOME}/sbin/start-connect-server.sh --packages {SPARK_CONNECT_PACKAGE} {config_args}"
        retcode = subprocess.Popen(run_script, shell=True, env=env_variables).wait()
        if retcode != 0:
            raise Exception("Cannot start Spark Connect server")

    def stop(self):
        print("Stopping Spark Connect server...")
        run_script = f"{SPARK_HOME}/sbin/stop-connect-server.sh"
        retcode = subprocess.Popen(run_script, shell=True).wait()
        if retcode != 0:
            raise Exception("Cannot stop Spark Connect server")
            
    def get_log(self) -> str:
        logfile = self.get_logfile_path()
        if not logfile:
            return None

        with open(logfile, 'r') as f:
            return f.read()
    
    def get_logfile_path(self) -> str:
        files = glob.glob(self.tmpdir.name + '/*.out')
        if len(files) == 0:
            return None
        logfile = files[-1]
        return logfile

    def get_status(self) -> ClusterStatus:
        if not self.is_connect_server_running():
            return ClusterStatus.STOPPED
        if not self.is_server_ready():
            return ClusterStatus.PROVISIONING
        return ClusterStatus.READY
    
    def is_connect_server_running(self) -> bool:
        run_script = f"{SPARK_HOME}/sbin/spark-daemon.sh status org.apache.spark.sql.connect.service.SparkConnectServer 1"
        retcode = subprocess.Popen(run_script, shell=True).wait()
        return retcode == 0

    def is_server_ready(self) -> bool:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('127.0.0.1', SPARK_CONNECT_PORT))
        sock.close()
        return result == 0
 
    def get_envs(self, envs: dict) -> dict:
        my_env = os.environ.copy()
        if envs:
            for key in envs:
                my_env[key] = envs[key]
        return my_env

    def get_config_args(self, options: dict) -> str:
        if not options:
            return []
        
        args = []
        for key in options:
            args.append("--conf")
            val = options[key].replace(' ', '\\ ')
            args.append(key + '=' + val)
        return ' '.join(args)

    
    def __del__(self):
        self.stop()


cluster = _SparkConnectCluster()
