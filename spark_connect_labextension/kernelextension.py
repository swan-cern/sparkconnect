from pyspark.sql import SparkSession
from .config import SPARK_CONNECT_PORT

spark_session = None

def get_spark_session():
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
        'get_spark_session': get_spark_session,
        'reset_spark_session': reset_spark_session
    })