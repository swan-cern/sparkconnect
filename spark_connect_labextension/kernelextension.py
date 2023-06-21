from pyspark.sql import SparkSession
from .config import SPARK_CONNECT_PORT


def load_ipython_extension(ipython):
    ipython._spark_conect_labextension__session = None

    def get_spark_session():
        if not ipython._spark_conect_labextension__session:
            ipython._spark_conect_labextension__session = SparkSession.builder \
                .remote(f"sc://127.0.0.1:{SPARK_CONNECT_PORT}") \
                .getOrCreate()
        return ipython._spark_conect_labextension__session

    def reset_spark_session():
        ipython._spark_conect_labextension__session = None
        return get_spark_session()
    
    ipython.push({
        'get_spark_session': get_spark_session,
        'reset_spark_session': reset_spark_session
    })