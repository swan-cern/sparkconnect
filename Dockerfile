FROM jupyter/datascience-notebook
LABEL maintainer="Muhammad Aditya Hilmy <mhilmy@hey.com>"

USER $NB_UID

RUN conda install -y -c conda-forge pyspark grpcio grpcio-status \
    && conda clean --all -f -y

USER root

RUN mkdir /spark \
    && cd /spark \
    && wget https://dlcdn.apache.org/spark/spark-3.4.0/spark-3.4.0-bin-hadoop3.tgz \
    && tar xvf spark-3.4.0-bin-hadoop3.tgz \
    && fix-permissions /spark

ENV SPARK_HOME /spark/spark-3.4.0-bin-hadoop3

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;
    
# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

COPY . /sparkconnector
WORKDIR /sparkconnector
RUN cp ./jupyter-config/server-config/sparkconnector.json /etc/jupyter/jupyter_server_config.json

RUN fix-permissions /sparkconnector

USER $NB_UID

RUN pip install -e . \
    && jupyter server extension enable --py sparkconnector --sys-prefix \
    && jupyter labextension link . --dev-build=False \
    && jupyter lab clean -y \
    && npm cache clean --force \
    && rm -rf "/home/${NB_USER}/.cache/yarn" \
    && rm -rf "/home/${NB_USER}/.node-gyp"

ENV JUPYTER_ENABLE_LAB=yes

WORKDIR $HOME
