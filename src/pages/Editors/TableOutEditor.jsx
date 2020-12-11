import React from 'react';
import { Form, Input, Collapse, Switch, Button, Result, message, Tabs } from 'antd';

const { Panel } = Collapse;
const { TabPane } = Tabs;
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
        detailColumns: localStorage.getItem('curPage') && localStorage.getItem('curPage') !== 'undefined' ? JSON.parse(localStorage.getItem('curPage')).detailColumns || [] : [], // 表格列的数量
        editColumns: localStorage.getItem('curPage') && localStorage.getItem('curPage') !== 'undefined' ? JSON.parse(localStorage.getItem('curPage')).editColumns || [] : [], // 表格列的数量
    };

    seperateToArray = (value) => {
        const { columns } = this.state;

        const keys = Object.keys(value);
        const result = [];
        keys.map((item, index) => {
            const [vKey, vIndex] = item && item.split('-');
            console.log(vKey, vIndex, 'key:index', index);
            if (item.includes('LiuName-') && value[item] && value[item].trim()) {
                result.push({
                    key: value[item.replace('LiuName', '')], keyName: value[item],
                    isInTable: value[item.replace('LiuName', 'ShowInTable')],
                    isInForm: value[item.replace('LiuName', 'ShowInForm')],
                    isInSearch: value[item.replace('LiuName', 'ShowInSearch')],
                    type: value[item.replace('LiuName', 'Type')],
                    itemType: value[item.replace('LiuName', 'ItemType')],
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
                const arrayConfig = this.seperateToArray(value) || [];
                const tableColumns = [];
                const detailColumns = [];
                const editColumns = [];
                console.log(arrayConfig,'tadd')
                for(let i = 0; i < arrayConfig.length;i++) {
                    const item = arrayConfig[i];
                    if(item.itemType === 'edit') {
                        editColumns.push(item);
                    }
                    if(item.itemType === 'detail') {
                        detailColumns.push(item);
                    }
                    if(!item.itemType) {
                        tableColumns.push(item);
                    }
                 }
                result = { ...totalConfig, tableColumns: tableColumns,editColumns,detailColumns };
                resolve({ isValid, value: result });
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
        newColumns.push({ key: 'column' });
        this.setState({
            columns: newColumns,
        });
    }

    addDetail = () => {
        const { detailColumns } = this.state;
        const newColumns = [...detailColumns];
        newColumns.push({ key: 'column' });
        this.setState({
            detailColumns: newColumns,
        });
    }

    addEdit = () => {
        const { editColumns } = this.state;
        const newColumns = [...editColumns];
        newColumns.push({ key: 'column' });
        this.setState({
            editColumns: newColumns,
        });
    }

    render() {
        const { columns,detailColumns = [],editColumns = [] } = this.state;
        const curPage = localStorage.getItem('curPage') && localStorage.getItem('curPage') !== 'undefined' ? JSON.parse(localStorage.getItem('curPage')) : {};
        const panels = columns.map((item, index) => {
            const { key } = item;
            return (
                <Panel forceRender header={`列${index + 1}`}>
                    <Form.Item
                        label="key"
                        name={`${key}-${index}`}
                        initialValue={item.key && item.key.trim()}
                        rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="name"
                        name={`${key}LiuName-${index}`}
                        initialValue={item.keyName && item.keyName.trim()}
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
                        initialValue={item.type && item.type.trim()}
                        rules={[{ required: false, message: '请填写文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Panel>
            );
        });
        const detailPanels = detailColumns.map((item, index) => {
            const { key } = item;
            return (
                <Panel forceRender header={`列${index + 1}`}>
                    <Form.Item
                        label="key"
                        name={`${key}-${index}Detail`}
                        initialValue={item.key && item.key.trim()}
                        rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="所属页面"
                        name={`${key}ItemType-${index}Detail`}
                        initialValue='detail'
                        rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    >
                        <Input value="detail" disabled />
                    </Form.Item>
                    <Form.Item
                        label="name"
                        name={`${key}LiuName-${index}Detail`}
                        initialValue={item.keyName && item.keyName.trim()}
                        rules={[{ required: true, message: '请填写flowKey!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="是否显示在表格中"
                        name={`${key}ShowInTable-${index}Detail`}
                        rules={[{ required: false, message: '请填写文件夹名称!' }]}
                        initialValue={item.isInTable}
                    >
                        <Switch defaultChecked={item.isInTable} />
                    </Form.Item>
                    <Form.Item
                        label="是否显示在表单中"
                        name={`${key}ShowInForm-${index}Detail`}
                        initialValue={item.isInForm}
                        rules={[{ required: false, message: '请填写文件夹名称!' }]}
                    >
                        <Switch defaultChecked={item.isInForm} />
                    </Form.Item>
                    <Form.Item
                        label="是否显示在搜索框"
                        name={`${key}ShowInSearch-${index}Detail`}
                        initialValue={item.isInSearch}
                        rules={[{ required: false, message: '请填写文件夹名称!' }]}
                    >
                        <Switch defaultChecked={item.isInSearch} />
                    </Form.Item>
                    <Form.Item
                        label="类型"
                        name={`${key}Type-${index}Detail`}
                        initialValue={item.type && item.type.trim()}
                        rules={[{ required: false, message: '请填写文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Panel>
            );
        });
        const editPanels = editColumns.map((item, index) => {
            const { key } = item;
            return (
                <Panel forceRender header={`列${index + 1}`}>
                         <Form.Item
                        label="所属页面"
                        name={`${key}ItemType-${index}`}
                        initialValue='edit'
                        rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    >
                        <Input value="edit" />
                    </Form.Item>
                    <Form.Item
                        label="key"
                        name={`${key}-${index}`}
                        initialValue={item.key && item.key.trim()}
                        rules={[{ required: true, message: '请填写文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="name"
                        name={`${key}LiuName-${index}`}
                        initialValue={item.keyName && item.keyName.trim()}
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
                        initialValue={item.type && item.type.trim()}
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
                <Tabs>
                    <TabPane forceRender tab="父表" key="0">
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
                        <Form.Item
                            label="删除地址"
                            name="deleteUrl"
                            rules={[{ required: true, message: '请填写id!' }]}
                            initialValue={curPage.deleteUrl}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="详情地址"
                            name="detailUrl"
                            rules={[{ required: true, message: '请填写id!' }]}
                            initialValue={curPage.detailUrl}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="编辑地址"
                            name="editUrl"
                            rules={[{ required: true, message: '请填写id!' }]}
                            initialValue={curPage.editUrl}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="父路由"
                            name="parentRoute"
                            rules={[{ required: true, message: '请填写id!' }]}
                            initialValue={curPage.parentRoute}
                        >
                            <Input />
                        </Form.Item>
                    </TabPane>
                    <TabPane forceRender tab="主表" key="1">
                        <div style={{ height: 524, overflow: 'auto', position: 'relative' }}>
                            <Button style={{ position: 'absolute', top: 0, right: 0, zIndex: 101 }} type="primary" onClick={this.add}>增加一列</Button>
                            <Collapse defaultActiveKey={'1'} bordered={false}>
                                {panels}
                            </Collapse>
                        </div>
                    </TabPane>
                    <TabPane forceRender tab="详情" key="2">
                        <div style={{ height: 524, overflow: 'auto', position: 'relative' }}>
                            <Button style={{ position: 'absolute', top: 0, right: 0, zIndex: 101 }} type="primary" onClick={this.addDetail}>增加详情列</Button>
                            <Collapse defaultActiveKey={'1'} bordered={false}>
                                {detailPanels}
                            </Collapse>
                        </div>
                    </TabPane>
                    <TabPane forceRender tab="编辑" key="3">
                        <div style={{ height: 524, overflow: 'auto', position: 'relative' }}>
                            <Button style={{ position: 'absolute', top: 0, right: 0, zIndex: 101 }} type="primary" onClick={this.addEdit}>增加编辑列</Button>
                            <Collapse defaultActiveKey={'1'} bordered={false}>
                                {editPanels}
                            </Collapse>
                        </div>
                    </TabPane>
                </Tabs>
            </Form>
        )
    }
}

export default TableOut;