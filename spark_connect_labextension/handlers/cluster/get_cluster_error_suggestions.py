"""
API Route Handler - Get cluster error suggestions
This file contains the route handler for retrieving cluster error troubleshooting suggestions.
"""
import re
import json
from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import asyncio
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class GetClusterErrorSuggestionsRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    async def get(self):
        """
        GET handler for retrieving cluster error troubleshooting suggestions.
        """
        logs = await asyncio.to_thread(cluster.get_log)
        valid_suggestions = []
        if logs:
            valid_suggestions = self.get_valid_suggestions(logs)

        self.finish(json.dumps(valid_suggestions), set_content_type='application/json')

    def get_valid_suggestions(self, logs):
        """
        Get error troubleshooting suggestions, given a string of logs.

        :param logs: string of logs
        :returns: array of {
            pattern: regex pattern for triggering suggestion,
            type: error | info | warn,
            message: string of message
        }
        """
        valid_suggestions = []
        for suggestion in self.error_suggestions:
            match = re.search(suggestion['pattern'], logs)
            if match:
                valid_suggestions.append(suggestion)
        return valid_suggestions
