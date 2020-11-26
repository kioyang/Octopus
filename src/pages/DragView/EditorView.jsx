import React from 'react';
import { Button, message } from 'antd';

import styles from './DragInView.css';
import EditorMap from '../config/EditorMap.js';

class DragInView extends React.Component {

    state = {
        loading: false,
    }

    saveLocal = (mergeConfig) => {
        const projects = JSON.parse(localStorage.getItem('projects'));
        const newProjects = [];
        for(let i = 0; i < projects.length; i++) {
            const project = projects[i];
            if(project.projectName === 'ReactPortal') {
                const pages = project.pages;
                const newPages = {};
                let newFlag = true;
                for(let x in pages) {
                    if(x === mergeConfig.flowKey) {
                        newPages[x] = {...pages[x],...mergeConfig,tableColumns: [...mergeConfig.tableColumns]};
                        newFlag = false;
                    } else {
                        newPages[x] = pages[x];
                    }
                }
                if(newFlag) {
                    newPages[mergeConfig.flowKey] = mergeConfig;
                }
                project.pages = newPages;
                newProjects.push(project);
            }
        }
        localStorage.setItem('projects', JSON.stringify(newProjects));
    }

    remoteApi = () => {
        const code = 'tableOut';
        const childRef = this.refs.tableOut;
        this.setState({ loading: true});
        childRef.dataTransfer().then((data) => {
            console.log(data, 'dataTransfer');
            if (data) {
                const { value } = data;
                console.log(value, 'childValue');
                const config = JSON.parse(localStorage.getItem('pageModel'));
                const cur = JSON.parse(localStorage.getItem('curProject'));
                const mergeConfig = Object.assign({},value, config, {baseDir: `${cur.projectDir}${cur.projectName}`,name: cur.projectName,tableColumns:value.tableColumns});
                this.saveLocal(mergeConfig, data);
                message.loading('同步中');
                fetch('/api/sp', { method: 'POST', body: JSON.stringify(mergeConfig)})
                .then((response) => response.json())
                .then((data) => {
                    console.log(data, 'data');
                    message.destroy();
                    message.success('同步完成');
                    this.setState({ loading: false});
                });
                return;
            } else{
                message.warning('请选择页面');
                return;
            }
        })

    }
    // 有一个接收的元素
    render() {
        const code = 'tableOut';
        const finds = EditorMap.find((item) => { return item.code === code});
        const Editor = finds ? finds.editor : () => { return <div>未找到响应编辑器</div>};
        return (<div className="dragInView">
              <Button onClick={this.remoteApi} type="primary">同步</Button>
            <Editor ref="tableOut"/>
        </div>);
    }
}

export default DragInView;