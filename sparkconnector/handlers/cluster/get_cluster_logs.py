"""
API Route Handler - Get cluster logs
This file contains the route handler for retrieving Spark connection logs.
"""
import tornado
import asyncio
from sparkconnector.handlers.base import SparkConnectAPIHandler
from sparkconnector.sparkconnectserver.cluster import cluster


class GetClusterLogRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    async def get(self):
        """
        GET handler for retrieving Spark connection logs

        :returns: Spark connection logs
        """
        logs = await asyncio.to_thread(cluster.get_log)
        if not logs:
            self.finish("No Spark logs found.", set_content_type='text/plain')
            return

        self.finish(logs, set_content_type='text/plain')
