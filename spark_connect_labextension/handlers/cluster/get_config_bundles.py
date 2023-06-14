from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json


class GetConfigBundlesRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        bundles = []
        for bundle_name in self.spark_config_bundles:
            bundle = self.spark_config_bundles[bundle_name]
            bundles.append({
                'name': bundle_name,
                'displayName': bundle.get('display_name'),
                'clusterFilter': bundle.get('cluster_filter'),
                'options': bundle.get('options', [])
            })
        self.finish(json.dumps(bundles))
