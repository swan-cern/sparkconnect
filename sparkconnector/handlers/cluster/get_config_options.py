"""
API Route Handler - Get available config options
This file contains the route handler for retrieving Spark options available for use.
"""

import tornado
import json
from sparkconnector.handlers.base import SparkConnectAPIHandler


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
