import config from './config';

export const sendRequest = async (route, method, body) => {
  try {
    const userToken = localStorage.getItem('token');
    const response = await fetch(`http://localhost:${config.BACKEND_PORT}/${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      console.error(`Request failed with status: ${response.status}`);
      console.error('Response data:', await response.json());
    }

    return await response.json();
  } catch (error) {
  }
};
