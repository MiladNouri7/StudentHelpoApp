import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { getUserFollowers, getUserFollowings } from "../../../application/firebase/firestoreService";
import useFirestoreDocumentsColl from "../../../application/hooks/useFirestoreDocumentsColl";
import { listenToFollowers, listenToFollowings } from "../profileActions";
import ThumbNailCard from "./ThumbNailCard";

const UserFollowingTab = (props) => {

  const { profile, activatedTab } = props;
  const dispatch = useDispatch();
  const { followings, followers } = useSelector((state) => state.profile);

  useFirestoreDocumentsColl({
    query:
      activatedTab === 3
        ? () => getUserFollowers(profile.id)
        : () => getUserFollowings(profile.id),
    data: (data) =>
      activatedTab === 3
        ? dispatch(listenToFollowers(data))
        : dispatch(listenToFollowings(data)),
    deps: [activatedTab, dispatch],
  });

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={activatedTab === 3 ? "Followers" : "Following"} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
          {activatedTab === 3 && followers.map(profile => (
              <ThumbNailCard profile={profile} key={profile.id}/>
          ))}
          {activatedTab === 4 && followings.map(profile => (
              <ThumbNailCard profile={profile} key={profile.id}/>
          ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

export default UserFollowingTab;
