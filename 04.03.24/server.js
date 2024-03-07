const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('index.html').pipe(res);
  } else if (req.method === 'POST' && req.url === '/register') {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      const { email, firstName, lastName, password, confirmPassword } = JSON.parse(data);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

      const errors = [];

      if (!emailRegex.test(email)) {
        errors.push('Невірний формат email');
      }

      if (!firstName || !lastName) {
        errors.push('Ім\'я та прізвище обов\'язкові');
      }

      if (!passwordRegex.test(password)) {
        errors.push('Пароль повинен містити принаймні 6 символів, цифру, малу та велику літеру');
      }

      if (password !== confirmPassword) {
        errors.push('Підтвердження паролю не співпадає');
      }

      if (errors.length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ errors }));
      } else {
        // Save json
        const userData = { email, firstName, lastName };
        // Save userData

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
