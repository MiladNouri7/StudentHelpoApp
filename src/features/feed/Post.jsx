import React, {forwardRef, useEffect, useState} from 'react';
import { Item, Accordion, Segment, Button, Comment } from 'semantic-ui-react';
import { formatDistance } from "date-fns";
import { deletePostInFs, updateLikesInFs } from '../../application/firebase/firestoreService';
import firebase from "../../application/configuration/firebase";
import PostChatForm from './PostChatForm';
import { useDispatch, useSelector } from 'react-redux';
import { convertFbObjectIntoArray, getPostChatRef, likePostComment } from '../../application/firebase/firebaseService';
import { listenToPostChat } from './postActions';
import { Link } from 'react-router-dom';
import { CLEAR_COMMENTS } from './postActions';
import { createDataTree } from '../../application/utilities/helper/helper';
import UnauthorisedModal from '../authentication/UnauthorisedModal';



const Post = forwardRef((props, ref) => {

    const { id , hostId, hostName, createdTime, message, likes, photoURL, userLike } = props;

    const dispatch = useDispatch();
    const {comments} = useSelector(state => state.post);
    const [showReplyForm, setShowReplyForm] = useState({open: false, commentId: null});
    const { authenticated } = useSelector((state) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);
    const user = firebase.auth().currentUser;


    const handleClosingReplyField = () => {
        setShowReplyForm({open: false, commentId: null});
    }

    const onPostCommentLike = (comment) => {
        if(authenticated){
            likePostComment(comment);
        } else {
            setModalOpen(true);
        }
    }

    const likedByCurrentUser = (comment) => {

        for(let i = 0; i < comment.likes.length; i++){
            if(comment.likes[i] === user?.uid){
                return true;
            }
        }

        return false;
    }

    useEffect(() => {
        return () => {
            dispatch({type: CLEAR_COMMENTS});
            getPostChatRef().off();
        }
    }, [id, dispatch])

    const Level1Content = (
        <Segment>
            <PostChatForm postId={id} parentId={0} closeCommentFormField={setShowReplyForm}/>
            <Comment.Group>
                {createDataTree(comments).filter(comment => comment.postId === id).map(comment => {
                        return (
                            <Comment key={comment.id}>
                            <Comment.Avatar src={comment.photoURL || "/assets/user.png"} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profile/${comment.uid}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                <div>{formatDistance(comment.date, new Date())}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.text.split('\n').map((text, index) => (
                                    <span key={index}>
                                        {text}
                                        <br/>
                                    </span>
                                ))}</Comment.Text>
                                <Comment.Actions>
                                <Comment.Action onClick={() => setShowReplyForm({open: true, commentId: comment.id})}>Reply</Comment.Action>
                                <Comment.Action onClick={() => onPostCommentLike(comment)}>{likedByCurrentUser(comment) ? "Unlike" : "Like"}</Comment.Action>
                                <Comment.Action>{comment.likes.length - 1}</Comment.Action>
                                {showReplyForm.open && showReplyForm.commentId === comment.id && (
                                    <PostChatForm postId={id} parentId={comment.id} closeCommentFormField={handleClosingReplyField}/>
                                )}
                                </Comment.Actions>
                            </Comment.Content>
                            
                                {comment.childNodes.length > 0 && (
                                    <Comment.Group>
                                        {comment.childNodes.reverse().map(child => (
                                            <Comment key={child.id}>
                                            <Comment.Avatar src={child.photoURL || "/assets/user.png"} />
                                            <Comment.Content>
                                                <Comment.Author as={Link} to={`/profile/${child.uid}`}>{child.displayName}</Comment.Author>
                                                <Comment.Metadata>
                                                <div>{formatDistance(child.date, new Date())}</div>
                                                </Comment.Metadata>
                                                <Comment.Text>{child.text.split('\n').map((text, index) => (
                                                    <span key={index}>
                                                        {text}
                                                        <br/>
                                                    </span>
                                                ))}</Comment.Text>
                                                <Comment.Actions>
                                                <Comment.Action onClick={() => setShowReplyForm({open: true, commentId: child.id})}>Reply</Comment.Action>
                                                <Comment.Action onClick={() => onPostCommentLike(child)}>{likedByCurrentUser(child) ? "Unlike" : "Like"}</Comment.Action>
                                                <Comment.Action>{child.likes.length - 1}</Comment.Action>
                                                {showReplyForm.open && showReplyForm.commentId === child.id && (
                                                    <PostChatForm postId={id} parentId={child.parentId} closeCommentFormField={handleClosingReplyField}/>
                                                )}
                                                </Comment.Actions>
                                            </Comment.Content>
                                            </Comment>
                                        ))}
                                    </Comment.Group>
                                )}
                            
                            </Comment>
                        )
                })}
            </Comment.Group>
        </Segment>
    )


    const rootPanels = [
        { key: 'panel-1', title: 'View Comments', content: { content: Level1Content } },
      ]


    const handleLikes = (e) => {
        if(authenticated){
            updateLikesInFs(id, userLike, likes);
        } else {
            setModalOpen(true);
        }
    }

    let likedPost = false;

    for(let i = 0; i < userLike.length; i++){

        if(authenticated){
            if(userLike[i].userId === user.uid){
                likedPost = true;
            }
        }
    }

    const handlePostComments = (e, titleProps) => {
        
        getPostChatRef(id).on('value', snapshot => {
            if(!snapshot.exists()) return;
            dispatch(listenToPostChat(convertFbObjectIntoArray(snapshot.val()).reverse()))
        });
    }

    return (
        <div ref={ref} style={{marginTop: '40px'}}>
        {modalOpen && <UnauthorisedModal setModalOpen={setModalOpen} />}
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src={photoURL}/>
                        <Item.Content>
                            <Item.Header content={hostName}/>
                            <Item.Description>
                            <div>{formatDistance(createdTime, new Date())}</div>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment clearing>
                <div>{message}</div>
                {authenticated && user.uid === hostId && <Button onClick={() => deletePostInFs(id)} color="red" floated="right" content="Delete"/>}

                {likedPost ?        
                    <Button
                    onClick={handleLikes}
                    color='blue'
                    content='Liked'
                    icon='heart'
                    floated="right"
                    label={{ basic: true, color: 'blue', pointing: 'left', content: likes }}
                    /> 
                : 
                    <Button
                    onClick={handleLikes}
                    color='blue'
                    content='Like'
                    icon='heart'
                    floated="right"
                    label={{ basic: true, color: 'blue', pointing: 'left', content: likes }}
                    />
                }


            </Segment>
            <Accordion onTitleClick={handlePostComments} style={{width: '100%', backgroundColor: '#f3f3f3'}}  panels={rootPanels} styled />
            
        </Segment.Group>
        </div>
    );
})

export default Post;