"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Map, MapLayer, MapTooltip, useMapStore } from '@/registry/ol-map/map';  // Assuming the code you provided is in this file
import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Circle, Fill, Icon } from 'ol/style';
import { FeatureLike } from 'ol/Feature';

export const ClaudeExample = () => {
  // Sample GPS data with timestamps
  const vehicleData = [
    { time: 0, lon: -74.006, lat: 40.712, timestamp: "09:00 AM", speed: 0 },
    { time: 10, lon: -74.003, lat: 40.714, timestamp: "09:10 AM", speed: 35 },
    { time: 20, lon: -74.001, lat: 40.718, timestamp: "09:20 AM", speed: 42 },
    { time: 30, lon: -73.998, lat: 40.722, timestamp: "09:30 AM", speed: 38 },
    { time: 40, lon: -73.995, lat: 40.725, timestamp: "09:40 AM", speed: 28 },
    { time: 50, lon: -73.99, lat: 40.729, timestamp: "09:50 AM", speed: 45 },
    { time: 60, lon: -73.986, lat: 40.735, timestamp: "10:00 AM", speed: 30 },
  ];

  const [sliderValue, setSliderValue] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(vehicleData[0]);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [playInterval, setPlayIntervalId] = useState(null);

  // Access the map from the store
  const map = useMapStore((state) => state.map);

  // Refs for the layers
  const routeLayerRef = useRef(null);
  const pointsLayerRef = useRef(null);
  const vehicleLayerRef = useRef(null);

  // Calculate bearing between two points (in degrees)
  const calculateBearing = (startLon, startLat, endLon, endLat) => {
    const startLatRad = (startLat * Math.PI) / 180;
    const startLonRad = (startLon * Math.PI) / 180;
    const endLatRad = (endLat * Math.PI) / 180;
    const endLonRad = (endLon * Math.PI) / 180;

    const y = Math.sin(endLonRad - startLonRad) * Math.cos(endLatRad);
    const x =
      Math.cos(startLatRad) * Math.sin(endLatRad) -
      Math.sin(startLatRad) *
        Math.cos(endLatRad) *
        Math.cos(endLonRad - startLonRad);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360; // normalize to 0-360

    return bearing;
  };

  // Update current position and heading based on slider value
  useEffect(() => {
    // Find the current position index
    const currentIndex = vehicleData.findIndex(
      (point) => point.time === sliderValue
    );
    let position, heading;

    if (currentIndex === -1) {
      // Find nearest position
      position = vehicleData.reduce((prev, curr) =>
        Math.abs(curr.time - sliderValue) < Math.abs(prev.time - sliderValue)
          ? curr
          : prev
      );

      // Find the correct segment for heading calculation
      const nextIndex = vehicleData.findIndex(
        (point) => point.time > sliderValue
      );
      if (nextIndex !== -1 && nextIndex > 0) {
        const prevPoint = vehicleData[nextIndex - 1];
        const nextPoint = vehicleData[nextIndex];
        heading = calculateBearing(
          prevPoint.lon,
          prevPoint.lat,
          nextPoint.lon,
          nextPoint.lat
        );
      } else {
        // Default to last segment heading if at the end
        const last = vehicleData.length - 1;
        if (last > 0) {
          heading = calculateBearing(
            vehicleData[last - 1].lon,
            vehicleData[last - 1].lat,
            vehicleData[last].lon,
            vehicleData[last].lat
          );
        } else {
          heading = 0;
        }
      }
    } else {
      position = vehicleData[currentIndex];

      // Calculate heading based on current and next point
      if (currentIndex < vehicleData.length - 1) {
        heading = calculateBearing(
          position.lon,
          position.lat,
          vehicleData[currentIndex + 1].lon,
          vehicleData[currentIndex + 1].lat
        );
      } else if (currentIndex > 0) {
        // If at the end, use the heading from the previous segment
        heading = calculateBearing(
          vehicleData[currentIndex - 1].lon,
          vehicleData[currentIndex - 1].lat,
          position.lon,
          position.lat
        );
      } else {
        heading = 0;
      }
    }

    setCurrentPosition(position);
    setCurrentHeading(heading);
  }, [sliderValue]);

  // Create route layer
  const routeLayer = useRef(() => {
    // Create route feature
    const routeCoords = vehicleData.map((point) =>
      fromLonLat([point.lon, point.lat])
    );

    const routeFeature = new Feature({
      geometry: new LineString(routeCoords),
    });

    routeFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "#0074D9",
          width: 4,
        }),
      })
    );

    // Create and return the layer
    return new VectorLayer({
      source: new VectorSource({
        features: [routeFeature],
      }),
    });
  }).current();

  // Create points layer
  const pointsLayer = useRef(() => {
    // Create features for all points
    const features = vehicleData.map((point) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lon, point.lat])),
        properties: point,
      });

      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 4,
            fill: new Fill({ color: "#7FDBFF" }),
            stroke: new Stroke({ color: "#0074D9", width: 1 }),
          }),
        })
      );

      return feature;
    });

    // Create and return the layer
    return new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
    });
  }).current();

  // Create vehicle layer
  const vehicleLayer = useRef(() => {
    // Create vehicle feature
    const vehicleFeature = new Feature({
      geometry: new Point(
        fromLonLat([currentPosition.lon, currentPosition.lat])
      ),
      properties: {
        ...currentPosition,
        heading: currentHeading,
        type: "vehicle",
      },
    });

    // Create and set style with direction indicator
    vehicleFeature.setStyle(
      new Style({
        image: new Icon({
          src:
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#FF4136" stroke="#FFFFFF" stroke-width="2"/>
            <path d="M12 5 L12 19 M12 5 L8 9 M12 5 L16 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `),
          anchor: [0.5, 0.5],
          rotateWithView: true,
          rotation: (currentHeading * Math.PI) / 180,
        }),
      })
    );

    // Create and return the layer
    return new VectorLayer({
      source: new VectorSource({
        features: [vehicleFeature],
      }),
      zIndex: 10, // Ensure vehicle is on top
    });
  }).current();

  // Update vehicle position and heading when they change
  useEffect(() => {
    if (!map) return;

    const vehicleFeature = vehicleLayer.getSource().getFeatures()[0];
    if (vehicleFeature) {
      // Update position
      vehicleFeature
        .getGeometry()
        .setCoordinates(fromLonLat([currentPosition.lon, currentPosition.lat]));

      // Update properties
      vehicleFeature.set("properties", {
        ...currentPosition,
        heading: currentHeading,
        type: "vehicle",
      });

      // Update style with new heading
      vehicleFeature.setStyle(
        new Style({
          image: new Icon({
            src:
              "data:image/svg+xml;charset=utf-8," +
              encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#FF4136" stroke="#FFFFFF" stroke-width="2"/>
              <path d="M12 5 L12 19 M12 5 L8 9 M12 5 L16 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `),
            anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: (currentHeading * Math.PI) / 180,
          }),
        })
      );
    }
  }, [map, currentPosition, currentHeading]);

  // Playback functionality
  const startPlayback = () => {
    if (playInterval) {
      clearInterval(playInterval);
    }

    const intervalId = setInterval(() => {
      setSliderValue((prev) => {
        if (prev >= vehicleData[vehicleData.length - 1].time) {
          clearInterval(intervalId);
          setPlayIntervalId(null);
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    setPlayIntervalId(intervalId);
  };

  const stopPlayback = () => {
    if (playInterval) {
      clearInterval(playInterval);
      setPlayIntervalId(null);
    }
  };

  const resetPlayback = () => {
    stopPlayback();
    setSliderValue(0);
  };

  // Get cardinal direction from heading
  const getCardinalDirection = (heading) => {
    if (heading > 337.5 || heading <= 22.5) return "N";
    if (heading > 22.5 && heading <= 67.5) return "NE";
    if (heading > 67.5 && heading <= 112.5) return "E";
    if (heading > 112.5 && heading <= 157.5) return "SE";
    if (heading > 157.5 && heading <= 202.5) return "S";
    if (heading > 202.5 && heading <= 247.5) return "SW";
    if (heading > 247.5 && heading <= 292.5) return "W";
    return "NW";
  };

  // Tooltip renderer
  const renderTooltip = (feature: FeatureLike) => {
    const properties = feature.get("properties");

    if (!properties) return null;

    if (properties.type === "vehicle") {
      return (
        <div className="p-1">
          <div className="font-semibold">Vehicle</div>
          <div>Time: {properties.timestamp}</div>
          <div>Speed: {properties.speed} mph</div>
          <div>
            Heading: {properties.heading.toFixed(1)}° (
            {getCardinalDirection(properties.heading)})
          </div>
        </div>
      );
    }

    return (
      <div className="p-1">
        <div>Time: {properties.timestamp}</div>
        <div>
          Location: {properties.lat.toFixed(5)}, {properties.lon.toFixed(5)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Vehicle Tracker with Direction</h2>

      {/* Map container */}
      <div className="relative w-full h-96 border border-gray-300 rounded-lg overflow-hidden mb-4">
        <Map
          options={{
            view: new View({
              center: fromLonLat([
                (Math.min(...vehicleData.map((p) => p.lon)) +
                  Math.max(...vehicleData.map((p) => p.lon))) /
                  2,
                (Math.min(...vehicleData.map((p) => p.lat)) +
                  Math.max(...vehicleData.map((p) => p.lat))) /
                  2,
              ]),
              zoom: 13,
            }),
            controls: [],
          }}
        >
          <MapLayer layer={new TileLayer({ source: new OSM() })} />
          <MapLayer layer={routeLayer} />
          <MapLayer layer={pointsLayer} />
          <MapLayer layer={vehicleLayer} />
          <MapTooltip render={renderTooltip} />
        </Map>
      </div>

      {/* Time and position information */}
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">
          Current Time: {currentPosition.timestamp}
        </p>
        <p className="text-sm text-gray-600">
          Location: {currentPosition.lat.toFixed(5)},{" "}
          {currentPosition.lon.toFixed(5)}
        </p>
        <p className="text-sm text-gray-600">
          Heading: {currentHeading.toFixed(1)}° (
          {getCardinalDirection(currentHeading)})
          {currentPosition.speed > 0
            ? ` | Speed: ${currentPosition.speed} mph`
            : ""}
        </p>
      </div>

      {/* Slider control */}
      <div className="w-full max-w-lg">
        <input
          type="range"
          min={vehicleData[0].time}
          max={vehicleData[vehicleData.length - 1].time}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{vehicleData[0].timestamp}</span>
          <span>{vehicleData[vehicleData.length - 1].timestamp}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={startPlayback}
          disabled={playInterval !== null}
        >
          Play
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
          onClick={stopPlayback}
          disabled={playInterval === null}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          onClick={resetPlayback}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
