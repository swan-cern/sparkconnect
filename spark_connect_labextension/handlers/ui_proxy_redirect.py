from spark_connect_labextension.handlers.base import SparkConnectAPIHandler
import tornado
from spark_connect_labextension.config import EXTENSION_ID


class SparkUIProxyRedirectHandler(SparkConnectAPIHandler):
    @tornado.web.authenticated
    def get(self):
        url = f'/{EXTENSION_ID}/ui/'
        self.redirect(url)
