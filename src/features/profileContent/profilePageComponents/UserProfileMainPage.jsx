import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ProfileInfoSection from './ProfileInfoSection';
import ProfilePageHeader from './ProfilePageHeader';
import userFirebaseDoc from '../../../application/hooks/useFirestoreDocument';
import { getUserProfile } from '../../../application/firebase/firestoreService';
import { listenToSelectedUserProfile } from '../profileActions';
import Loading from '../../../application/layout/Loading';

const UserProfileMainPage = (props) => {

    const {match} = props;
    const dispatch = useDispatch();
    const { selectedUserProfile } = useSelector((state) => state.profile);
    const { currentUser } = useSelector(state => state.auth);
    const { loading, error } = useSelector((state) => state.async);

    userFirebaseDoc({
        query: () => getUserProfile(match.params.id),
        data: profile => dispatch(listenToSelectedUserProfile(profile)),
        deps: [dispatch, match.params.id]
    })

    if((loading && !selectedUserProfile) || (!selectedUserProfile && !error)) return <Loading content="Loading profile..." />

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfilePageHeader profile={selectedUserProfile} 
                isCurrentUser={currentUser.uid === selectedUserProfile.id}/>
                <ProfileInfoSection profile={selectedUserProfile} isCurrentUser={currentUser.uid === selectedUserProfile.id}/>
            </Grid.Column>
        </Grid>
    )
}

export default UserProfileMainPage;