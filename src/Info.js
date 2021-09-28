import React from "react";
import data_download from './data/data-download.json';
import { Table} from 'antd';

const Info = () =>{
    const filter = getFilter();
    const columns = [
        {
            title: "Region",
            key: 'region',
            dataIndex: "region",
            width:'40%',
            filters: filter,
            onFilter: (value, record) => record.region.indexOf(value) === 0,
        },
        {
            title: "Location",
            key: 'location',
            dataIndex: "location",
            width:'40%',
        },
        {
            title: "Avg. Download Throughput",
            key: 'throughput',
            dataIndex: "avg_download_throughput",
            defaultSortOrder: 'descend',
            width:'20%',
            sorter: (a, b) => a.avg_download_throughput - b.avg_download_throughput,
            render: (value) => value.toLocaleString('id-ID',{maximumFractionDigits: 2})
        }
    ];

    console.log(getFilter());
    return  <div>
                <Table columns={columns} dataSource={data_download} />
            </div>
}

function getFilter(){
    const regions = [];
    for(var i = 0; i < data_download.length; i++) {
        var obj = data_download[i].region;
        var hasMatch = false;
        for (var j = 0; j < regions.length; ++j) {
            
            if(obj === regions[j].text){
                hasMatch = true;
                break;
            }
        }
        if(!hasMatch){
            var newObj = {
                text: obj,
                value: obj
            }
            regions.push(newObj);
        }
    }
    return regions;
}
export default Info;