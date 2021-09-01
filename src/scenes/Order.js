import React, { PureComponent } from 'react';
import { Tabs, Tab, Container } from 'native-base';
import { Actions } from 'react-native-router-flux';

import ListOrder from '../components/ListOrder';
import OrderListShared from '../shared/OrderList';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Order extends PureComponent {
    state = {
        user: "",
        role: ""
    }
    
    async componentDidMount() {
        const user = await AsyncStorage.getItem("user")
        const role = await AsyncStorage.getItem("role")
        if (!user) {
            Actions.reset('noauthmenus')
        }
        this.setState({ user, role })
    }

    render() {
        const { user, role } = this.state;
        return (
            <Container>
                {user &&
                role &&
                ['admin_pool', 'driver'].indexOf(role) < 0 ? (
                <Tabs initialPage={0} locked>
                    <Tab heading="Ongoing">
                    <OrderListShared
                        UiComponent={ListOrder}
                        listLimit={6}
                        listSort="-updatedAt"
                        listCheckType="ongoingOrder"
                        reload
                    />
                    </Tab>
                    <Tab heading="Join">
                    <OrderListShared
                        UiComponent={ListOrder}
                        listLimit={6}
                        listSort="pickupTime"
                        listCheckType="join"
                        reload
                    />
                    </Tab>
                </Tabs>
                ) : (
                <OrderListShared
                    UiComponent={ListOrder}
                    listLimit={6}
                    listSort="-updatedAt"
                    listCheckType="ongoingOrder"
                    reload
                />
                )}
            </Container>
        );
    }
}

export default Order;