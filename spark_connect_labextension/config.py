import os

EXTENSION_ID = 'spark-connect-labextension'

SPARK_HOME = os.getenv('SPARK_HOME')
SPARK_CONNECT_PACKAGE = os.getenv('SPARK_CONNECT_PACKAGE', 'org.apache.spark:spark-connect_2.12:3.4.0')
SPARK_CONNECT_PORT = int(os.getenv('SPARK_CONNECT_PORT', '15002'))
