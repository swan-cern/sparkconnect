"""
API Route Handler - Get available clusters
This file contains the route handler for retrieving clusters available for connection.
"""

import tornado
import json
from spark_connect_labextension.handlers.base import SparkConnectAPIHandler


class GetClustersRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        """
        GET handler for retrieving list of available clusters

        :returns: Array of {
            name: machine-readable Spark cluster name,
            displayName: human-readable Spark cluster name
        }
        """
        clusters = []
        for cluster_name in self.spark_clusters:
            cluster = self.spark_clusters[cluster_name]
            clusters.append({
                'name': cluster_name,
                'displayName': cluster.get('display_name', cluster_name)
            })
        self.finish(json.dumps(clusters))
