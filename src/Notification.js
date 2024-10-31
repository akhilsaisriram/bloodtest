// import React, { useState, useEffect } from 'react';
// import { Expo } from 'expo-server-sdk';

// // Create a new Expo SDK client
// let expo = new Expo();

// const PushNotification = () => {
//   const [pushToken, setPushToken] = useState('ExponentPushToken[xwcgdhPV3-siYxs29lenJq]');
//   const [error, setError] = useState(null);

//   // Function to send the push notification
//   const sendPushNotification = async (pushToken) => {
//     // Ensure the token is valid with Expo
//     if (!Expo.isExpoPushToken(pushToken)) {
//       console.error(`Push token ${pushToken} is not a valid Expo push token`);
//       setError(`Push token ${pushToken} is not valid.`);
//       return;
//     }

//     // Create the message
//     let messages = [];
//     messages.push({
//       to: pushToken,
//       sound: 'default',
//       body: 'Hello! This is a test notification',
//       data: { withSome: 'data' },
//     });

//     let chunks = expo.chunkPushNotifications(messages);
//     let tickets = [];

//     // Send notifications in chunks
//     for (let chunk of chunks) {
//       try {
//         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         tickets.push(...ticketChunk);
//       } catch (error) {
//         console.error(error);
//         setError(error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     // Trigger the notification when the component mounts or the pushToken changes
//     if (pushToken) {
//       sendPushNotification(pushToken);
//     }
//   }, [pushToken]);

//   return (
//     <div>
//       <h1>Push Notification Example</h1>
//       {error && <p>Error: {error}</p>}
//     </div>
//   );
// };

// export default PushNotification;
