import React from 'react';
import Map from './Map';
import Info from './Info';
import './App.css';
import { Layout, Menu } from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function App() {
    const { Header, Content, Footer } = Layout;
    return (
        <Router>
            <div className="App">
                <Layout className="layout">
                    <Header>
                        <div className="logo" />
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to="/">Map</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/info">Info</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '0 50px' }}>
                        <div className="site-layout-content">
                            <Switch>
                                <Route path="/info">
                                    <Info />
                                </Route>
                                <Route path="/">
                                    <Map />
                                </Route>
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>
                </Layout>
            </div>
        </Router>
    );
}
export default App;