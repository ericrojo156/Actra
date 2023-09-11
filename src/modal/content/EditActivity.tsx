import {View, Text, TextInput, StyleSheet} from 'react-native';

import useActivities from '../../activity/useActivities';
import {IdProp} from '../../types';

import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomPressable from '../../components/Pressable';
import {useTranslation} from '../../internationalization/useTranslation';
import GradientBackground from '../../screens/GradientBackground';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});

export function EditActivity(props: IdProp) {
  const {id} = props;
  const {getActivity} = useActivities();
  const activity = getActivity(id);
  const name = activity?.name ?? '';
  const {translate} = useTranslation();
  const confirmationText = translate('Save');
  return (
    <GradientBackground>
      <Formik
        initialValues={{name: activity?.name ?? ''}}
        validationSchema={validationSchema}
        onSubmit={values => {
          // Handle form submission here (e.g., save the updated name)
          console.log('Form submitted with values:', values);
        }}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <View>
            <TextInput
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={name}
              style={styles.input}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <CustomPressable onPress={handleSubmit}>
              <Text>{confirmationText}</Text>
            </CustomPressable>
          </View>
        )}
      </Formik>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    color: 'white',
    fontSize: 18,
    padding: 12,
    borderRadius: 5,
    textAlign: 'center',
  },
});
