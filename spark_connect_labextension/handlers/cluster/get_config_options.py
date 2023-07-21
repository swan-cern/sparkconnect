"""
API Route Handler - Get available config options
This file contains the route handler for retrieving Spark options available for use.
"""

from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json


class GetConfigOptionsRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        """
        GET handler for retrieving Spark config options

        :returns: Array of {
            category: Category name,
            name: Spark option key name
        }
        """
        options = []
        for option in self.spark_options:
            options.append({
                # TODO change config format
                'category': option['data']['category'],
                'name': option['value']
            })
        self.finish(json.dumps(options))
