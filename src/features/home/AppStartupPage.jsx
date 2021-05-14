import React from 'react';
import { Container, Header, Segment, Image, Button, Icon} from 'semantic-ui-react';


const AppStartupPage = (props) => {
    const {history} = props;
    return(
        <Segment inverted textAlign="center" vertical className='masthead'>
            <Container>
                <Header as="h1" inverted>
                    <Image size="massive" src="/assets/logo.png" style={{marginBottom: 12}}/>
                    StudentHelpo
                </Header>
                <Button onClick={() => history.push("/feeds")} size="huge" inverted>
                    Start Moving
                    <Icon name="right arrow" inverted/>
                </Button>
            </Container>
        </Segment>
    )
}

export default AppStartupPage;






