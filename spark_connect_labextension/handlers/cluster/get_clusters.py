from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json


class GetClustersRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        clusters = []
        for cluster_name in self.spark_clusters:
            cluster = self.spark_clusters[cluster_name]
            clusters.append({
                'name': cluster_name,
                'displayName': cluster.get('display_name', cluster_name)
            })
        self.finish(json.dumps(clusters))
