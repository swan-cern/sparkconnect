from jupyter_server.base.handlers import APIHandler
import tornado
import json
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class GetClusterStatusRouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        status = cluster.get_status()
        self.finish(json.dumps({'status': status.name}))
