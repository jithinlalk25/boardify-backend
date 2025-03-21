import { Expo } from 'expo-server-sdk';

let expo = new Expo({
  useFcmV1: true,
});

export const sendPushNotifications = async (
  body: string,
  pushTokens: string[],
  data = {},
) => {
  console.log(
    'sendPushNotifications => body: ',
    body,
    ' pushTokens: ',
    pushTokens,
  );

  const messages = [];
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: 'default',
      body,
      data,
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
