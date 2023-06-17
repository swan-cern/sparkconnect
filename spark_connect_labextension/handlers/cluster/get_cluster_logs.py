from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class GetClusterLogRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        logs = cluster.get_log()
        if not logs:
            self.finish("No Spark logs found.", set_content_type='text/plain')
            return

        self.finish(logs, set_content_type='text/plain')
