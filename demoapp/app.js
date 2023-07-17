/*instrumentation.js*/
const opentelemetry = require("@opentelemetry/sdk-node");
const {getNodeAutoInstrumentations,} = require("@opentelemetry/auto-instrumentations-node");
const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-grpc");
const {OTLPMetricExporter} = require("@opentelemetry/exporter-metrics-otlp-grpc");
const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');
const {Resource} = require('@opentelemetry/resources');
const {SemanticResourceAttributes} = require('@opentelemetry/semantic-conventions');

const otelServiceName = process.env.OTEL_SERVICE_NAME || 'defaultService'

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({}),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({}),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: otelServiceName
    })
});
sdk.start();

/**
 * express code
 */

const express = require('express')
const app = express()
const port = 3000

/**
 * health endpoint
 */

app.get ("/healthz", async(req, res) => {
    res.send("All good")
})

/**
 * OpenTelemetry Code
 */
const { OpenTelemetryHook } = require('@openfeature/open-telemetry-hook');

/**
 * Minimal application code
 */

app.get('/', async(req, res) => {

    var body = "<html><title>Demo App</title><body><h1>";
    body += 'Hello World!';
    body += "</h1></body></html>";
    res.send (body)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

