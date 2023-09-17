import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useGetActivity} from '../activity/useActivities';
import {IdProp} from '../types';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomPressable from '../components/Pressable';
import {useTranslation} from '../internationalization/useTranslation';
import GradientBackground from './GradientBackground';
import {commonStyles} from '../commonStyles';
import * as ColorPalette from '../ColorPalette';
import {useDispatch} from 'react-redux';
import {modalClosed} from '../modal/modalActions';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be no more than 100 characters long'),
});

interface ActivityFormProps {
  id?: string | null;
  name?: string;
}

export function ActivityForm(props: ActivityFormProps) {
  const {id = null, name} = props;
  const {translate} = useTranslation();
  const confirmationText = translate('Save');
  const dispatch = useDispatch();
  const headerText =
    id === null ? translate('Create-Activity') : translate('Edit-Activity');
  return (
    <Formik
      initialValues={{name: name ?? ''}}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log('Form submitted with values:', values);
        dispatch(modalClosed());
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View style={{...commonStyles.container, ...styles.container}}>
          <Text style={commonStyles.headerTextStyle}>{headerText}</Text>
          <TextInput
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            placeholder={name}
            style={styles.input}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <CustomPressable style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonTextStyle}>{confirmationText}</Text>
          </CustomPressable>
        </View>
      )}
    </Formik>
  );
}

export function EditActivity(props: IdProp) {
  const {id} = props;
  const {getActivity} = useGetActivity();
  const activity = getActivity(id);
  const name = activity?.name ?? '';
  return (
    <GradientBackground>
      <ActivityForm id={id} name={name} />
    </GradientBackground>
  );
}

export function CreateActivity() {
  return (
    <GradientBackground>
      <ActivityForm />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: ColorPalette.OffWhite_RGBSerialized,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 30,
    color: ColorPalette.OffWhite_RGBSerialized,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: ColorPalette.actionColorSerialized,
    padding: 12,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonTextStyle: {
    fontSize: 25,
    color: ColorPalette.OffWhite_RGBSerialized,
  },
});
