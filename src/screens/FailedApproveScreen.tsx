import React from 'react';
import { useRoute } from '@react-navigation/native';
import ErrorScreen from '../components/ErrorScreen';

const FailedApproveScreen = () => {
  const route = useRoute();
  const { errorMessage } = route.params || {};

  return (
    <ErrorScreen
      title="Approval Failed"
      message={errorMessage || 'Failed to approve login.'}
      buttonText="Back"
      buttonColor="red"
    />
  );
};

export default FailedApproveScreen; 