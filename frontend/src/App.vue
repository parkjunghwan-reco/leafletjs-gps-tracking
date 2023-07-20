<script setup lang="ts">
import {onMounted, reactive} from "vue";

function randColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

// 파일을 읽고 2차원 배열로 변환하는 함수
function readCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const contents = reader.result;
      const lines = contents.split(/\r?\n/);
      const data = lines.map(line => {
        const row =  line.split(',')
        return {
          index: row[0],
          lat: row[1],
          lng: row[2],
        }
      }).filter(line => line.lat && line.lng);
      resolve([file.name, data]);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// 파일들을 읽고 2차원 배열들을 반환하는 함수
async function readCSVFiles(files) {
  const fileContents = new Map();
  for (const file of files) {
    const [filename, data] = await readCSVFile(file);
    fileContents.set(filename, data);
  }
  return fileContents;
}

// 파일 입력 요소에서 선택한 파일들을 처리하는 함수
async function processFiles() {
  const input = document.getElementById('csvFileInput');
  const files = input.files;
  if (files.length === 0) {
    alert('파일을 선택해주세요.');
    return;
  }

  try {
    const fileContents = await readCSVFiles(files);
    console.log(fileContents);
    drawMap(fileContents)
  } catch (error) {
    console.error('파일을 읽는 중 오류가 발생했습니다.', error);
  }
}

function drawMap(gpsRouteList) {
  var bounds = null;
  var layerMap = L.map(
      'layerMap', {
        center: [37.5030407, 127.09637649999999],
        zoom: 12,
        maxBounds: bounds,
        layers: [],
        worldCopyJump: false,
        crs: L.CRS.EPSG3857,
        zoomControl: true,
      });


  var tile_layer_d1806875e6b4af507cfbaa92dc44527f = L.tileLayer(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      {
        "attribution": null,
        "detectRetina": false,
        "maxNativeZoom": 18,
        "maxZoom": 18,
        "minZoom": 0,
        "noWrap": false,
        "opacity": 1,
        "subdomains": "abc",
        "tms": false
      }).addTo(layerMap);


  const calcOverlays = {};
  gpsRouteList.forEach((value, key, map) => {
    const group = L.featureGroup().addTo(layerMap);
    calcOverlays[key] = group

    const latlngList = value.map((data: { index: number, lat: number, lng: number }[]) => [data.lat, data.lng]);
    const color = randColor();
    var routePolyline = L.polyline(
        [latlngList],
        {
          "bubblingMouseEvents": true,
          "color": color,
          "dashArray": null,
          "dashOffset": null,
          "fill": false,
          "fillColor": color,
          "fillOpacity": 0.2,
          "fillRule": "evenodd",
          "lineCap": "round",
          "lineJoin": "round",
          "noClip": false,
          "opacity": 0.8,
          "smoothFactor": 1.0,
          "stroke": true,
          "weight": 2.5
        }
    ).addTo(group);

    latlngList.forEach(latlng => {
      L.circleMarker(
          latlng,
          {
            "bubblingMouseEvents": true,
            "color": color,
            "dashArray": null,
            "dashOffset": null,
            "fill": color,
            "fillColor": color,
            "fillOpacity": 1,
            "fillRule": "evenodd",
            "lineCap": "round",
            "lineJoin": "round",
            "opacity": 1.0,
            "radius": 5,
            "stroke": true,
            "weight": 3
          }
      ).addTo(layerMap);
    });
  });

  var layer_control_2854723a349d0ac3d2856dfbb6de07b1 = {
    base_layers: {"cartodbpositron": tile_layer_d1806875e6b4af507cfbaa92dc44527f,},
    overlays: calcOverlays
  };
  L.control.layers(
      layer_control_2854723a349d0ac3d2856dfbb6de07b1.base_layers,
      layer_control_2854723a349d0ac3d2856dfbb6de07b1.overlays,
      {
        position: 'topright',
        collapsed: true,
        autoZIndex: true
      }).addTo(layerMap);

  Object.keys(calcOverlays).forEach(key => calcOverlays[key].remove());
}
</script>

<template>
  <input type="file" id="csvFileInput" multiple accept=".csv" @change="processFiles"/>

  <div class="folium-map" id="layerMap"></div>
</template>

<style scoped>
#layerMap {
  position: relative;
  width: 1200.0px;
  height: 800.0px;
  left: 0.0%;
  top: 0.0%;
}
</style>
