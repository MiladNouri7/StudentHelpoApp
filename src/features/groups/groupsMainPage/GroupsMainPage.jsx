import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import GroupList from './GroupList';
import { useDispatch, useSelector } from 'react-redux';
import GroupPlaceholder from './GroupPlaceholder';
import GroupsFilter from './GroupsFilter';
import { listenToGroupsDataFromFs } from '../../../application/firebase/firestoreService';
import { listenToGroups } from '../groupActions';
import useFirestoreDocumentsColl from '../../../application/hooks/useFirestoreDocumentsColl';


const GroupsMainPage = () => {

    const dispatch = useDispatch();
    const {groups} = useSelector(state => state.group);
    const { loading } = useSelector(state => state.async);
    const [predicate, setPredicate] = useState(new Map([
        ["startDate", new Date()],
        ["filter", "all"]
    ]));

    const handleSetPredicate = (key, value) => {
        setPredicate(new Map(predicate.set(key, value)));
    }

    useFirestoreDocumentsColl({
        query: () => listenToGroupsDataFromFs(predicate),
        data: groups => dispatch(listenToGroups(groups)),
        deps: [dispatch, predicate],
    })

    return (
        <Grid>
            <Grid.Column width={10}>
            {loading && 
              <>
                 <GroupPlaceholder /> 
                 <GroupPlaceholder /> 
              </>
            }
            <GroupList groups={groups}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <GroupsFilter predicate={predicate} setPredicate={handleSetPredicate} loading={loading}/>
            </Grid.Column>
        </Grid>
    );
}

export default GroupsMainPage;