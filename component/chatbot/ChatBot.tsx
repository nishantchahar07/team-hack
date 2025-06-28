'use client';
import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  Upload, 
  MessageCircle, 
  FileText, 
  Send, 
  User, 
  Bot, 
  X, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface ChatbotProps {
    onClose: () => void;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant' | 'system';
    content: string;
    messageType: 'file' | 'general';
    timestamp: Date;
}

interface FileInfo {
    name: string;
    length: number;
}

const parseMarkdown = (text: string): string => {
    if (!text) return '';

    text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    text = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.*)$/gm, '<p>$1</p>')
        .replace(/• /g, '<li>')
        .replace(/<p><li>/g, '<ul><li>')
        .replace(/<\/li><\/p>/g, '</li></ul>');

    return text;
};

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const CHAT_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // Initialize with welcome message
    useEffect(() => {
        const welcomeMessage: ChatMessage = {
            id: 'welcome',
            sender: 'assistant',
            messageType: 'general',
            content: `Hello! I'm your AI Medical Assistant. I can help you with:

• **📁 File Analysis** - Upload medical reports (PDF) for detailed analysis
• **❓ General Questions** - Ask about health conditions, medications, symptoms, etc.

**How to use:**
- Type your questions directly or upload a medical report
- I'll automatically understand what type of help you need

**Important:** I provide educational information only. Always consult healthcare providers for medical advice.`,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const showError = (message: string) => {
        const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'system',
            messageType: 'general',
            content: `❌ Error: ${message}`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
    };

    const addMessage = (sender: 'user' | 'assistant' | 'system', content: string, messageType: 'file' | 'general') => {
        const message: ChatMessage = {
            id: Date.now().toString(),
            sender,
            content,
            messageType,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
    };

    const handleFileUpload = async (file: File) => {
        if (file.size > 16 * 1024 * 1024) {
            showError('File size must be less than 16MB.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            setIsProcessing(true);
            addMessage('system', `📤 Uploading "${file.name}"...`, 'file');

            const response = await fetch(`${CHAT_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                setCurrentSessionId(result.session_id);
                setFileInfo({
                    name: result.filename,
                    length: result.text_length
                });
                addMessage('system', `✅ PDF "${result.filename}" uploaded successfully! You can now ask questions about your medical report.`, 'file');
            } else {
                showError(result.error || 'Upload failed');
            }
        } catch (error) {
            showError('Upload failed: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    const sendMessage = async (query: string) => {
        if (!query.trim() || isProcessing) return;

        // Determine message type based on current session
        const messageType: 'file' | 'general' = currentSessionId ? 'file' : 'general';
        addMessage('user', query, messageType);

        try {
            setIsProcessing(true);

            let endpoint;
            let requestBody;

            if (messageType === 'file' && currentSessionId) {
                endpoint = '/ask';
                requestBody = { query, session_id: currentSessionId };
            } else {
                endpoint = '/ask_general';
                requestBody = { query };
            }

            const response = await fetch(`${CHAT_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (response.ok) {
                addMessage('assistant', result.response, messageType);
            } else {
                showError(result.error || 'Failed to get response');
            }
        } catch (error) {
            showError('Failed to send message: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputRef.current) {
            sendMessage(inputRef.current.value);
            inputRef.current.value = '';
        }
    };

    const handleQuickFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            handleFileUpload(file);
            e.target.value = '';
        } else if (file) {
            showError('Only PDF files are supported.');
        }
    };

    const clearFile = () => {
        setCurrentSessionId(null);
        setFileInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        addMessage('system', '📝 File session cleared. You can now ask general questions or upload a new file.', 'general');
    };

    const clearChat = () => {
        const welcomeMessage: ChatMessage = {
            id: 'welcome',
            sender: 'assistant',
            messageType: 'general',
            content: `Hello! I'm your AI Medical Assistant. I can help you with:

• **📁 File Analysis** - Upload medical reports (PDF) for detailed analysis
• **❓ General Questions** - Ask about health conditions, medications, symptoms, etc.

**How to use:**
- Type your questions directly or upload a medical report
- I'll automatically understand what type of help you need

**Important:** I provide educational information only. Always consult healthcare providers for medical advice.`,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        setCurrentSessionId(null);
        setFileInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Drag and Drop Handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type === 'application/pdf') {
            handleFileUpload(file);
        } else {
            showError('Only PDF files are supported.');
        }
    };

    const askSampleQuestion = (question: string) => {
        if (inputRef.current) {
            inputRef.current.value = question;
            sendMessage(question);
            inputRef.current.value = '';
        }
    };

    const getMessageTypeIcon = (messageType: 'file' | 'general') => {
        switch (messageType) {
            case 'file': return <FileText className="w-4 h-4" />;
            case 'general': return <MessageCircle className="w-4 h-4" />;
            default: return <MessageCircle className="w-4 h-4" />;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">AI Medical Assistant</h1>
                                <p className="text-blue-100 text-sm">Ask questions or upload medical reports</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {/* File Upload */}
                            <input
                                accept=".pdf"
                                id="fileUpload"
                                type="file"
                                onChange={handleQuickFileSelect}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <label
                                htmlFor="fileUpload"
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 cursor-pointer"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm font-medium">Upload PDF</span>
                            </label>

                            {/* Clear Chat */}
                            <button
                                onClick={clearChat}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Clear</span>
                            </button>

                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* File Info */}
                {fileInfo && (
                    <div className="bg-blue-50 border-b border-blue-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                    <div className="font-medium text-blue-900">{fileInfo.name}</div>
                                    <div className="text-sm text-blue-600">{fileInfo.length.toLocaleString()} characters extracted</div>
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50"
                >
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-3xl p-4 shadow-lg ${
                                message.sender === 'user' 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                    : message.sender === 'system'
                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    : 'bg-white text-gray-800 border border-gray-200'
                            }`}>
                                <div className="flex items-center space-x-2 mb-2">
                                    {message.sender === 'user' ? (
                                        <User className="w-4 h-4" />
                                    ) : message.sender === 'system' ? (
                                        <AlertCircle className="w-4 h-4" />
                                    ) : (
                                        <Bot className="w-4 h-4" />
                                    )}
                                    <span className="font-medium text-sm">
                                        {message.sender === 'user' ? 'You' : message.sender === 'system' ? 'System' : 'Assistant'}
                                    </span>
                                    {message.sender === 'user' && (
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            message.messageType === 'file' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {getMessageTypeIcon(message.messageType)}
                                            <span className="ml-1">{message.messageType === 'file' ? 'File Query' : 'General'}</span>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                />
                            </div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border border-gray-200 rounded-3xl p-4 shadow-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Bot className="w-4 h-4" />
                                    <span className="font-medium text-sm">Assistant</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-200 p-6">
                    {/* Quick Actions */}
                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-3">Quick Examples:</div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => askSampleQuestion('What are the symptoms of high blood pressure?')}
                                disabled={isProcessing}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs px-3 py-2 rounded-full transition-colors disabled:opacity-50"
                            >
                                <MessageCircle className="w-3 h-3 inline mr-1" />
                                General Question
                            </button>
                            {fileInfo && (
                                <button
                                    onClick={() => askSampleQuestion('Explain my lab results in simple terms')}
                                    disabled={isProcessing}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-3 py-2 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <FileText className="w-3 h-3 inline mr-1" />
                                    Ask about report
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex space-x-3">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={currentSessionId ? "Ask about your uploaded report..." : "Ask a medical question..."}
                            disabled={isProcessing}
                            className="flex-1 bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Send className="w-4 h-4" />
                            <span>Send</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Drag & Drop Overlay */}
            {isDragOver && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
                        <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Drop PDF Report Here</h3>
                        <p className="text-gray-600">Release to upload your medical report for analysis</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;