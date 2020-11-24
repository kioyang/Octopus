import React from 'react';
import { connect } from 'react-redux';

import './DragInView.css';
import FreeSortable from './FreeSortable.js';

class DragInView extends React.Component {
    
 
    // drop保存相应页面生成的配置数据
    drop = (ev) => {
        const code = ev.dataTransfer.getData('code');
        // 调用接口 执行文件生成命令
         // 属性编辑 传递配置 生成配置化控件
         const config = { code };
         const { dispatch } = this.props;
         dispatch({
             type: 'saveConfig',
             payload: config,
         });
         // 先预先存储数据
         localStorage.setItem('pageModel', JSON.stringify(config));
    }
    
    // 有一个接收的元素
    render() {
        return (
        <div onDragOver={(ev) => { ev.preventDefault();}} onDrop={this.drop} className="dragInView">
            <FreeSortable />
        </div>);
    }
}

export default connect(
    (state) => {
        console.log(state, 'state');
        return {
            ...state,
        }
    }
)(DragInView);