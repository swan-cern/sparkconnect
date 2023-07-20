from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json


class GetConfigOptionsRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        options = []
        for option in self.spark_options:
            options.append({
                # TODO change config format
                'category': option['data']['category'],
                'name': option['value']
            })
        self.finish(json.dumps(options))
