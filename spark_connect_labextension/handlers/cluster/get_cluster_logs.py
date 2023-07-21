"""
API Route Handler - Get cluster logs
This file contains the route handler for retrieving Spark connection logs.
"""
from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import asyncio
from spark_connect_labextension.sparkconnectserver.cluster import cluster


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
