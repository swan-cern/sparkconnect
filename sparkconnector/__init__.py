from ._version import __version__
from .config import EXTENSION_ID


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": EXTENSION_ID
    }]


def _jupyter_server_extension_points():
    from .app import SparkConnectExtensionApp
    return [{
        "module": "sparkconnector",
        "app": SparkConnectExtensionApp
    }]


def _load_jupyter_server_extension(server_app):
    from .app import SparkConnectExtensionApp
    """Registers the API handler to receive HTTP requests from the frontend extension.

    Parameters
    ----------
    server_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    SparkConnectExtensionApp.load_classic_server_extension(server_app)


# For backward compatibility with notebook server - useful for Binder/JupyterHub
# load_jupyter_server_extension = SparkConnectExtensionApp.load_classic_server_extension
def load_jupyter_server_extension(server_app):
    from .app import SparkConnectExtensionApp
    SparkConnectExtensionApp.load_classic_server_extension(server_app)
