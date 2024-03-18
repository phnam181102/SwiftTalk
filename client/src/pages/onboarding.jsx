import Protected from '@/hooks/useProtected';
import React from 'react';
import { useSelector } from 'react-redux';

function onboarding() {
    const { user } = useSelector((state) => state.auth);
    return <Protected>onboarding </Protected>;
}

export default onboarding;
