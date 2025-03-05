import eventEmitter from '../event.mjs';

eventEmitter.on('event:userRegistered', async (user) => {
    try {
        // Simulate an asynchronous operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('User registered:', user);
    } catch (error) {
        console.error('Error handling user registration event:', error);
    }
});