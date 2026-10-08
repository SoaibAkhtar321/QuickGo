import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { HelpCircle, MessageSquare, Phone, ChevronDown, CheckCircle2, Send, ArrowLeft } from 'lucide-react';

interface CustomerSupportProps {
  onBack?: () => void;
}

export const CustomerSupport: React.FC<CustomerSupportProps> = ({ onBack }) => {
  const { createSupportTicket } = useApp();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How are delivery fares calculated on QuickGo?',
      a: 'Fares are dynamically calculated using a base fare + per-kilometer distance rate + nominal platform fee + 5% GST. Peak hours may apply transparent surge rules.',
    },
    {
      q: 'How does live GPS tracking work?',
      a: 'Once a verified delivery partner accepts your order, you can monitor their live location on our interactive vector map in real-time until delivery handover.',
    },
    {
      q: 'What if my package is delayed or I need to change address?',
      a: 'You can directly call or message the assigned delivery partner with one click via our secure in-app masked calling or chat system.',
    },
    {
      q: 'Can I cancel an active order?',
      a: 'Yes, you can cancel an order before the partner reaches the pickup location for a 100% instant refund back to your payment source.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    createSupportTicket(subject, description, 'medium');
    setSubmitted(true);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <h2 className="text-xl font-extrabold text-neutral-900">QuickGo Help & Support</h2>
        <p className="text-xs text-neutral-500">24x7 Assistance for customers and businesses</p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center mb-2">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Call Helpline</h4>
            <p className="text-[11px] text-neutral-500">1800-QUICKGO</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-[#FFF2EB] text-[#FF6B35] flex items-center justify-center mb-2">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">WhatsApp Support</h4>
            <p className="text-[11px] text-neutral-500">+91 98765 43210</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-neutral-100">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-2.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-neutral-900"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#FF6B35]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed bg-neutral-50 p-2.5 rounded-xl">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Raise Support Ticket Form */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Raise a Support Ticket
        </h3>

        {submitted ? (
          <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
            <h4 className="font-bold text-xs text-neutral-900">Support Ticket Created!</h4>
            <p className="text-[11px] text-neutral-600">
              Our operations desk has received your ticket and will respond within 15 minutes.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-[#FF6B35] underline"
            >
              Submit another query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-neutral-700 font-bold block mb-1">Issue Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Fare inquiry, package assistance..."
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#FF6B35] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-700 font-bold block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened..."
                rows={3}
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#FF6B35] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket to Ops Desk</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
