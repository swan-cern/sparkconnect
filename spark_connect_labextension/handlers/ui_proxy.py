from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json
import requests

# TODO add requests to setup.py

base_url = "/spark-connect-labextension/ui"
spark_ui_base_url = 'http://localhost:4040'

class SparkUIProxyRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        ui_path = self.request.uri[len(base_url):]
        request_path = f"{spark_ui_base_url}{ui_path}"
        r = requests.get(request_path, headers=dict(self.request.headers), allow_redirects=False)
        # for header in r.headers:
        #     value = r.headers[header]
        #     self.add_header(header, value)
        
        content_type = r.headers.get('Content-Type', 'text/plain')
        self.finish(r.text, set_content_type=content_type)