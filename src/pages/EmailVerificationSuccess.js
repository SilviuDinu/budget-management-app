import { useNavigate } from 'react-router-dom';

export const EmailVerificationSuccess = () => {
  const history = useNavigate();

  return (
    <div className="container">
      <h1>Success!</h1>
      <p>Thanks for verifiying your email ❤️</p>
      <button onClick={() => history.push('/dashboard')}>Go to homepage</button>
    </div>
  );
};
