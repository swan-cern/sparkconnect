from jupyter_server.base.handlers import APIHandler
import tornado
import json
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
        except Exception as e:
            print(e)
            self.set_status(500)
            self.finish(json.dumps({
                "error": "FAILED_TO_START_SPARK_CONNECT_SERVER"
            }))
    

class StopClusterRouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):  # TODO use POST
        try:
            cluster.stop()
            self.finish(json.dumps({
                "success": True,
                "message": "STOPPED_SPARK_CONNECT_SERVER"
            }))
        except Exception as e:
            print(e)
            self.set_status(500)
            self.finish(json.dumps({
                "error": "FAILED_TO_STOP_CONNECT_SERVER"
            }))
    

class GetClusterLogRouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        logs = cluster.get_log()
        if not logs:
            self.set_status(404)
            self.finish("Not Found")
            return

        self.finish(logs)

class GetClusterStatusRouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        status = cluster.get_status()
        self.finish(json.dumps({'status': status.name}))

