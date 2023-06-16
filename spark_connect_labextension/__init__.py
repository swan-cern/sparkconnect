from ._version import __version__
from .app import SparkConnectExtensionApp
from .config import EXTENSION_ID


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": EXTENSION_ID
    }]


def _jupyter_server_extension_points():
    return [{
        "module": "spark_connect_labextension",
        "app": SparkConnectExtensionApp
    }]


# def _load_jupyter_server_extension(server_app):
#     """Registers the API handler to receive HTTP requests from the frontend extension.

#     Parameters
#     ----------
#     server_app: jupyterlab.labapp.LabApp
#         JupyterLab application instance
#     """
#     setup_handlers(server_app.web_app)
#     name = "spark_connect_labextension"
#     server_app.log.info(f"Registered {name} server extension")


# For backward compatibility with notebook server - useful for Binder/JupyterHub
load_jupyter_server_extension = SparkConnectExtensionApp.load_classic_server_extension
