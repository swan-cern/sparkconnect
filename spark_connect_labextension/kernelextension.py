"""
Spark Connect Labextension Kernel Extension

The kernel extension provides a helper function to create a SparkSession object which connects to the Spark Connect server through gRPC.
"""

from pyspark.sql import SparkSession
from ipykernel.comm import Comm
from .config import SPARK_CONNECT_PORT, EXTENSION_ID

FRONTEND_COMM_NAME = f"{EXTENSION_ID}:comm:frontend"

spark_session = None


def attach_config():
    """
    Send a message to the frontend extension to attach the configuration to notebook metadata.
    """
    frontend_comm = Comm(target_name=FRONTEND_COMM_NAME)
    frontend_comm.send(data={'action': 'attach-config-to-notebook'})


def get_spark_session():
    """
    Retrieve a Spark session object, and create one if it does not exist.

    :returns: Spark session object
    """
    attach_config()
    global spark_session
    if not spark_session:
        spark_session = SparkSession.builder \
            .remote(f"sc://127.0.0.1:{SPARK_CONNECT_PORT}") \
            .getOrCreate()
    return spark_session


def reset_spark_session():
    """
    Recreate a new Spark session object

    :returns: Spark session object
    """
    global spark_session
    spark_session = None
    return get_spark_session()


def load_ipython_extension(ipython):
    """
    Load variables into the Notebook space.
    """
    ipython.push({
        'attach_config': attach_config,
        'get_spark_session': get_spark_session,
        'reset_spark_session': reset_spark_session
    })
