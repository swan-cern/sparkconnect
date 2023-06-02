from sparkconnectserver.spawner import SparkConnectCluster

def run():
    cluster = SparkConnectCluster()
    try:
        cluster.start()
        while True:
            pass
    finally:
        cluster.stop()

if __name__ == '__main__':
    run()