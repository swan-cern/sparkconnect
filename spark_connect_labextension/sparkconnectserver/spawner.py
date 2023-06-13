import os
import subprocess
import tempfile
import glob
from enum import Enum

SPARK_HOME = os.getenv('SPARK_HOME')
SPARK_CONNECT_PACKAGE = os.getenv('SPARK_CONNECT_PACKAGE', 'org.apache.spark:spark-connect_2.12:3.4.0')

class SparkConnectCluster:
    class Status(Enum):
        STOPPED = "STOPPED"
        PROVISIONING = "PROVISIONING"
        READY = "READY"

    def __init__(self):
        self.status = SparkConnectCluster.Status.STOPPED
        self.tmpdir = None

    def start(self, options: dict = None, envs: dict = None):
        print("Starting Spark Connect server...")

        self.tmpdir = tempfile.TemporaryDirectory()
        env_variables = self.get_envs(envs)
        env_variables['SPARK_LOG_DIR'] = self.tmpdir.name
        print("Spark log dir", self.tmpdir.name)

        config_args = self.get_config_args(options)
        run_script = f"{SPARK_HOME}/sbin/start-connect-server.sh --packages {SPARK_CONNECT_PACKAGE} {config_args}"
        print(run_script)
        retcode = subprocess.Popen(run_script, shell=True, env=env_variables).wait()
        if retcode != 0:
            raise Exception("Cannot start Spark Connect server")
        
        self.status = SparkConnectCluster.Status.PROVISIONING

    def stop(self):
        if self.tmpdir:
            self.tmpdir.cleanup()
            self.tmpdir = None

        if self.status == SparkConnectCluster.Status.READY:
            print("No running Spark Connect server")
            return

        print("Stopping Spark Connect server...")
        run_script = f"{SPARK_HOME}/sbin/stop-connect-server.sh"
        retcode = subprocess.Popen(run_script, shell=True).wait()
        if retcode != 0:
            raise Exception("Cannot stop Spark Connect server")
        
        self.status = SparkConnectCluster.Status.STOPPED
    
    def get_log(self):
        if not self.tmpdir:
            return None
        
        files = glob.glob(self.tmpdir.name + '/*.out')
        logfile = files[-1]
        with open(logfile, 'r') as f:
            return f.read()
 
    
    def get_envs(self, envs: dict):
        my_env = os.environ.copy()
        if envs:
            for key in envs:
                my_env[key] = envs[key]
        return my_env

    def get_config_args(self, options: dict):
        if not options:
            return []
        
        args = []
        for key in options:
            args.append("--conf")
            val = options[key].replace(' ', '\\ ')
            args.append(key + '=' + val)
        return ' '.join(args)

    
    def __del__(self):
        if self.status != SparkConnectCluster.Status.STOPPED:
            self.stop()
