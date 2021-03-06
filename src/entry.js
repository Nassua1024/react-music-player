
import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import routes from '@/routers/router';
import '@/utils/flexible';

render (
    <AppContainer>
        <Router children ={ routes } />
    </AppContainer>,
    document.getElementById('root')
);