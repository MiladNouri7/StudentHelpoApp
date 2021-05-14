import React, { useEffect, useState } from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import Post from './Post';
import firebase from '../../application/configuration/firebase'
import { addPostToFs } from '../../application/firebase/firestoreService';
import { toast } from 'react-toastify';
import FlipMove from 'react-flip-move';
import UnauthorisedModal from '../authentication/UnauthorisedModal';
import { useSelector } from 'react-redux';

const database = firebase.firestore();


const Feed = () => {

    const [posts, setPosts] = useState([]);
    const [input, setInput] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const { authenticated } = useSelector((state) => state.auth);
    
    useEffect(() => {
        database.collection("posts").orderBy("createdAt", "desc").onSnapshot(snapshot => (
            setPosts(snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    data: doc.data(),
                }
            )))
        ));

        return () => {
            setPosts([]);
        };
    }, [])

    const sendPost = (e) => {
        e.preventDefault();
        if(authenticated){

            try{
                addPostToFs(input);
            }catch(error){
                toast.error(error.message);
            }
    
            setInput("");
        } else {
            setModalOpen(true);
        }
    }
  
    return (
        <>
            {modalOpen && <UnauthorisedModal setModalOpen={setModalOpen} />}
                <Grid columns={3}>
                <Grid.Row>
                <Grid.Column width={3}>
                </Grid.Column>
                <Grid.Column width={10}>

                    <div className="feed">
                        <div className="feed-inputContainer">
                            <div className="feed-input">
                            <Icon name='edit' size='large' />
                            <form>
                                <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Ask your question..."/>
                                <button onClick={sendPost} type="submit">send</button>
                            </form>
                            </div>
                        </div>
                    </div>

                    <FlipMove>
                        {posts.map(({id, data: {hostName, hostId, createdTime, message, likes, photoURL, userLike}}) => (
                            <Post 
                                key={id}
                                id={id}
                                hostId={hostId}
                                hostName={hostName}
                                createdTime={Date.parse(createdTime)}
                                message={message}
                                likes={likes}
                                photoURL={photoURL}
                                userLike={userLike}
                            />
                        ))}
                    </FlipMove>

                </Grid.Column>
                <Grid.Column width={3}>
                </Grid.Column>
                </Grid.Row>
                </Grid>
        </>
    );
}


export default Feed;