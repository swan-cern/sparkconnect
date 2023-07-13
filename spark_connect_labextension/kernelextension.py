from pyspark.sql import SparkSession
from ipykernel.comm import Comm
from .config import SPARK_CONNECT_PORT, EXTENSION_ID

FRONTEND_COMM_NAME = f"{EXTENSION_ID}:comm:frontend"

spark_session = None

def attach_config():
    frontend_comm = Comm(target_name=FRONTEND_COMM_NAME)
    frontend_comm.send(data={'action': 'attach-config-to-notebook'})
    print("Spark configuration is attached to the notebook!")

def get_spark_session():
    attach_config()
    global spark_session
    if not spark_session:
        spark_session = SparkSession.builder \
            .remote(f"sc://127.0.0.1:{SPARK_CONNECT_PORT}") \
            .getOrCreate()
    return spark_session

def reset_spark_session():
    global spark_session
    spark_session = None
    return get_spark_session()

def load_ipython_extension(ipython):
    ipython.push({
        'attach_config': attach_config,
        'get_spark_session': get_spark_session,
        'reset_spark_session': reset_spark_session
    })