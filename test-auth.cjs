// Simple Node.js script to test API authentication
const https = require('https');

const baseURL = 'https://backend.spacetechs.net/api';
const apiKey = 'my-super-secret-key-2025';

// Test login
const loginData = JSON.stringify({
  email: 'test@example.com',
  password: 'password123'
});

const loginOptions = {
  hostname: 'backend.spacetechs.net',
  port: 443,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'Content-Length': Buffer.byteLength(loginData)
  }
};

console.log('Testing API authentication...');

const req = https.request(loginOptions, (res) => {
  console.log(`Login Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Login Response:', response);
      
      if (response.token) {
        console.log('✅ Login successful, token received');
        testProtectedEndpoint(response.token);
      } else {
        console.log('❌ No token in response');
      }
    } catch (error) {
      console.log('Response data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Login Error:', error);
});

req.write(loginData);
req.end();

function testProtectedEndpoint(token) {
  const projectsOptions = {
    hostname: 'backend.spacetechs.net',
    port: 443,
    path: '/api/projects?limit=1',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'Authorization': `Bearer ${token}`
    }
  };

  const req2 = https.request(projectsOptions, (res) => {
    console.log(`Projects Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Projects API working with token');
      } else {
        console.log('❌ Projects API failed:', data);
      }
    });
  });

  req2.on('error', (error) => {
    console.error('Projects Error:', error);
  });

  req2.end();
}