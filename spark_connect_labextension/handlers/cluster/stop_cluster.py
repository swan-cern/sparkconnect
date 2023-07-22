"""
API Route Handler - Stop Spark connection
This file contains the route handler for stopping the Spark Connect + Driver process.
"""

from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
import json
import traceback
import asyncio
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class StopClusterRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    async def post(self):
        """
        POST handler for stopping running Spark connection

        :returns: operation status (success or fail)
        """
        try:
            await asyncio.to_thread(cluster.stop)
            self.finish(json.dumps({
                "success": True,
                "message": "STOPPED_SPARK_CONNECT_SERVER"
            }))
        except:
            traceback.print_exc()
            self.set_status(500)
            self.finish(json.dumps({
                "error": "FAILED_TO_STOP_CONNECT_SERVER"
            }))
    