from jupyter_server.base.handlers import APIHandler
import tornado
import json
import traceback
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class StartClusterRouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):  # TODO use POST
        try:
            cluster.start()
            self.finish(json.dumps({
                "success": True,
                "message": "STARTED_SPARK_CONNECT_SERVER"
            }))
        except:
            traceback.print_exc()
            self.set_status(500)
            self.finish(json.dumps({
                "error": "FAILED_TO_START_SPARK_CONNECT_SERVER"
            }))
