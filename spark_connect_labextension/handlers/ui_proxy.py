"""
Route Handler - Jupyter Server Proxy

This file contains a class which extends Jupyter Server Proxy's ProxyHandler to customize the proxy's parameters.
"""

import socket
from jupyter_server_proxy.handlers import ProxyHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin
from spark_connect_labextension.config import EXTENSION_ID
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class SparkUIProxyHandler(ExtensionHandlerMixin, ProxyHandler):
    @property
    def ext_config(self):
        """
        Property for retrieving extension config
        
        :returns: extension config object
        """
        return self.settings['spark_connect_config']
    
    @property
    def spark_clusters(self):
        """
        Property for retrieving available clusters from configuration
        
        :returns: array of cluster config object
        """
        return self.ext_config['clusters']
    
    @property
    def spark_webui_host(self):
        """
        Property for retrieving current Spark Web UI hostname
        
        :returns: Spark Web UI hostname
        """
        current_cluster = self.spark_clusters[cluster.cluster_name]
        return current_cluster.get('webui_hostname', socket.gethostname())
    
    @property
    def spark_webui_port(self):
        """
        Property for retrieving current Spark Web UI port
        
        :returns: Spark Web UI port
        """
        current_cluster = self.spark_clusters[cluster.cluster_name]
        return current_cluster.get('webui_port', 4040)

    def __init__(self, *args, **kwargs):
        """
        Proxy handler constructor
        """
        super().__init__(*args, **kwargs)
        self.proxy_base = f'/{EXTENSION_ID}/ui'
        self.host_allowlist = [self.spark_webui_host]

    async def http_get(self, proxied_path):
        """
        Proxy GET handler
        :param proxied_path: HTTP path to proxy
        """
        return await self.proxy(proxied_path)

    async def open(self, proxied_path):
        """
        Proxy websocket open handler
        :param proxied_path: HTTP path to proxy
        """
        return await super().proxy_open(self.spark_webui_host, self.spark_webui_port, proxied_path)

    def post(self, proxied_path):
        """
        Proxy POST handler
        :param proxied_path: HTTP path to proxy
        """
        return self.proxy(proxied_path)

    def put(self, proxied_path):
        """
        Proxy PUT handler
        :param proxied_path: HTTP path to proxy
        """
        return self.proxy(proxied_path)

    def delete(self, proxied_path):
        """
        Proxy DELETE handler
        :param proxied_path: HTTP path to proxy
        """
        return self.proxy(proxied_path)

    def head(self, proxied_path):
        """
        Proxy HEAD handler
        :param proxied_path: HTTP path to proxy
        """
        return self.proxy(proxied_path)

    def patch(self, proxied_path):
        """
        Proxy PATCH handler
        :param proxied_path: HTTP path to proxy
        """
        return self.proxy(proxied_path)

    def options(self, proxied_path):
        """
        Proxy OPTIONS handler
        :param proxied_path: HTTP path to proxy
        """
        return self.proxy(proxied_path)

    def proxy(self, proxied_path):
        """
        Proxy handler
        :param proxied_path: HTTP path to proxy
        """
        return super().proxy(self.spark_webui_host, self.spark_webui_port, proxied_path)
