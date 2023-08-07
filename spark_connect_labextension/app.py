from jupyter_server.extension.application import ExtensionApp
from traitlets import Bool, Dict, Enum, List, Unicode, default, Integer
from .handlers.cluster.start_cluster import StartClusterRouteHandler
from .handlers.cluster.stop_cluster import StopClusterRouteHandler
from .handlers.cluster.get_cluster_logs import GetClusterLogRouteHandler
from .handlers.cluster.get_cluster_error_suggestions import GetClusterErrorSuggestionsRouteHandler
from .handlers.cluster.get_cluster_status import GetClusterStatusRouteHandler
from .handlers.cluster.get_clusters import GetClustersRouteHandler
from .handlers.cluster.get_config_bundles import GetConfigBundlesRouteHandler
from .handlers.cluster.get_config_options import GetConfigOptionsRouteHandler
from .handlers.ui_proxy_redirect import SparkUIProxyRedirectHandler
from .handlers.ui_proxy import SparkUIProxyHandler
from .config import EXTENSION_ID, EXTENSION_CONFIG_NAME


class SparkConnectExtensionApp(ExtensionApp):
    """
    Jupyter Server App for the Spark Connect Labextension
    """
    name = "spark_connect_labextension"

    disable_cluster_selection_on_preselected = Bool(default_value=False, allow_none=True)

    error_suggestions = List(
        allow_none=True,
        default_value=[],
        trait=Dict(
            per_key_traits={
                'pattern': Unicode(),
                'type': Enum(values=['error', 'info', 'warn']),
                'message': Unicode(),
            }
        )
    )

    clusters = Dict(
        key_trait=Unicode(),
        value_trait=Dict(
            per_key_traits={
                'display_name': Unicode(),
                'env': Dict(
                    key_trait=Unicode(),
                    value_trait=Unicode(),
                    default_value={}
                ),
                'opts': Dict(
                    key_trait=Unicode(),
                    value_trait=Unicode(),
                    default_value={}
                ),
                'pre_script': Unicode(allow_none=True),
                'webui_port': Integer(allow_none=True, default_value=4040)
            }
        )
    )

    config_bundles = Dict(
        allow_none=True,
        default_value={},
        key_trait=Unicode(),
        value_trait=Dict(
            per_key_traits={
                'name': Unicode(allow_none=True),
                'displayName': Unicode(allow_none=True),
                'clusterFilter': List(trait=Unicode()),
                'options': List(default_value=[], trait=Dict(
                    per_key_traits={
                        'name': Unicode(),
                        'value': Unicode()
                    }
                )),
            }
        )
    )

    config_bundles_from_file = Dict(
        allow_none=True,
        per_key_traits={
            'file': Unicode(),
            'json_path': Unicode()
        }
    )

    spark_options = List(
        allow_none=True,
        trait=Dict(
            per_key_traits={
                'category': Dict(
                    per_key_traits={
                        'data': Dict(
                            per_key_traits={
                                'category': Unicode()
                            }
                        )
                    }
                ),
                'name': Dict(
                    per_key_traits={
                        'value': Unicode()
                    }
                )
            }
        )
    )

    spark_options_from_file = Dict(
        allow_none=True,
        per_key_traits={
            'file': Unicode(),
            'json_path': Unicode()
        }
    )

    @default("disable_cluster_selection_on_preselected")
    def _default_disable_cluster_selection_on_preselected(self):
        return self.config[EXTENSION_CONFIG_NAME].get("disable_cluster_selection_on_preselected")

    @default("error_suggestions")
    def _default_error_suggestions(self):
        return self.config[EXTENSION_CONFIG_NAME].get("error_suggestions")

    @default("clusters")
    def _default_clusters(self):
        return self.config[EXTENSION_CONFIG_NAME].get("clusters")

    @default("config_bundles")
    def _default_config_bundles(self):
        return self.config[EXTENSION_CONFIG_NAME].get("config_bundles", {})

    @default("config_bundles_from_file")
    def _default_config_bundles_from_file(self):
        return self.config[EXTENSION_CONFIG_NAME].get("config_bundles_from_file", None)

    @default("spark_options")
    def _default_spark_options(self):
        return self.config[EXTENSION_CONFIG_NAME].get("spark_options", {})

    @default("spark_options_from_file")
    def _default_spark_options_from_file(self):
        return self.config[EXTENSION_CONFIG_NAME].get("spark_options_from_file", None)

    def initialize_handlers(self):
        """
        Register API handlers
        """
        base_url = f"/api/{EXTENSION_ID}"
        handlers = [
            (f"{base_url}/clusters", GetClustersRouteHandler),
            (f"{base_url}/config-bundles", GetConfigBundlesRouteHandler),
            (f"{base_url}/config-options", GetConfigOptionsRouteHandler),
            (f"{base_url}/cluster/start", StartClusterRouteHandler),
            (f"{base_url}/cluster/stop", StopClusterRouteHandler),
            (f"{base_url}/cluster/logs", GetClusterLogRouteHandler),
            (f"{base_url}/cluster/errors", GetClusterErrorSuggestionsRouteHandler),
            (f"{base_url}/cluster/status", GetClusterStatusRouteHandler),
            (f"{base_url}/ui(/)?", SparkUIProxyRedirectHandler),
            (f"{base_url}/ui(?P<proxied_path>.*)", SparkUIProxyHandler),
        ]
        self.handlers.extend(handlers)
