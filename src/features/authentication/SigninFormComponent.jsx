import React from 'react';
import { Form, Formik } from 'formik';
import ModalWrapper from '../../application/utilities/modals/ModalWrapper';
import * as Yup from 'yup';
import TextInputField from '../../application/utilities/formFields/TextInputField';
import { Button, Divider, Label } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { closeTheModal } from '../../application/utilities/modals/modalReducer';
import { emailLogin } from '../../application/firebase/firebaseService';
import LoginWithExternalSites from './LoginWithExternalSites';

const SigninFormComponent = () => {
    const disptach = useDispatch();
    
    return (
        <ModalWrapper size="mini" header="Sign in to StudentHelpo">
            <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={Yup.object({
                    email: Yup.string().required().email(),
                    password: Yup.string().required()
                })}
                onSubmit={ async (values, {setSubmitting, setErrors}) => {
                    try{
                        await emailLogin(values);
                        setSubmitting(false);
                        disptach(closeTheModal());
                    }catch(error){
                        setErrors({auth: "Incorrect email or password"});
                        setSubmitting(false);
                    }
                }}
            >

            {({isSubmitting, isValid, dirty, errors}) => (
                    <Form className='ui form'>
                        <TextInputField name='email' placeholder='Email Address' />
                        <TextInputField name='password' placeholder='Password' type='password' />
                        {errors.auth && <Label basic color="red" style={{marginBottom: 10}} content={errors.auth}/>}
                        <Button 
                            loading={isSubmitting}
                            disabled={!isValid || !dirty || isSubmitting}
                            fluid
                            type='submit'
                            color='green'
                            size='large'
                            content='Login'
                        />
                        <Divider horizontal>Or</Divider>
                        <LoginWithExternalSites />
                    </Form>
                )}
            </Formik>
        </ModalWrapper>
    )
}

export default SigninFormComponent;