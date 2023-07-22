"""
Route Handler - /ui/ Proxy Redirector

This file contains a route handler to redirect users to /ui/jobs/
"""
from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
from spark_connect_labextension.config import EXTENSION_ID


class SparkUIProxyRedirectHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        """
        GET handler for redirecting /ui/ to /ui/jobs/
        """
        # FIXME: This is a strange but necessary workaround. 
        # On JupyterHub installation, opening /ui or /ui/ would cause it to 
        # redirect to /jobs/ instead of /user/{username}/spark-connect-labextension/ui/jobs/
        url = f'{self.base_url}{EXTENSION_ID}/ui/jobs/'
        self.redirect(url)
