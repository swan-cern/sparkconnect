from pyspark.sql import SparkSession
from .config import SPARK_CONNECT_PORT

def get_spark_session():
    spark = SparkSession.builder \
          .remote(f"sc://127.0.0.1:{SPARK_CONNECT_PORT}") \
          .getOrCreate()
    return spark


def load_ipython_extension(ipython):
    ipython.push({'get_spark_session': get_spark_session})