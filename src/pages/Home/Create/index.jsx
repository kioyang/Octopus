import React from 'react';
import { Button, Modal, message, Form, Input, Select } from 'antd';

import {

    FileFilled
} from '@ant-design/icons';
import './index.less';

const formLayout = {
    wrapperCol: { span: 16 },
    labelCol: { span: 6 },
};

class Home extends React.Component {

    state = { visible: false, currentFolder: 'd:/' };

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            currentFolder: 'd:/'
        };
    }

    componentDidMount() {
        this.browseFolder(this.state.currentFolder);
    }

    browseFolder = (path) => {
        console.log(path);
        this.setState({ visible: true, currentFolder: path });
        this.form.setFieldsValue({
            projectDir: path
        });
        fetch('/api/directory', { method: 'POST', body: JSON.stringify({ path }) })
            .then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data, 'real data');
                this.setState({ directories: data });
            })
    }

    toTop = () => {
        const value = this.form.getFieldsValue();
        console.log(value, 'value')
        this.setState({
            currentFolder: value.projectDir,
        });
        this.form.setFieldsValue({
            projectDir: value.projectDir,
        });
        this.browseFolder(value.projectDir);
    }

    collectData = () => {
        return { ...this.form.getFieldsValue(), projectDir: this.state.currentFolder };
    }


    render() {
        const { directories = [], current, currentFolder = 'd:/' } = this.state;
        const views = directories.map((item, index) => {
            return (
                <li
                    key={`${item}-${index}`}
                    onClick={() => {
                        this.browseFolder(currentFolder + item + '/');
                    }}
                    style={{ cursor: 'pointer', textAlign: 'left' }}>
                    <FileFilled style={{ color: '#FFE793' }} />&nbsp;{item}
                </li>
            )
        });
        return (
            <div className="create" style={{ padding: '12px 24px' }}>
                <Form labelAlign="right" {...formLayout} ref={(el) => { this.form = el; }}>
                    <Form.Item
                        label="项目技术选型"
                        name="projectType"
                        initialValue="antProReact"
                    >
                        <Select>
                            <Select.Option value="antProReact">Ant Design Pro + React</Select.Option>
                            <Select.Option value="layui">layui</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="项目名"
                        name="projectName"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item initialValue={this.state.currentFolder} style={{ marginBottom: 0}} label="项目基础路径" name="projectDir">
                        <Input
                            addonAfter={<span
                                style={{ cursor: 'pointer'}}
                                onClick={this.toTop}
                            >跳转</span>} />
                    </Form.Item>
                    <Form.Item colon={false} style={{ marginTop: 0}} label=" ">
                    <ul>{views}</ul>
                    </Form.Item>
                </Form>
            </div >
        )
    }
}

export default Home;