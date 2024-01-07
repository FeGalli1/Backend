'use strict';

// import server from './server.js';
import config from './config.js';
import connectToDB from './DataBase.js';

// Wait for database connection before starting server
async function startServer() {
  try {
    await import('./DataBase.js'); // Import and wait for connection
    const connected = await connectToDB(); // Call connection function and check result
    if (connected) {
        try {
              const serverModulePath = new URL('./server.js', import.meta.url).pathname;
              const { default: server } = await import(serverModulePath);
              server.listen(config.PORT, () => console.log('Server is running!'));
        } catch (err) {
          console.error('Error starting server:', err);
          process.exit(1);
        }
      }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer(); // Run the server start function
