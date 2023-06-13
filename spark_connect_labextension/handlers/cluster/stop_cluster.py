from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json
import traceback
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class StopClusterRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):  # TODO use POST
        try:
            cluster.stop()
            self.finish(json.dumps({
                "success": True,
                "message": "STOPPED_SPARK_CONNECT_SERVER"
            }))
        except:
            traceback.print_exc()
            self.set_status(500)
            self.finish(json.dumps({
                "error": "FAILED_TO_STOP_CONNECT_SERVER"
            }))
    