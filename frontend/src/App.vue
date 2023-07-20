<script setup lang="ts">
import {onMounted, reactive} from "vue";

async function fetchCsvData() {
  const response = await fetch("/api/csvdata");
  return await response.json();
}
function randColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

onMounted(async () => {
  // 서버의 csv gps 목록 불러오기
  const gpsRouteList = await fetchCsvData();

  
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


  const groupState = reactive([]);
  gpsRouteList.forEach((route, routeIdx) => {
    const group = L.featureGroup().addTo(layerMap);
    groupState.push(group);

    const latlngList = route.map((data: { index: number, lat: number, lng: number }[]) => [data.lat, data.lng]);
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
    overlays: groupState.reduce((acc, cur, currentIndex) => {
      Object.assign(acc, {
        [`Route ${currentIndex}`]: cur
      })
      return acc;
    }, {})
  };
  L.control.layers(
      layer_control_2854723a349d0ac3d2856dfbb6de07b1.base_layers,
      layer_control_2854723a349d0ac3d2856dfbb6de07b1.overlays,
      {
        position: 'topright',
        collapsed: true,
        autoZIndex: true
      }).addTo(layerMap);

  groupState.forEach((group: any) => group.remove());
});
</script>

<template>
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
