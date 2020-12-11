import React from 'react';
/**
 * 条码 打印 预约 区分不同
 */

import { FastBackwardOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import DragInView from '../DragView/DragInView.jsx';
import DragoutView from '../DragView/DragoutView.jsx';
import EditorView from '../DragView/EditorView.jsx';
import styles from './ProjectEdit.less';

class ProjectEdit extends React.Component {
    render() {
        const cur = JSON.parse(localStorage.getItem('curProject'));
        return (
            <main className="projectEdit">
                <section>
                <Button
                        onClick={() => {
                            location.href = "#/";
                        }}
                        type="primary">
                            返回
                  </Button>
                    <h1 style={{ textAlign: 'center', position: 'absolute', top: 4, left: '48vw' }}>项目名:{cur.projectName}</h1>
                </section>
                <section className="center">
                    <div className="drag" style={{display: 'none'}}>
                        <DragoutView />
                        <DragInView />
                    </div>
                    <div className="edit">
                        <EditorView />
                    </div>
                </section>
            </main>
        );
    }
}
export default ProjectEdit;