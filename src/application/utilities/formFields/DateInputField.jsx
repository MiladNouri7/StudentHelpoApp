import { useField, useFormikContext } from 'formik';
import React from 'react';
import { FormField, Label } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInputField = (prop) => {
    const {label, ...props} = prop;
    const [field, meta] = useField(props);
    const {setFieldValue} = useFormikContext();

    return(
        <FormField error={meta.touched && !!meta.error}>
            <label>{label}</label>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => setFieldValue(field.name, value)}
            />
            {meta.touched && meta.error ? (
                <Label color="red" basic>{meta.error}</Label>
            ) : null}
        </FormField>
    )
}

export default DateInputField;
