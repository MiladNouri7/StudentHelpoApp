import { Formik, Form} from 'formik';
import React from 'react';
import TextInputField from '../../../application/utilities/formFields/TextInputField';
import TextInputArea from '../../../application/utilities/formFields/TextInputArea';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../../application/firebase/firestoreService';

const ProfileInfoForm = (props) => {

    const {profile} = props;
    return (
        <Formik
            initialValues={{
                displayName: profile.displayName,
                description: profile.description || ""
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required()
            })}
            onSubmit={async (values, {setSubmitting}) => {
                try {
                    await updateUserProfile(values);
                } catch (error){
                    toast.error(error.message);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className="ui form">
                    <TextInputField name="displayName" placeholder="Display Name"/>
                    <TextInputArea name="description" placeholder="Description"/>
                    <Button
                        loading={isSubmitting}
                        disabled={isSubmitting || !isValid || !dirty}
                        floated="right"
                        type="submit"
                        size="large"
                        positive
                        content="Update profile"
                    />
                </Form>
            )}
        </Formik>
    )
}

export default ProfileInfoForm;