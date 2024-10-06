import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorMessage from '@/components/ErrorMessage';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Ensure handleChange is defined here
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', formData);
      const { access_token } = response.data;
      
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(payload));
      // const config = {
      //   headers: {
      //     'Authorization': `Bearer ${access_token}`
      //   }
      // };
  
      localStorage.setItem('token', access_token);

      navigate('/');
    } catch (error) {
      console.error('Error in login process:', error);
      if (error.response) {
        setError(error.response.data.message || 'An error occurred during login');
      } else if (error.request) {
        setError('Unable to connect to the server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} />
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit">Login</Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => navigate('/register')}>Don't have an account? Register</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
