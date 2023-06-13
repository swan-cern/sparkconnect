import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from spark_connect_labextension.handlers.cluster_handler import StartClusterRouteHandler, StopClusterRouteHandler, GetClusterLogRouteHandler

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /spark-connect-labextension/get-example endpoint!"
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    
    handlers = [
        (get_pattern(web_app, "get-example"), RouteHandler),
        (get_pattern(web_app, "cluster/start"), StartClusterRouteHandler),
        (get_pattern(web_app, "cluster/stop"), StopClusterRouteHandler),
        (get_pattern(web_app, "cluster/logs"), GetClusterLogRouteHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)

def get_pattern(web_app, path):
    base_url = web_app.settings["base_url"]
    return url_path_join(base_url, "spark-connect-labextension", path)