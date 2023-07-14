import socket
from jupyter_server_proxy.handlers import ProxyHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin
from spark_connect_labextension.config import EXTENSION_ID
from spark_connect_labextension.sparkconnectserver.cluster import cluster


class SparkUIProxyHandler(ExtensionHandlerMixin, ProxyHandler):
    @property
    def ext_config(self):
        return self.settings['spark_connect_config']
    
    @property
    def spark_clusters(self):
        return self.ext_config['clusters']
    
    @property
    def spark_webui_host(self):
        current_cluster = self.spark_clusters[cluster.cluster_name]
        return current_cluster.get('webui_hostname', socket.gethostname())
    
    @property
    def spark_webui_port(self):
        current_cluster = self.spark_clusters[cluster.cluster_name]
        return current_cluster.get('webui_port', 4040)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.proxy_base = f'/{EXTENSION_ID}/ui'

    async def http_get(self, proxied_path):
        return await self.proxy(proxied_path)

    async def open(self, proxied_path):
        self.host_allowlist = [self.spark_webui_host]
        print("Host open allowlist", self.host_allowlist)
        return await super().proxy_open(self.spark_webui_host, self.spark_webui_port, proxied_path)

    def post(self, proxied_path):
        return self.proxy(proxied_path)

    def put(self, proxied_path):
        return self.proxy(proxied_path)

    def delete(self, proxied_path):
        return self.proxy(proxied_path)

    def head(self, proxied_path):
        return self.proxy(proxied_path)

    def patch(self, proxied_path):
        return self.proxy(proxied_path)

    def options(self, proxied_path):
        return self.proxy(proxied_path)

    def proxy(self, proxied_path):
        self.host_allowlist = [self.spark_webui_host]
        print("Host allowlist", self.host_allowlist)
        return super().proxy(self.spark_webui_host, self.spark_webui_port, proxied_path)
