import React from 'react';
import './DragoutView.less';

import DragoutMap from '../config/DragoutMap.js';

console.log(DragoutMap, 'DragoutMap');

class DragInView extends React.Component {

    dragStart = (ev, item) => {
        console.log(item);
        ev.dataTransfer.setData('code', item.code);
    }
    // 有一个接收的元素
    render() {
        const outViews = DragoutMap && DragoutMap.map((item) => {
            return <li className="outBtn" draggable onDragStart={(ev) => { this.dragStart(ev, item);}} key={item.key}><item.outView key={item.key} /></li>;
        });
        console.log(outViews, 'outViews')
        return (
            <ul className="dragoutView">
                {outViews}
            </ul>
        );
    }
}

export default DragInView;