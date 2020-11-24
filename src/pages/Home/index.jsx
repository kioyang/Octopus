import React from 'react';
import { Button, Modal, message, Table, Spin, Tag,Select } from 'antd';
import ProjectCreate from './Create/index.jsx';
import ProjectImport from './Create/import.jsx';
import './index.less';
import { render } from 'mustache';
import Item from 'antd/lib/list/Item';

const data = [
    // { id: 1, projectName: '冷链在途跟踪' },
    // { id: 2, projectName: '物流管理' },
];

class Home extends React.Component {

    state = { visible: false, dataSource: JSON.parse(localStorage.getItem('projects')) || [] };

    get columns() {
        const columns = [
            {
                key: 'id',
                dataIndex: 'id',
                title: 'ID'
            },
            {
                key: 'projectName',
                dataIndex: 'projectName',
                title: '项目名'
            },
            {
                key: 'url',
                dataIndex: 'url',
                title: '运行地址',
                render: (text) => {
                    if (!text) {
                        return <Tag>尚未运行</Tag>
                    }
                    return (
                        <a href={`${text}`} target="_blank">{text}</a>
                    )
                }
            },
            {
                key: 'url',
                dataIndex: 'url',
                width: 120,
                title: '页面列表',
                render: (text) => {
                    const projects = JSON.parse(localStorage.getItem('projects'));
                    const project = projects[0];
                    const pages = project.pages || {};
                    const options = [];
                    for(let x in pages) {
                        const item = pages[x];
                        options.push( <Option value={item.flowKey}>{item.title}</Option>)
                    }
                    return <Select 
                    onChange={(value) => {
                        this.setState({
                            pageKey: value,
                        })
                    }}
                    style={{ width: '100%'}} name="page">
                        {options}
                    </Select>
                }
            },
            {
                key: 'operation',
                title: '操作',
                render: (text, record) => {
                    return (
                        <div>
                            <Button style={{ marginRight: 10 }} type="primary" onClick={() => { this.execInstall(record) }}>安装依赖</Button>
                            <Button style={{ marginRight: 10 }} type="primary" onClick={() => { this.execStart(record) }}>运行</Button>
                            <Button type="primary" onClick={() => {
                                localStorage.setItem('curProject', JSON.stringify(record));
                                const key = this.state.pageKey;
                                const curPage = record.pages && record.pages[key] || {};
                                localStorage.setItem('curPage', JSON.stringify(curPage));
                                location.href = '/#/edit';
                            }}>编辑</Button>
                        </div>
                    )
                }
            }
        ];
        return columns;
    }

    execInstall = (record) => {
        this.setState({ installLoading: true, tips: `正在为项目${record.projectName}安装依赖中,请稍后...` });
        fetch('/api/install', { method: 'POST', body: JSON.stringify(record) }).then(() => {
            this.setState({ installLoading: false });
            message.success("安装成功！");
        });
    }

    execStart = (record) => {
        this.setState({ startLoading: true, startTips: `正在启动项目${record.projectName},请稍后...` })
        fetch('/api/start', { method: 'POST', body: JSON.stringify(record) }).then(response => response.text()).then((data) => {
            this.setState({ startLoading: false });
            const { dataSource } = this.state;
            const newSource = dataSource && dataSource.map((item) => {
                if (item.projectName === record.projectName) {
                    console.log
                    return { ...record, url: data.substring(data.indexOf('Network: ') + 9, data.length) };
                }
                return item;
            });
            this.setState({ dataSource: newSource });
            message.success("项目启动成功");
        });
    }

    init = () => {
        this.setState({ loading: true });
        message.loading('项目初始化...');
        console.log(this.refs.pCreate, 'pCreate');
        const data = this.refs.pCreate.collectData();
        console.log(data, '项目创建信息')
        fetch('/api/init', { method: 'POST', body: JSON.stringify(data) }).then(() => {
            this.setState({ loading: false, visible: false });
            message.success('项目新建成功');
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects.push({ id: projects.length + 1, ...data });
            localStorage.setItem('projects', JSON.stringify(projects));
            this.setState({
                dataSource: projects,
            });
        });
    }

    import = () => {
        this.setState({ loading: true });
        console.log(this.refs.pCreate, 'pCreate');
        const data = this.refs.pImport.collectData();
        this.setState({ loading: false, importVisible: false });
        const { projectDir } = data;
        const noSlash = projectDir.substring(0, projectDir.length - 1);
        // noSlash: d:/OctopusProject/Test1
        console.log('withOUt', noSlash);
        const projectName = noSlash.substring(noSlash.lastIndexOf('/') + 1, projectDir.length);
        const baseDir = projectDir.replace(projectName + '/', '');
        const value = { ...data, projectName, projectDir: baseDir };
        console.log('projectName', projectName);
        console.log('----------------------------');
        console.log('baseDir', baseDir);
        console.log('----------------------------');
        console.log('projectDir', projectDir);
        message.success('项目导入成功');
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.push({ id: projects.length + 1, ...value });
        localStorage.setItem('projects', JSON.stringify(projects));
        this.setState({
            dataSource: projects,
        });
    }

    render() {
        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.init}
                    okButtonProps={{ loading: this.state.loading }}
                    okText="在此创建项目"
                    onCancel={() => {
                        this.setState({
                            visible: false,
                        });
                    }}
                >
                    <ProjectCreate ref="pCreate" />
                </Modal>

                <Modal
                    visible={this.state.importVisible}
                    onOk={this.import}
                    okButtonProps={{ loading: this.state.loading }}
                    okText="在此导入项目"
                    onCancel={() => {
                        this.setState({
                            importVisible: false,
                        });
                    }}
                >
                    <ProjectImport ref="pImport" />
                </Modal>
                <Modal
                    footer={null}
                    closable={false}
                    visible={this.state.installLoading}
                >
                    <div style={{ padding: 24 }}>
                        {this.state.tips}...&nbsp;<Spin loading />
                    </div>
                </Modal>
                <Modal
                    footer={null}
                    closable={false}
                    visible={this.state.startLoading}
                >
                    <div style={{ padding: 24 }}>
                        {this.state.startTips}...&nbsp;<Spin loading />
                    </div>
                </Modal>
                <input
                    onClick={() => {
                        this.setState({
                            visible: true,
                        });
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#fff',
                        outline: 'none',
                        border: 'none',
                        backgroundColor: '#42B983',
                        padding: '8px 14px',
                        margin: 24
                    }}
                    type="button" value="新建项目"
                />

                <input
                    onClick={() => {
                        this.setState({
                            importVisible: true,
                        });
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#fff',
                        outline: 'none',
                        border: 'none',
                        backgroundColor: '#42B983',
                        padding: '8px 14px',
                        margin: 24
                    }}
                    type="button" value="导入项目"
                />

                <input
                    onClick={() => {
                        localStorage.clear();
                        this.setState({ dataSource: [] })
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#fff',
                        outline: 'none',
                        border: 'none',
                        backgroundColor: '#42B983',
                        padding: '8px 14px',
                        margin: 24
                    }}
                    type="button" value="清空项目"
                />

                <div style={{ margin: 48 }}>
                    <Table
                        rowKey="id"
                        showHeader
                        dataSource={this.state.dataSource}
                        columns={this.columns}
                    />
                </div>
            </div>

        )
    }
}

export default Home;