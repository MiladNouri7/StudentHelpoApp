import React from 'react';
import { useSelector } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import MyAccountComponent from '../../features/authentication/MyAccountComponent';
import GroupsMainPage from '../../features/groups/groupsMainPage/GroupsMainPage';
import GroupPage from '../../features/groups/groupPage/GroupPage';
import AppStartupPage from '../../features/home/AppStartupPage';
import GroupCreatationForm from '../../features/groups/groupForm/GroupCreatationForm';
import ModalHandler from '../utilities/modals/ModalHandler';
import UserProfileMainPage from '../../features/profileContent/profilePageComponents/UserProfileMainPage';
import Loading from './Loading';
import AppNavigationBar from '../../features/navigation/AppNavigationBar';
import Error from '../utilities/errors/ErrorHandler';
import AuthorisedOnlyRoute from './AuthorisedOnlyRoute';
import Feed from '../../features/feed/Feed';
import Main from '../../features/notes/Main';


const App = () => {
  const {key} = useLocation();
  const { initialized } = useSelector((state) => state.async);
  
  if(!initialized) return <Loading content="Loading app..."/>
  
  return (
    <>
      <ModalHandler />
      <ToastContainer position="bottom-right" hideProgressBar/>
      <Route exact path="/" component={AppStartupPage}/>
      <Route path={"/(.+)"} render={() => (
        <>
          <AppNavigationBar />
          <Container className="main">
            <Route exact path="/groups" component={GroupsMainPage}/>
            <Route exact path="/feeds" component={Feed}/>
            <Route path="/groups/:id" component={GroupPage}/>
            <AuthorisedOnlyRoute path={["/createGroup", "/manage/:id"]} component={GroupCreatationForm} key={key}/>
            <AuthorisedOnlyRoute path="/account" component={MyAccountComponent}/>
            <AuthorisedOnlyRoute path="/profile/:id" component={UserProfileMainPage}/>
            <Route path="/error" component={Error}/>
          </Container>
          <AuthorisedOnlyRoute path="/notes" component={Main}/>
        </>
      )}/>
    </>
  );
}


export default App;
