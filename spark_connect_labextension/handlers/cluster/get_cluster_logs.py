from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class GetClusterLogRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        logs = cluster.get_log()
        if not logs:
            self.set_status(404)
            self.finish("Not Found")
            return

        self.finish(logs)
