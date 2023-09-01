"""
API Route Handler - Start Spark connection
This file contains the route handler for starting the Spark connection (Spark Driver + Spark Connect server)
"""

import tornado
import json
import traceback
import asyncio
from sparkconnector.handlers.base import SparkConnectAPIHandler
from sparkconnector.sparkconnectserver.cluster import cluster


class StartClusterRouteHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    async def post(self):
        """
        POST handler for starting a new Spark cluster connection

        :param cluster: Spark cluster name
        :param configBundles: Array of config bundle names
        :param extraConfig: dict of configKey=configValue
        :param options: dict of optionKey=optionValue
        :returns: cluster initiation status (success or fail)
        """
        json_body = self.get_json_body()
        cluster_name = json_body['cluster']
        config_bundles = json_body.get('configBundles', [])
        extra_config = json_body.get('extraConfig', {})
        options = json_body.get('options', {})

        cluster_metadata = self.spark_clusters[cluster_name]
        cluster_env = cluster_metadata.get('env', {})
        cluster_opts = cluster_metadata.get('opts', {})
        pre_script = cluster_metadata.get('pre_script')
        webui_port = cluster_metadata.get('webui_port', 4040)

        spark_opts = {**cluster_opts, **options, 'spark.ui.port': webui_port}

        try:
            await asyncio.to_thread(cluster.start, cluster_name=cluster_name, options=spark_opts, envs=cluster_env, config_bundles=config_bundles, extra_config=extra_config, pre_script=pre_script)
            self.finish(json.dumps({
                "success": True,
                "message": "STARTED_SPARK_CONNECT_SERVER"
            }))
        except:
            traceback.print_exc()
            self.set_status(500)
            self.finish(json.dumps({
                "error": "FAILED_TO_START_SPARK_CONNECT_SERVER"
            }))
