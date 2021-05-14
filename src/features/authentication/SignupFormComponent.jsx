import React from 'react';
import { Form, Formik } from 'formik';
import ModalWrapper from '../../application/utilities/modals/ModalWrapper';
import * as Yup from 'yup';
import TextInputField from '../../application/utilities/formFields/TextInputField';
import { Button, Divider, Label } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { closeTheModal } from '../../application/utilities/modals/modalReducer';
import { signupIntoFb} from '../../application/firebase/firebaseService';
import LoginWithExternalSites from './LoginWithExternalSites';

const SignupFormComponent = () => {
    const disptach = useDispatch();
    
    return (
        <ModalWrapper size="mini" header="Register to StudentHelpo">
            <Formik
                initialValues={{displayName: "", email: "", password: ""}}
                validationSchema={Yup.object({
                    displayName: Yup.string().required(),
                    email: Yup.string().required().email(),
                    password: Yup.string().required()
                })}
                onSubmit={ async (values, {setSubmitting, setErrors}) => {
                    try{
                        await signupIntoFb(values);
                        setSubmitting(false);
                        disptach(closeTheModal());
                    }catch(error){
                        setErrors({auth: error.message});
                        setSubmitting(false);
                    }
                }}
            >

            {({isSubmitting, isValid, dirty, errors}) => (
                    <Form className='ui form'>
                        <TextInputField name='displayName' placeholder='Display Name' />
                        <TextInputField name='email' placeholder='Email Address' />
                        <TextInputField name='password' placeholder='Password' type='password' />
                        {errors.auth && <Label basic color="red" style={{marginBottom: 10}} content={errors.auth}/>}
                        <Button 
                            loading={isSubmitting}
                            disabled={!isValid || !dirty || isSubmitting}
                            size='large'
                            color='green'
                            type='submit'
                            fluid
                            content='Register'
                        />
                        <Divider horizontal>Or</Divider>
                        <LoginWithExternalSites />
                    </Form>
                )}
            </Formik>
        </ModalWrapper>
    )
}

export default SignupFormComponent;