
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './greeter.less';

class Greeter extends React.Component {
    render() {
        return (
            <Link to="/hello" className="hello">Greeter aaaaa !!!</Link>
        )
    }
}

export default Greeter;