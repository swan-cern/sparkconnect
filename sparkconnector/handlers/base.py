"""
Base API Route Handler

This file contains the base class inherited by all API route handlers, 
which provides common properties for accessing the extension configuration.
"""

import json
from functools import cached_property
from jupyter_server.base.handlers import APIHandler
from jupyter_server.extension.handler import ExtensionHandlerMixin
from jsonpath_ng import parse


class SparkConnectAPIHandler(ExtensionHandlerMixin, APIHandler):
    @cached_property
    def spark_clusters(self):
        """
        Property for retrieving available clusters from configuration

        :returns: array of cluster config object
        """
        return self.extensionapp.clusters

    @cached_property
    def spark_config_bundles(self):
        """
        Property for retrieving Spark config bundles.
        This function will merge the JSON object specified in `config_bundles`
        and the one in the file referenced by `config_bundles_from_file` option.

        :returns: dict of ConfigBundleName=ConfigBundleObject
        """
        config_bundles = self.extensionapp.config_bundles
        from_file_options = self.extensionapp.config_bundles_from_file
        if from_file_options:
            file_path = from_file_options['file']
            with open(file_path, 'r') as f:
                json_data = json.load(f)
                jsonpath_expr = parse(from_file_options['json_path'])
                matches = jsonpath_expr.find(json_data)
                first_match = matches[0]
                out_config_bundles = {**config_bundles, **first_match.value}
                config_bundles = out_config_bundles

        return config_bundles

    @cached_property
    def spark_options(self):
        """
        Property for retrieving available Spark options.
        This function will merge the JSON object specified in `spark_options`
        and the one in the file referenced by `spark_options_from_file` option.

        :returns: array of Spark option objects
        """
        options = self.extensionapp.spark_options
        from_file_options = self.extensionapp.spark_options_from_file
        if from_file_options:
            file_path = from_file_options['file']
            with open(file_path, 'r') as f:
                json_data = json.load(f)
                jsonpath_expr = parse(from_file_options['json_path'])
                matches = jsonpath_expr.find(json_data)
                first_match = matches[0]
                out_options = options + first_match.value
                options = out_options

        return options

    @cached_property
    def error_suggestions(self):
        """
        Property for retrieving error troubleshooting suggestions from the config file

        :returns: array of error suggestions object
        """
        return self.extensionapp.error_suggestions
