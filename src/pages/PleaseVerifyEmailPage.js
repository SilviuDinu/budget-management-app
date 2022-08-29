import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PleaseVerifyEmailPage = () => {
  const history = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      history.push('/dashboard');
    }, 3500);
  }, [history]);

  return (
    <div className="container">
      <h1>Thanks for signing up!</h1>
      <p>
        A verification email has been sent to the email address you provided. 
        Please verify your email in order to unlock all site features.
      </p>
    </div>
  );
};
