from jupyter_server_proxy.handlers import ProxyHandler

SPARK_WEBUI_HOST = 'localhost'
SPARK_WEBUI_PORT = 4040

class SparkUIProxyHandler(ProxyHandler):
    async def http_get(self, proxied_path):
        return await self.proxy(proxied_path)

    async def open(self, proxied_path):
        return await super().proxy_open(SPARK_WEBUI_HOST, SPARK_WEBUI_PORT, proxied_path)

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
        return super().proxy(SPARK_WEBUI_HOST, SPARK_WEBUI_PORT, proxied_path)
