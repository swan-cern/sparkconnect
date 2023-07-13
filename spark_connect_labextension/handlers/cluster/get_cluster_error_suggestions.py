import re
import json
from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import asyncio
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class GetClusterErrorSuggestionsRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    async def get(self):
        logs = await asyncio.to_thread(cluster.get_log)
        valid_suggestions = []
        if logs:
            valid_suggestions = self.get_valid_suggestions(logs)

        self.finish(json.dumps(valid_suggestions), set_content_type='application/json')
    
    def get_valid_suggestions(self, logs):
        valid_suggestions = []
        for suggestion in self.error_suggestions:
            match = re.search(suggestion['pattern'], logs)
            if match:
                valid_suggestions.append(suggestion)
        return valid_suggestions
