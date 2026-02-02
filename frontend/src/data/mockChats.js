export const mockChats = [
  {
    id: "chat_1",
    participants: ["curr_user", "@dishantsav123"],
    messages: [
      {
        id: "msg_1",
        senderId: "@dishantsav123",
        text: "Hey! Loved your recent post about React hooks.",
        timestamp: "2024-03-10T10:30:00Z",
      },
      {
        id: "msg_2",
        senderId: "curr_user",
        text: "Thanks Dishant! I appreciate the feedback.",
        timestamp: "2024-03-10T10:32:00Z",
      },
      {
        id: "msg_3",
        senderId: "@dishantsav123",
        text: "Are you planning to write more about performance optimization?",
        timestamp: "2024-03-10T10:35:00Z",
      },
    ],
  },
  {
    id: "chat_2",
    participants: ["curr_user", "@sarahj_dev"],
    messages: [
      {
        id: "msg_4",
        senderId: "@sarahj_dev",
        text: "Can you take a look at my PR when you have a chance?",
        timestamp: "2024-03-09T14:20:00Z",
      },
      {
        id: "msg_5",
        senderId: "curr_user",
        text: "Sure, I'll check it out this evening.",
        timestamp: "2024-03-09T15:00:00Z",
      },
    ],
  },
];
