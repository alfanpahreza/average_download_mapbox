import React, { useRef, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import data_download from './data/data-download.json';
import data_kabupaten from './data/kabupaten.geojson';
 
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxmYW5wayIsImEiOiJja3Q3dzk3d3cwd2Z4MnBvN2VoNjl5dHloIn0.9Io9o4cQ6EZKiphh8Kjybw';
function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(116.1872); //x axis
    const [lat, setLat] = useState(-1.4611); //y axis
    const [zoom, setZoom] = useState(4.16); //zoom

    const { Header, Content, Footer } = Layout;

    const layers = [
        '0-5000',
        '5000-10000',
        '10000-15000',
        '15000+',
    ];

    const colors = [
        '#FFEBEE',
        '#FFCDD2',
        '#EF5350',
        '#B71C1C'
    ];
    const matchExpression = ['match', ['string', ['get', 'KABUPATEN']]];
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-day-v1?optimize=true', //optimize=true
            center: [lng, lat],
            zoom: zoom
        }); 

       for (const row of data_download) {
            let avg = row['avg_download_throughput'];
            let color = colors[0]; //0 - 5000
            if (avg > 5000 && avg <= 10000) {
                color = colors[1];
            } else if (avg > 10000 && avg <= 15000) {
                color = colors[2];
            } else if (avg > 15000) {
                color = colors[3];
            }
            matchExpression.push(row['location'], color);
        }
        matchExpression.push(colors[0]); //fallback

        map.current.on('load', () => { //when map loads

            map.current.addSource(
                'kabupaten',{
                'type': 'geojson',
                'data': data_kabupaten,
                }
            )

            map.current.addLayer({
                'id': 'location',
                'type': 'fill',
                'source': 'kabupaten', // reference the data source
                'paint': {
                    'fill-color': matchExpression,
                    'fill-outline-color': '#FFF'
                }
            });
        })

        // create legend
        const legend = document.getElementById('legend');

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });

    useEffect(() => {
        if (!map.current) return;
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    useEffect(()=>{   
        if (!map.current) return;
        map.current.on('mouseenter','location', () =>{
            map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mousemove', (e) =>{ //lag klo map di zoom, bisa diganti ke click
            const feature = map.current.queryRenderedFeatures(e.point);
            const lokasi = feature[0];
            if(typeof lokasi !== 'undefined'){
                if(lokasi.source === 'kabupaten'){
                    const nama = lokasi.properties.KABUPATEN;
                    const data = data_download.filter((n)=>n.location===nama?n.avg_download_throughput:null);
                    let avg = 0;
                    if(typeof data[0] !== 'undefined'){
                        avg = data?data[0].avg_download_throughput:0;
                    }
                    document.getElementById('pd').innerHTML =  `<h3><strong>${nama} </strong></h3>
                    <p><em><strong>${avg.toLocaleString(undefined,{maximumFractionDigits: 2})}</strong> Downloads</em></p>`;
                }else{
                    document.getElementById('pd').innerHTML = `<p>Hover ke salah satu daerah!</p>`; 
                };
            }
        });

        map.current.on('mouseleave', 'location', ()=>{
            map.current.getCanvas().style.cursor = '';
        });
    })

    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        Map
                    </Menu.Item>
                    <Menu.Item key="2">
                        Info
                    </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <div className="sidebar">
                            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                        </div>
                        <div ref={mapContainer} id='map'></div>
                        <div className='map-overlay' id='features'>
                            <h2>Average Download per Kabupaten</h2>
                            <div id='pd'>
                                <p>Hover ke salah satu daerah!</p>
                            </div>
                        </div>
                        <div className='map-overlay' id='legend'></div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        </div>
    );
}

export default App;