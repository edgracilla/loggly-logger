# Loggly Logger

[![Build Status](https://travis-ci.org/Reekoh/loggly-logger.svg)](https://travis-ci.org/Reekoh/loggly-logger)
![Dependencies](https://img.shields.io/david/Reekoh/loggly-logger.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/loggly-logger.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Loggly Logger Plugin for the Reekoh IoT Platform. Connects a Reekoh instance to Loggly to synchronize log data.

## Configuration Parameters

* Token (String) - The Loggly token to use for sending log data.
* Subdomain (String) - The Loggly subdomain to send log data to.
* *Log Level (String) - Optional, the default log level to use.*
* *Tags (String) - Optional, the tags to use to associate the logs to.*

## Input Data

* logData (String) - String containing the data to be logged. Can also be a JSON String. If data is JSON String, it will get parsed before it is sent. To customize log level, simply include a level field on the log data JSON String.
