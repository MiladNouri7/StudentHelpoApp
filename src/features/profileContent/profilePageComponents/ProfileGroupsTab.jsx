import React, { useState } from 'react';
import { Card, Grid, Header, Tab, Image } from 'semantic-ui-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useFirestoreDocumentsColl from '../../../application/hooks/useFirestoreDocumentsColl';
import { getUserGroupQuerySelection } from '../../../application/firebase/firestoreService';
import { listenToUserGroups } from '../profileActions';


const ProfileGroupsTab = (props) => {

    const {profile} = props;
    const dispatch = useDispatch();
    const [activatedTab, setActiveTab] = useState(0);
    const {profileGroups} = useSelector(state => state.profile);
    const {loading} = useSelector(state => state.async);

    useFirestoreDocumentsColl({
        query: () => getUserGroupQuerySelection(activatedTab, profile.id),
        data: groups => dispatch(listenToUserGroups(groups)),
        deps: [dispatch, activatedTab, profile.id]
    });


    const groupOptions = [
        {menuItem: "Future Groups", pane: {key: "future"}},
        {menuItem: "Past Groups", pane: {key: "past"}},
        {menuItem: "Hosting", pane: {key: "hosting"}}
    ]
    return (
        <Tab.Pane loading={loading}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="calendar" content="groups"/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab 
                        onTabChange={(e, data) => setActiveTab(data.activeIndex)}
                        panes={groupOptions}
                        menu={{secondary: true, pointing: true}}
                    />
                    <Card.Group itemsPerRow={5} style={{marginTop: 10}}>
                        {profileGroups.map(group => (
                            <Card as={Link} to={`/groups/${group.id}`} key={group.id}>
                                <Image src={`/assets/categoryImages/${group.category}.jpg`} style={{minHeight: 100, objectFit: "cover"}}/>
                                <Card.Content>
                                    <Card.Header content={group.title} textAlign="center"/>
                                    <Card.Meta textAlign="center">
                                        <div>{format(group.date, "dd MMM yyyy")}</div>
                                        <div>{format(group.date, "hh:mm a")}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileGroupsTab;