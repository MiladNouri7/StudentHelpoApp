import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Loading = (prop) => {
    const {inverted = true, content = "Loading..."} = prop;
    return (
        <Dimmer inverted={inverted} active={true}>
            <Loader content={content} />
        </Dimmer>
    )
}

export default Loading;