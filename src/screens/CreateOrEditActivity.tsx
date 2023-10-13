import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useGetActivity} from '../activity/useActivities';
import {IdProp, IdType} from '../types';
import React, {useMemo} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomPressable from '../components/Pressable';
import {useTranslation} from '../internationalization/useTranslation';
import GradientBackground from './GradientBackground';
import {commonStyles} from '../commonStyles';
import * as ColorPalette from '../ColorPalette';
import {useDispatch, useSelector} from 'react-redux';
import {modalClosed} from '../modal/modalActions';
import {
  ActivityFormAction,
  ActivityFormData,
  createdActivity,
  activityWasEdited,
  createdSubactivity,
} from '../activity/redux/activityActions';
import {uuidv4} from '../utils/uuid';
import {ApplicationState} from '../redux/rootReducer';
import {ParentChildAction} from '../redux/actions';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be no more than 100 characters long'),
});

interface ActivityFormProps {
  getActivityFormSubmissionAction: (
    data: ActivityFormData,
  ) => ActivityFormAction | ParentChildAction<ActivityFormData>;
  id?: IdType;
  name?: string;
}

export function ActivityForm(props: ActivityFormProps) {
  const {id = null, name, getActivityFormSubmissionAction} = props;
  const {translate} = useTranslation();
  const confirmationText = translate('Save');
  const headerText =
    id === null ? translate('Create-Activity') : translate('Edit-Activity');
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{name: name ?? ''}}
      validationSchema={validationSchema}
      onSubmit={values => {
        dispatch(
          getActivityFormSubmissionAction({id: id ?? uuidv4(), ...values}),
        );
        dispatch(modalClosed());
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View style={{...commonStyles.container, ...styles.container}}>
          <Text style={commonStyles.headerTextStyle}>{headerText}</Text>
          <View>
            <TextInput
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={name}
              style={styles.input}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          <CustomPressable style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonTextStyle}>{confirmationText}</Text>
          </CustomPressable>
        </View>
      )}
    </Formik>
  );
}

export function CreateActivity() {
  const shouldAddAsSubactivity = useSelector(
    (state: ApplicationState) =>
      state.modal.params?.shouldAddAsSubactivity ?? false,
  );
  const parentId = useSelector(
    (state: ApplicationState) => state.modal.params?.parentId,
  );
  const submitForm = useMemo(
    () =>
      shouldAddAsSubactivity
        ? (data: ActivityFormData) => createdSubactivity(data, parentId)
        : createdActivity,
    [parentId, shouldAddAsSubactivity],
  );
  return (
    <GradientBackground>
      <ActivityForm getActivityFormSubmissionAction={submitForm} />
    </GradientBackground>
  );
}

export function EditActivity(props: IdProp) {
  const {id = uuidv4()} = props;
  const {getActivity} = useGetActivity();
  const activity = getActivity(id!);
  const name = activity?.name ?? '';
  return (
    <GradientBackground>
      <ActivityForm
        getActivityFormSubmissionAction={activityWasEdited}
        id={id}
        name={name}
      />
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
