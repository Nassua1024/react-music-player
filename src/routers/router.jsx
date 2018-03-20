
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Greeter from '@/views/greeter';
import Hello from '@/views/hello';

const routeList = [
   {
        path: '/greeter',
        component: Greeter
    }, {
        path: '/hello',
        component: Hello
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