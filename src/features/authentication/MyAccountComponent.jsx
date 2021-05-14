import { Form, Formik } from 'formik';
import React from 'react';
import { Button, Header, Label, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import TextInputField from '../../application/utilities/formFields/TextInputField';
import { useSelector } from 'react-redux';
import { updatePasswordInFb } from '../../application/firebase/firebaseService';
import { toast } from 'react-toastify';


const MyAccountComponent = () => {
    const { currentUser } = useSelector((state) => state.auth);
    return (
        <Segment>
            <Header dividing size="large" content="Account"/>
            {currentUser.providerId === "password" &&
                <>
                    <Header color="blue" sub content="Change Your Password"/>
                    <Formik 
                        initialValues={{newPassword1: "", newPassword2: ""}}
                        validationSchema={Yup.object({
                            newPassword1: Yup.string().required("Password is required"),
                            newPassword2: Yup.string().oneOf([Yup.ref('newPassword1'), null],
                            "Password do not match")
                        })}
                        onSubmit={ async (values, {setSubmitting, setErrors}) => {
                            try{
                                await updatePasswordInFb(values);
                                toast.success("Password Updated");
                            }catch(error){
                                setErrors({auth: error.message});
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({errors, isSubmitting, isValid, dirty}) => (
                            <Form className="ui form">
                                <TextInputField name="newPassword1" type="password" placeholder="New Password"/>
                                <TextInputField name="newPassword2" type="password" placeholder="Confirm Password"/>
                                {errors.auth && <Label basic color="red" style={{marginBottom: 10}} content={errors.auth}/>}
                                <Button style={{display: "block"}}
                                    type="submit" disabled={!isValid || isSubmitting || !dirty}
                                    loading={isSubmitting}
                                    size="large"
                                    positive
                                    content="Update password"
                                />
                            </Form>
                        )}
                    </Formik>
                </>
            }

            {currentUser.providerId === "facebook.com" &&
                <>
                    <Header color="blue" sub content="Facebook account"/>
                    <p>Please visit Facebook to update your account</p>
                    <Button icon="facebook" color="facebook" href="https://facebook.com"
                        content="Go to Facebook"
                    />
                </>
            }
            {currentUser.providerId === "google.com" &&
                <>
                    <Header color="blue" sub content="Google account"/>
                    <p>Please visit Google to update your account</p>
                    <Button icon="google" color="google plus" href="https://google.com"
                        content="Go to Google"
                    />
                </>
            }
        </Segment>
    )
}

export default MyAccountComponent;