import os
import subprocess

SPARK_HOME = os.getenv('SPARK_HOME')
SPARK_CONNECT_PACKAGE = os.getenv('SPARK_CONNECT_PACKAGE', 'org.apache.spark:spark-connect_2.12:3.4.0')

class SparkConnectCluster:
    def __init__(self):
        self.running = False

    def start(self):
        print("Starting Spark Connect server...")
        run_script = f"{SPARK_HOME}/sbin/start-connect-server.sh --packages {SPARK_CONNECT_PACKAGE}"
        retcode = subprocess.Popen(run_script, shell=True).wait()
        if retcode != 0:
            raise Exception("Cannot start Spark Connect server")
        
        self.running = True
        
    
    def stop(self):
        if self.running:
            print("No running Spark Connect server")
            return

        print("Stopping Spark Connect server...")
        run_script = f"{SPARK_HOME}/sbin/stop-connect-server.sh"
        retcode = subprocess.Popen(run_script, shell=True).wait()
        if retcode != 0:
            raise Exception("Cannot stop Spark Connect server")
        
        self.running = False
    
    def __del__(self):
        if self.running:
            self.stop()
    
    