"""
API Route Handler - Get cluster status
This file contains the route handler for retrieving the connection state.
"""

import tornado
import json
import asyncio
from sparkconnector.handlers.base import SparkConnectAPIHandler
from sparkconnector.sparkconnectserver.cluster import cluster
from sparkconnector.config import SPARK_CLUSTER_NAME


class GetClusterStatusRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    async def get(self):
        """
        GET handler for retrieving Spark connection state

        :returns: cluster state
        """
        status = await asyncio.to_thread(cluster.get_status)
        self.finish(json.dumps({
            'status': status.name,
            'clusterName': cluster.cluster_name,
            'port': cluster.get_port(),
            'configBundles': cluster.config_bundles,
            'extraConfig': cluster.extra_config,
            'sparkOptions': cluster.get_options(),
            'extensionConfig': {
                'preselectedClusterName': SPARK_CLUSTER_NAME,
                'disableClusterSelectionOnPreselected': self.extensionapp.disable_cluster_selection_on_preselected
            }
        }))
