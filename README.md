# sparkconnector

[![Github Actions Status](https://github.com/swan-cern/sparkconnect/workflows/Build/badge.svg)](https://github.com/swan-cern/sparkconnect/actions/workflows/build.yml)
A JupyterLab Extension to connect to Apache Spark using Spark Connect

This extension is composed of a Python package named `sparkconnector` for the frontend and backend extension.

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension, execute:

```bash
pip install sparkconnector
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall sparkconnector
```

## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the sparkconnector directory
# Install package in development mode
pip install -e ".[test]"
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Server extension must be manually installed in develop mode
jupyter server extension enable sparkconnector
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable sparkconnector
pip uninstall sparkconnector
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `sparkconnector` within that folder.

### Testing the extension

#### Server tests

This extension is using [Pytest](https://docs.pytest.org/) for Python code testing.

Install test dependencies (needed only once):

```sh
pip install -e ".[test]"
# Each time you install the Python package, you need to restore the front-end extension link
jupyter labextension develop . --overwrite
```

To execute them, run:

```sh
pytest -vv -r ap --cov sparkconnector
```

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro/) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)

### Configuration

This extension can be configured using the standard Jupyter server configuration system. Here's an example configuration:

```json
{
    "SparkConnectorApp": {
        "clusters": {
            "cluster_name": {
                "display_name": "Local Cluster",
                // ...
            }
        },
        "disable_cluster_selection_on_preselected": false,
        "error_suggestions": [
            {
                "pattern": "ERROR SparkContext: Failed to add file:",
                "type": "error",
                "message": "Required files are missing."
            },
            // ...
        ],
        "config_bundles": {
            "TestBundle": {
                "options": [
                    {
                        "name": "spark.app.name",
                        "value": "Test App"
                    },
                    // ...
                ]
            }
        },
        "spark_options": [
            {
                "data": {
                    "category": "Spark App Name"
                },
                "value": "spark.app.name"
            }
        ]
    }
}
```

#### Clusters - `clusters`

For each cluster, the following values can be configured:
- `display_name` (Optional): the human-readable display name of the cluster
- `env` (Optional): a key-value pair of environment variables
- `opts` (Optional): a key-value pair of Spark options
- `pre_script` (Optional): a bash script to execute before starting the Spark Connect server.
    - You can use this option to execute a bash script to set the environment variables.
- `webui_port` (Optional): port number of the Spark Web UI

#### Config bundles - `config_bundles`

For each config bundle, the following values can be configured:
- `name`: The name of the config bundle
- `displayName` (Optional): The human-readable name of the config bundle
- `clusterFilter` (Optional): An array of string containing the cluster names in which this config bundle will appear
- `options`: An array of objects, containing:
    - `name`: Spark option name
    - `value`: Option value

You can also put the config bundle in a separate file, and make a reference to it using `config_bundles_from_file` option.
```json
// ...
{
    "config_bundles_from_file": {
        "file": "/path/to/json/file.json",
        "json_path": "json-path-to-object"
    }
}
```

The JSON file must contain JSON object with the same format as above. However, you can put the object inside of another object (no need to be at the root), but you need to specify a JSON path.

#### Spark options - `spark_options`

For each Spark option, the following values can be configured:
```json
{
    "category": {
        "name": "spark.options.name",
        "data": {
            "category": "Category Name"
        }
    }
}
```

You can also put the config bundle in a separate file, and make a reference to it using `spark_options_from_file` option.
```json
// ...
{
    "config_bundles_from_file": {
        "file": "/path/to/json/file.json",
        "json_path": "json-path-to-object"
    }
}
```

The JSON file must contain JSON object with the same format as above. However, you can put the object inside of another object (no need to be at the root), but you need to specify a JSON path.

#### Disable cluster selection if preselected - `disable_cluster_selection_on_preselected`

For JupyterHub installation, you might want to predefine the cluster when provisioning. You can set the `SPARK_CLUSTER_NAME` environment variable and have the extension select the cluster automatically.

If you want the extension to disable the cluster selection option if the environment variable is set, you can set this option to `true`.

#### Error suggestions - `error_suggestions`

If the extension fails to establish a connection to a Spark cluster, users can review the connection logs to troubleshoot the error.

To assist users in troubleshooting, you can configure the extension to show a prominent error message based on the connection logs using the `error_suggestions` option.

For each object, the following values must be configured:
- `pattern`: A regular expression pattern on the Spark connection log. If this expression matches on the log string, this error suggestion will be displayed.
- `type`: One of `error`, `info`, or `warn`
- `message`: The suggestion text
