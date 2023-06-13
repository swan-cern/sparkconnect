from jupyter_server.base.handlers import APIHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin

class SparkConnectAPIHandler(ExtensionHandlerMixin, APIHandler):
    @property
    def ext_config(self):
        return self.settings['spark_connect_config']
    
    @property
    def spark_clusters(self):
        return self.ext_config['clusters']
    
    @property
    def spark_config_bundles(self):
        return self.ext_config['config_bundles']