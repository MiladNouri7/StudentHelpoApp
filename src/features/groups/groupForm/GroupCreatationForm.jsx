import React, { useState } from 'react';
import { Button, Confirm, Header, Segment } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listenToGroups } from '../groupActions';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import TextInputField from '../../../application/utilities/formFields/TextInputField';
import TextInputArea from '../../../application/utilities/formFields/TextInputArea';
import SelectInputField from '../../../application/utilities/formFields/SelectInputField';
import { categoryData } from '../../../application/categoryOptions';
import DateInputField from '../../../application/utilities/formFields/DateInputField';
import { addGroupToFs, cancelGroupMeetingToggle, listenToGroupDataFromFs, updateGroupDataInFs } from '../../../application/firebase/firestoreService';
import useFirestoreDocument from '../../../application/hooks/useFirestoreDocument';
import Loading from '../../../application/layout/Loading';
import { toast } from 'react-toastify';


const GroupCreatationForm = (props) => {
    const {match, history} = props;
    const dispatch = useDispatch();
    const [loadingCancelation, setLoadingCancelation] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const chosenGroup = useSelector(state => state.group.groups.find(e => e.id === match.params.id));
    const {loading, error} = useSelector(state => state.async);

    const initialValues = chosenGroup ?? {
        title: "",
        category: "",
        description: "",
        date: ""
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("You must provide a title"),
        category: Yup.string().required("You must provide a category"),
        description: Yup.string().required(),
        date: Yup.string().required()
    });

    const handleGroupCancelation = async (group) => {
        setConfirmationOpen(false);
        setLoadingCancelation(true);
        try {
            await cancelGroupMeetingToggle(group)
            setLoadingCancelation(false);
        } catch (error){
            setLoadingCancelation(true);
            toast.error(error.message);
        }
    }

    useFirestoreDocument({
        shouldExecute: !!match.params.id,
        query: () => listenToGroupDataFromFs(match.params.id),
        data: group => dispatch(listenToGroups([group])),
        deps: [match.params.id, dispatch],
    });

    if(loading) return <Loading content="loading group..." />
    
    if(error) return <Redirect to="/error"/>


    return(
        <Segment clearing>
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting}) => {
                    try{
                        chosenGroup ? await updateGroupDataInFs(values) :
                        await addGroupToFs(values);
                        setSubmitting(false);
                        history.push("/groups");
                    }catch(error){
                        toast.error(error.message);
                        setSubmitting(false);
                    }
                }}
                >
                    {({isSubmitting, dirty, isValid}) => (
                        <Form className="ui form">
                            <Header sub color="blue" content="group Details"/>
                            <TextInputField name="title" placeholder="Group Title"/>
                            <SelectInputField name="category" placeholder="Category" options={categoryData}/>
                            <TextInputArea name="description" placeholder="Description" rows={3}/>
                            <DateInputField 
                                name="date" 
                                placeholderText="group meeting date"
                                timeFormat="HH:mm"
                                showTimeSelect
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm a"
                            />
                            {chosenGroup &&
                            <Button loading={loadingCancelation} type="button" floated="left" color={chosenGroup.isCancelled ? "green" : "red"} content={chosenGroup.isCancelled ? "Reactivate meeting" : "Cancel meeting"}
                                onClick={() => setConfirmationOpen(true)}
                            />}
                            <Button loading={isSubmitting} disabled={!isValid || !dirty || isSubmitting} type="submit" floated="right" positive content="Submit"/>
                            <Button  disabled={isSubmitting} as={Link} to={"/groups"} type="submit" floated="right" content="Cancel"/>
                        </Form> 
                    )}
            
            </Formik>
            <Confirm content={chosenGroup?.isCancelled ? "Are you sure you want to reactivate the group meeting?" : "Are you sure you want to cancel the group meeting?"}
                open={confirmationOpen}
                onCancel={() => setConfirmationOpen(false)}
                onConfirm={() => handleGroupCancelation(chosenGroup)}
            />
        </Segment>
    )
}

export default GroupCreatationForm;