from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class GetClusterStatusRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        status = cluster.get_status()
        self.finish(json.dumps({
            'status': status.name, 
            'clusterName': cluster.cluster_name
        }))
