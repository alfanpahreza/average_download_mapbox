import React, { useRef, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import data_download from './data/data-download.json';
import data_kabupaten from './data/kabupaten.geojson';
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxmYW5wayIsImEiOiJja3Q3dzk3d3cwd2Z4MnBvN2VoNjl5dHloIn0.9Io9o4cQ6EZKiphh8Kjybw';

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(116.1872); //x axis
    const [lat, setLat] = useState(-1.4611); //y axis
    const [zoom, setZoom] = useState(4.16); //zoom
    const { Header, Content, Footer } = Layout;
    const layers = [
        '0-5,000',
        '5,000-10,000',
        '10,000-15,000',
        '15,000+',
    ];
    const colors = [
        '#FFEBEE',
        '#FFCDD2',
        '#EF5350',
        '#B71C1C',
        'orange'
    ];
    const matchExpression = ['match', ['string', ['get', 'KABUPATEN']]];
    const bounds = [
        [90, -15],
        [145, 10]
    ];
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11?optimize=true', //optimize=true
            center: [lng, lat],
            zoom: zoom,
            maxBounds:bounds,
        }); 

       for (const row of data_download) {
            let avg = row['avg_download_throughput'];
            let color = colors[0]; //0 - 5000
            if(avg == null){
                color = colors[4];
            }else if (avg > 5000 && avg <= 10000) {
                color = colors[1];
            } else if (avg > 10000 && avg <= 15000) {
                color = colors[2];
            } else if (avg > 15000) {
                color = colors[3];
            }
            matchExpression.push(row['location'], color);
        }
        matchExpression.push(colors[4]); //fallback

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
        if (!map.current) return; // wait for map to initialize
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
                    'fill-opacity': 0.8,
                    'fill-outline-color': '#000'
                }
            });
        })

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });

        map.current.on('mousemove', 'location', (e) => {
            map.current.getCanvas().style.cursor = 'pointer';
            const location = e.features[0].properties.KABUPATEN;
            const region = e.features[0].properties.REGION;
            const data = data_download.filter((n)=>n.location===location?n.avg_download_throughput:null);
            let avg = typeof data[0]!=='undefined'?data[0].avg_download_throughput:'No Data';
            const description =  
            `<h2><strong>${location.toLowerCase()}</strong></h2>
            <h3>${region.toLowerCase()}</h3>
            <p>
                <em>
                    <strong>Average Download: ${avg.toLocaleString('id-ID',{maximumFractionDigits: 2})}
                    </strong> 
                </em>
            </p>`;
            popup.setLngLat(e.lngLat).setHTML(description).addTo(map.current);
        });

        map.current.on('mouseleave', 'location', ()=>{
            map.current.getCanvas().style.cursor = '';
            popup.remove();
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