# Craterz

## About

This is a data visualization tool for the Global Mars Crater Database, created by Dr. Stuart Robbins and Dr. Brian Hynek.
Information about the dataset can be found at <https://craters.sjrdesign.net/> and in the following paper:
[A new global database of Mars impact craters ≥ 1km; 1. Database creation, properties, and parameters](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2011JE003966)
There was once a search tool on Dr. Robbins website, but that was disabled some time ago and has not returned.
This tool was developed as part of a school project but may see additional features added in time.

## Stack

This tool was built with leaflet.js, crossfilter.js, and D3.js.

## Docker / Docker Compose

This project can be run using Docker Compose.

### Requirements
- Docker
- Docker Compose (v2)

### Run the app
```bash
docker compose up
````

### Access

Open your browser and go to:

[http://localhost:5000](http://localhost:5000)

The container runs a simple Flask app that serves `index.html`.

```
```
