import React from 'react';
import { Form, Input, Collapse, Switch, Button, Result, message } from 'antd';

const { Panel } = Collapse;
const moduleDefaultConfig = {
    columns: [
        { key: 'id', title: 'ID' },
        { key: 'content', title: '内容' },
        { key: 'updateTime', title: '更新时间' },
    ]
}


class TableOut extends React.Component {
    state = {
        initialValues: {},
        columns: localStorage.getItem('curPage') && localStorage.getItem('curPage') !== 'undefined' ? JSON.parse(localStorage.getItem('curPage')).tableColumns || [] : [], // 表格列的数量
 };

    seperateToArray = (value) => {
        const { columns } = this.state;
        const keys = Object.keys(value);
        const result = [];
        keys.map((item, index) => {
            const [vKey, vIndex] = item && item.split('-');
            console.log(vKey, vIndex, 'key:index', index);
            if (item.includes('Name-') && value[item] && value[item].trim()) {
                console.log(item, 'item');
                result.push({ key: value[item.replace('Name', '')], keyName: value[item],
                isInTable: value[item.replace('Name', 'ShowInTable')],
                isInForm: value[item.replace('Name', 'ShowInForm')],
                isInSearch: value[item.replace('Name', 'ShowInSearch')],
                type: value[item.replace('Name', 'Type')],
            });
            }
        });
        return result;
    }
    // 有一个接收的元素
    // 将分散的数据组装成数组
    dataTransfer = () => {
        let result = {};
        let isValid = false;
        return new Promise((resolve, reject) => {
            this.form.validateFields().then((value) => {
                const totalConfig = value;
                const arrayConfig = this.seperateToArray(value);
                result = {...totalConfig, tableColumns: arrayConfig};
                resolve({isValid, value: result});
            })
            .catch((err) => {
                console.log(err);
                message.warning('请完善页面信息');
                reject();
            })
        });
    }

    add = () => {
        const { columns } = this.state;
        const newColumns = [...columns];
        newColumns.push({key: 'column'});
        this.setState({
            columns: newColumns,
        });
    }

    render() {
        const { columns } = this.state;
        const curPage = localStorage.getItem('curPage') && localStorage.getItem('curPage') !== 'undefined' ? JSON.parse(localStorage.getItem('curPage')) : {};
        const panels = columns.map((item, index) => {
            const { key } = item;
            return (
                <Panel forceRender header={`列${index + 1}`}>
                      <Form.Item
                    label="key"
                    name={`${key}-${index}`}
                    initialValue={item.key}
                    rules={[{ required: true, message: '请填写文件夹名称!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="name"
                    name={`${key}Name-${index}`}
                    initialValue={item.keyName}
                    rules={[{ required: true, message: '请填写flowKey!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="是否显示在表格中"
                    name={`${key}ShowInTable-${index}`}
                    rules={[{ required: false, message: '请填写文件夹名称!' }]}
                    initialValue={item.isInTable}
                >
                    <Switch defaultChecked={item.isInTable} />
                </Form.Item>
                <Form.Item
                    label="是否显示在表单中"
                    name={`${key}ShowInForm-${index}`}
                    initialValue={item.isInForm}
                    rules={[{ required: false, message: '请填写文件夹名称!' }]}
                >
                    <Switch defaultChecked={item.isInForm} />
                </Form.Item>
                <Form.Item
                    label="是否显示在搜索框"
                    name={`${key}ShowInSearch-${index}`}
                    initialValue={item.isInSearch}
                    rules={[{ required: false, message: '请填写文件夹名称!' }]}
                >
                    <Switch defaultChecked={item.isInSearch} />
                </Form.Item>
                <Form.Item
                    label="类型"
                    name={`${key}Type-${index}`}
                    initialValue={item.type}
                    rules={[{ required: false, message: '请填写文件夹名称!' }]}
                >
                    <Input />
                </Form.Item>
                </Panel>
            );
        });
        return (
            <Form ref={(el) => {
                this.form = el;
            }} initialValues={this.state.initialValues}>
                <Form.Item
                    label="文件夹名称"
                    name="dirName"
                    rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    initialValue={curPage.dirName}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="flowKey"
                    name="flowKey"
                    rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    initialValue={curPage.flowKey}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="表格标题"
                    name="title"
                    rules={[{ required: true, message: '请填写id!' }]}
                    initialValue={curPage.title}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="get地址"
                    name="apiUrl"
                    rules={[{ required: true, message: '请填写id!' }]}
                    initialValue={curPage.apiUrl}
                >
                    <Input />
                </Form.Item>

                <div style={{ height: 524, overflow: 'auto', position: 'relative'}}>
              <Button style={{ position: 'absolute', top: 0,right: 0,zIndex: 101}} type="primary" onClick={this.add}>增加一列</Button>
              <Collapse defaultActiveKey={'1'} bordered={false}>
                {panels}
              </Collapse>
            </div>
            </Form>
        )
    }
}

export default TableOut;