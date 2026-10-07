import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { Send, X, Shield, Clock, CheckCheck, Smile } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { activeChatOrderId, closeChat, messages, sendMessage, orders, currentRole, currentPartner, currentCustomer } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === activeChatOrderId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatOrderId]);

  if (!activeChatOrderId || !order) return null;

  const orderMessages = messages.filter((m) => m.orderId === activeChatOrderId);

  const partnerName = order.partnerName || currentPartner.name;
  const customerName = order.customerName || currentCustomer.name;
  const otherPartyName = currentRole === 'customer' ? partnerName : customerName;

  const quickReplies =
    currentRole === 'customer'
      ? ['Where are you right now?', 'Please ring the bell', 'Leave with the guard', 'I am at the gate']
      : ["I'm 2 minutes away", 'Arrived at pickup point', 'Please share flat number', 'Traffic near main circle'];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const senderRole = currentRole === 'customer' ? 'customer' : 'partner';
    sendMessage(activeChatOrderId, text.trim(), senderRole);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        id="chat-modal-card"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 flex flex-col h-[560px] max-h-[90vh] overflow-hidden"
      >
        {/* Chat Header */}
        <div className="bg-white border-b border-neutral-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/30 flex items-center justify-center font-bold text-[#FF6B35]">
                {otherPartyName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-neutral-900 text-sm">{otherPartyName}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                  #{order.id}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {currentRole === 'customer' ? 'Delivery Partner' : 'Customer'} • Online
              </p>
            </div>
          </div>

          <button
            onClick={closeChat}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Banner */}
        <div className="bg-[#FFF9F5] px-4 py-1.5 border-b border-[#FF6B35]/15 flex items-center justify-center gap-1.5 text-[11px] text-[#E85A2A] font-medium">
          <Shield className="w-3 h-3" /> QuickGo In-App Encrypted Chat
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]">
          {orderMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-4">
              <Smile className="w-8 h-8 mb-2 opacity-50 text-[#FF6B35]" />
              <p className="text-xs font-medium">Start conversation with {otherPartyName}</p>
              <p className="text-[11px]">Use quick replies below or type a custom message.</p>
            </div>
          ) : (
            orderMessages.map((msg) => {
              const isMine =
                (currentRole === 'customer' && msg.senderRole === 'customer') ||
                (currentRole === 'partner' && msg.senderRole === 'partner');

              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      isMine
                        ? 'bg-[#FF6B35] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMine ? 'text-white/80' : 'text-neutral-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-3 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSend(reply)}
              className="text-[11px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
        >
          <input
            id="chat-input-text"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${otherPartyName}...`}
            className="flex-1 bg-neutral-100 text-xs text-neutral-900 placeholder:text-neutral-400 px-4 py-2.5 rounded-xl border border-transparent focus:border-[#FF6B35] focus:bg-white focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#FF6B35] hover:bg-[#E85A2A] disabled:bg-neutral-200 text-white rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
