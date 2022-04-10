import axios from "axios";
import React from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { useEffect, useState } from "react";

function Chatbot() {
  useEffect(() => {
    eventQuery("welcomeToMyWebsite");
  }, []);

  const handleNewUserMessage = (newMessage) => {
    textQuery(newMessage);
  };

  const textQuery = async (text) => {
    //  First  Need to  take care of the message I sent
    let conversation = {
      content: {
        text: {
          text: text,
        },
      },
    };

    const textQueryVariables = {
      text,
    };

    try {
      const response = axios.post("/textQuery", textQueryVariables);

      const content = (await response).data.fulfillmentMessages[0];
      conversation = {
        who: "bot",
        content: content,
      };

      addResponseMessage(conversation.content.text.text[0]);
    } catch (error) {
      conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };

      addResponseMessage(conversation.content.text.text);
      console.log(error);
    }
  };

  const eventQuery = async (event) => {
    let conversation = {};

    const eventQueryVariables = {
      event,
    };

    try {
      const response = axios.post("/eventQuery", eventQueryVariables);

      const content = (await response).data.fulfillmentMessages[0];
      conversation = {
        who: "bot",
        content: content,
      };

      addResponseMessage(conversation.content.text.text[0]);
    } catch (error) {
      conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };

      addResponseMessage(conversation.content.text.text);
      console.log(error);
    }
  };

  return (
    <div>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Chatbot"
        subtitle="Send us a question!"
        profileAvatar="https://res.cloudinary.com/phongcloudinary/image/upload/v1618090260/ClevreChatbot_Logo_kpcyfo.png"
      />
    </div>
  );
}

export default Chatbot;
