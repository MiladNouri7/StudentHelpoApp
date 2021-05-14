import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Header, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Error = () => {
    const {error} = useSelector(state => state.async);

    return (
        <Segment placeholder>
            <Header textAlign="center" content={error?.message || "Oops - there is an error"}/>
            <Button as={Link} to="/feeds" primary style={{marginTop: 20}} content="Return to feeds page"/>
        </Segment>
    )
}

export default Error;