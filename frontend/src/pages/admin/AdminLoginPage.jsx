import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import Meta from '../../components/Meta';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import validator from 'validator'; // Import validator library

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailError, setEmailError] = useState(''); // Add state for email error
  const [passwordError, setPasswordError] = useState(''); // Add state for password error

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const validateEmail = () => {
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  const submitHandler = async e => {
    e.preventDefault();
    validateEmail(); // Call validateEmail function
    validatePassword(); // Call validatePassword function

    if (!validator.isEmail(email) || password.length < 6) { // Check email and password validity
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      const res = await login({ email, password, remember }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/admin/dashboard');
      toast.success('Login successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <main className='d-flex position-relative flex-column justify-content-center align-items-center '>
        <Meta title={'Admin Sign In'} />
        <FormContainer>
          <Card className='p-3 p-md-5 '>
            <h1 className='mb-5 text-center'>Sign In</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type='email'
                  value={email}
                  placeholder='Enter email'
                  onChange={e => setEmail(e.target.value)}
                  onBlur={validateEmail} // Call validateEmail function on blur
                />
                {emailError && <p className="text-danger">{emailError}</p>} {/* Display email error */}
              </Form.Group>
              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder='Enter password'
                    onChange={e => setPassword(e.target.value)}
                    onBlur={validatePassword} // Call validatePassword function on blur
                  />
                  <InputGroup.Text
                    onClick={togglePasswordVisibility}
                    id='togglePasswordVisibility'
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </InputGroup.Text>
                </InputGroup>
                {passwordError && <p className="text-danger">{passwordError}</p>} {/* Display password error */}
              </Form.Group>
              <Form.Group className='mb-3' controlId='checkbox'>
                <Form.Check
                  type='checkbox'
                  label='Keep me signed in.'
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
              </Form.Group>
              <Button
                className='my-3 w-100'
                variant='warning'
                type='submit'
                disabled={isLoading}
              >
                Sign In
              </Button>
            </Form>
          </Card>
        </FormContainer>
      </main>
      <Footer />
    </>
  );
};

export default AdminLoginPage;
