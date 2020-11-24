import React from 'react';
import { Link } from 'react-router-dom';

import './MenuLayout.less';

class MenuLayout extends React.Component {
    render() {
        return (
            <div className="menuLayout">
                {this.props.children}
            </div>
        )
    }
}

export default MenuLayout;