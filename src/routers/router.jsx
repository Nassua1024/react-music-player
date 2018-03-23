
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from '@/views/index';

const routeList = [
   {
        path: '/index',
        component: Index
    }
];

const routes = (
    <Switch>
        {
            routeList.map((item, index) => (
                <Route key={ index } path={ item.path } component= { item.component } />
            ))
        }
    </Switch>
)

export default routes;