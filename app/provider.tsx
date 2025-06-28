'use client';
import Chatbot from "@/component/chatbot/ChatBot";
import ChatbotIcon from "@/component/chatbot/ChatBotIcon";
import { useState } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {

    const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    return (
        <div className="">
            {children}
            {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
            <ChatbotIcon onClick={toggleChatbot} />
        </div>
    );
}