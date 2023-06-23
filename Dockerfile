FROM jupyter/datascience-notebook
LABEL maintainer="Muhammad Aditya Hilmy <mhilmy@hey.com>"

USER $NB_UID

RUN conda install -y -c conda-forge pyspark grpcio grpcio-status \
    && conda clean --all -f -y

RUN wget https://dlcdn.apache.org/spark/spark-3.4.0/spark-3.4.0-bin-hadoop3.tgz \
    && tar xvf spark-3.4.0-bin-hadoop3.tgz

ENV SPARK_HOME $HOME/spark-3.4.0-bin-hadoop3.tgz

USER root

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

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

COPY . /spark_connect_labextension
WORKDIR /spark_connect_labextension

RUN fix-permissions /spark_connect_labextension

USER $NB_UID

RUN pip install -e . \
    && jupyter serverextension enable --py spark_connect_labextension --sys-prefix \
    && jupyter labextension link . --dev-build=False \
    && jupyter lab clean -y \
    && npm cache clean --force \
    && rm -rf "/home/${NB_USER}/.cache/yarn" \
    && rm -rf "/home/${NB_USER}/.node-gyp"

ENV JUPYTER_ENABLE_LAB=yes

WORKDIR $HOME
