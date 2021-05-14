import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addPostChatComment } from '../../application/firebase/firebaseService';
import { Loader } from 'semantic-ui-react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import UnauthorisedModal from '../authentication/UnauthorisedModal';

const PostChatForm = (props) => {

    const {postId, parentId, closeCommentFormField} = props;

    const { authenticated } = useSelector((state) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            {modalOpen && <UnauthorisedModal setModalOpen={setModalOpen} />}
            <Formik
                initialValues={{comment: ""}}
                validationSchema={Yup.object({
                    comment: Yup.string().required()
                })}
                onSubmit={async (values, {setSubmitting, resetForm}) => {
                    try{
                        await addPostChatComment(postId, { ...values, parentId});
                        resetForm();
                    } catch(error) {
                        toast.error(error.message);
                    } finally {
                        setSubmitting(false);
                        closeCommentFormField({open: false, commentId: null});
                    }
                }}
            >
                {({isSubmitting, handleSubmit, isValid}) => (
                    <Form className="ui form">
                        <Field name="comment">
                            {({field}) => (
                                <div style={{position: 'relative'}}>
                                    <Loader active={isSubmitting}/>
                                    <textarea 
                                        rows="2" {...field} 
                                        placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
                                        onKeyPress={(e) => {
                                            if(e.key === "Enter" && e.shiftKey){
                                                return;
                                            }
                                            if(e.key === "Enter" && !e.shiftKey){
                                                e.preventDefault();
                                                if(authenticated){
                                                    isValid && handleSubmit();
                                                } else {
                                                    setModalOpen(true);
                                                }
                                            }
                                        }}>

                                    </textarea>
                                </div>
                            )}
                        </Field>
                    </Form>
                )}
            </Formik>
        </>
    )
} 

export default PostChatForm;