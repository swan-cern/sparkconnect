from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json


class GetConfigBundlesRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        """
        GET handler for retrieving Spark config bundles

        :returns: Array of {
            name: machine-readable config bundle name,
            displayName: human-readable config bundle name,
            clusterFilter: Array of strings containing cluster name,
            options: Array of {
                name: Spark option name,
                value: Spark option value
            }
        }
        """
        bundles = []
        for bundle_name in self.spark_config_bundles:
            bundle = self.spark_config_bundles[bundle_name]
            bundles.append({
                'name': bundle_name,
                'displayName': bundle.get('display_name', bundle_name),
                'clusterFilter': bundle.get('cluster_filter'),
                'options': bundle.get('options', [])
            })
        self.finish(json.dumps(bundles))
