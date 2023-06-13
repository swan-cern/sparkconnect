from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json


class GetConfigBundlesRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps(self.spark_config_bundles))
