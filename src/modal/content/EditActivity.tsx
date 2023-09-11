import {View, Text, TextInput, StyleSheet} from 'react-native';
import useActivities from '../../activity/useActivities';
import {IdProp} from '../../types';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomPressable from '../../components/Pressable';
import {useTranslation} from '../../internationalization/useTranslation';
import GradientBackground from '../../screens/GradientBackground';
import {commonStyles} from '../../commonStyles';
import * as ColorPalette from '../../ColorPalette';
import {useDispatch} from 'react-redux';
import {modalClosed} from '../modalActions';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be no more than 100 characters long'),
});

export function EditActivity(props: IdProp) {
  const {id} = props;
  const {getActivity} = useActivities();
  const activity = getActivity(id);
  const name = activity?.name ?? '';
  const {translate} = useTranslation();
  const confirmationText = translate('Save');
  const headerText = translate('Edit-Activity');
  const dispatch = useDispatch();
  return (
    <GradientBackground>
      <Formik
        initialValues={{name: activity?.name ?? ''}}
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
