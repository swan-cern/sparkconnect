from jupyter_server.extension.application import ExtensionApp
from traitlets import Any, Bool, Dict, HasTraits, List, Unicode, default, Integer
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
from .config import EXTENSION_ID


class SparkConnectExtensionApp(ExtensionApp):
    """
    Jupyter Server App for the Spark Connect Labextension
    """
    name = "spark_connect_labextension"
    default_url = f"/{EXTENSION_ID}"
    # base_url = f"${self.base_url}{EXTENSION_ID}"
    load_other_extensions = True
    file_url_prefix = "/render"

    settings = {}
    handlers = []
    static_paths = []
    template_paths = []

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
                'name': Unicode(),
                'displayName': Unicode(),
                'clusterFilter': List(trait=Unicode()),
                'options': List(trait=Unicode(), default_value=[]),
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

    spark_connector_config = Dict(
        per_key_traits={
            'clusters': Dict(
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
            ),
            'config_bundles': Dict(
                allow_none=True,
                default_value={},
                key_trait=Unicode(),
                value_trait=Dict(
                    per_key_traits={
                        'name': Unicode(),
                        'displayName': Unicode(),
                        'clusterFilter': List(trait=Unicode()),
                        'options': List(trait=Unicode(), default_value=[]),
                    }
                )
            ),
            'config_bundles_from_file': Dict(
                allow_none=True,
                per_key_traits={
                    'file': Unicode(),
                    'json_path': Unicode()
                }
            ),
            'spark_options': List(
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
            ),
            'spark_options_from_file': Dict(
                allow_none=True,
                per_key_traits={
                    'file': Unicode(),
                    'json_path': Unicode()
                }
            ),
        }
    )

    # def initialize_settings(self):
    #     """
    #     Initialize Jupyter server configuration
    #     """
    #     self.settings.update(
    #         {"spark_connect_config": self.config["SparkConnectConfig"]}
    #     )

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
