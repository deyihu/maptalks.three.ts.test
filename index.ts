import * as maptalks from 'maptalks';
import * as THREE from 'three';
import { ThreeLayer } from 'maptalks.three.ts';

const map = (window as any).map = new maptalks.Map('map', {
    "center": [116.25931432100106, 39.82335790594166], "zoom": 9.794164345308731, "pitch": 60, "bearing": 0,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    })
});

map.on('click', e => {
    console.log(e.coordinate.toArray());
});

const layer = new maptalks.VectorLayer('vector', {
    zIndex: 2
});
map.addLayer(layer);

const marker = new maptalks.Marker(map.getCenter());
layer.addGeometry(marker);

const threeLayer = new ThreeLayer('threelayer', {
    forceRenderOnMoving: true,
    forceRenderOnRotating: true,
    forceRenderOnZooming: true
});
threeLayer.prepareToDraw = function (gl, scene, camera) {
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, -10, 10).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    // addBars(scene);
    addBar();

};
map.addLayer(threeLayer);

function addBar() {
    const lnglats = [
        [116.34924726472309, 40.46982317705309]
        , [116.96043054712891, 40.36812936912932]
        , [116.64803066723425, 40.67484763903232]
        , [115.99813748514089, 40.08041102756172]
        , [116.4981368554819, 39.901254960522664]
        , [116.39966833901383, 40.17574390161846]
        , [115.75957231022608, 39.756423327867566]
        , [116.42094077155593, 39.62092931322823]
    ];
    const material = new THREE.MeshPhongMaterial({ color: 'red' });
    const bars = lnglats.map(lnglat => {
        return threeLayer.toBox(lnglat, { height: 30000 * (1 + Math.random()), radius: 2000, topColor: '#fff' }, material);
    });
    threeLayer.addMesh(bars);
    addExturdePolygons();
}

function addExturdePolygons() {
    const material = new THREE.MeshPhongMaterial({ color: '#fff' });
    fetch('./beijing.geojson').then(res => res.json()).then(geojson => {
        geojson.features.forEach(f => {
            f.properties.height = 3000;
        });
        const extrudePolygon = threeLayer.toExtrudePolygons(geojson.features, { topColor: '#fff', asynchronous: false }, material);
        threeLayer.addMesh([extrudePolygon]);
    })
}