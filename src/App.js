import React from 'react';
import Map from './Map';
import './App.css';
import { Layout, Menu } from 'antd';

function App() {
    const { Header, Content, Footer } = Layout;
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
                        <Map />
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