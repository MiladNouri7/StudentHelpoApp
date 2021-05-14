import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { listenToGroupDataFromFs } from '../../../application/firebase/firestoreService';
import useFirestoreDocument from '../../../application/hooks/useFirestoreDocument';
import { listenToGroups } from '../groupActions';
import GroupCommentsChat from './GroupCommentsChat';
import GroupHeader from './GroupHeader';
import GroupInfo from './GroupInfo';
import GroupSidebar from './GroupSidebar';
import Loading from '../../../application/layout/Loading';
import { Redirect } from 'react-router-dom';


const GroupPage = (props) => {
    const {match} = props;
    const dispatch = useDispatch();
    const {currentUser} = useSelector(state => state.auth);
    const group = useSelector(state => state.group.groups.find(e => e.id === match.params.id));
    const {loading, error} = useSelector((state) => state.async);
    const isGroupHost = group?.hostId === currentUser?.uid;
    const isJoining = group?.attendees?.some(a => a.id === currentUser?.uid);

    useFirestoreDocument({
        query: () => listenToGroupDataFromFs(match.params.id),
        data: group => dispatch(listenToGroups([group])),
        deps: [match.params.id, dispatch],
    });

    if(loading || (!group && !error)) return <Loading content="loading group..." />
    
    if(error) return <Redirect to="/error"/>

    return(
        <Grid>
            <Grid.Column width={10}>
                <GroupHeader group={group} isJoining={isJoining} isGroupHost={isGroupHost}/>
                <GroupInfo group={group}/>
                <GroupCommentsChat groupId={group.id}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <GroupSidebar attendees={group?.attendees} hostId={group.hostId}/>
            </Grid.Column>
        </Grid>
    )
}

export default GroupPage;