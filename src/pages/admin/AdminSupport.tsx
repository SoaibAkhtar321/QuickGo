import React from 'react';
import { useApp } from '../../store/AppContext';
import { HelpCircle, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const AdminSupport: React.FC = () => {
  const { tickets = [], supportTickets, resolveSupportTicket, updateTicketStatus } = useApp();
  const ticketList = supportTickets || tickets || [];

  const handleResolve = (ticketId: string) => {
    if (resolveSupportTicket) {
      resolveSupportTicket(ticketId);
    } else if (updateTicketStatus) {
      updateTicketStatus(ticketId, 'RESOLVED');
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div>
        <h2 className="text-xl font-extrabold text-neutral-900">Helpdesk & Support Tickets</h2>
        <p className="text-xs text-neutral-500">
          Inquiries, customer delivery issues, and refund requests
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Ticket ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Issue & Query</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {ticketList.map((ticket) => {
                const isResolved =
                  ticket.status === 'RESOLVED' ||
                  ticket.status === 'resolved' ||
                  (ticket.status as string) === 'Closed';
                const isHighPriority =
                  ticket.priority === 'HIGH' ||
                  ticket.priority === 'URGENT' ||
                  (ticket.priority as string) === 'high';
                const issueTitle = ticket.issue || (ticket as any).subject || 'Delivery Support';
                const messageDesc =
                  ticket.messages?.[0]?.text ||
                  (ticket as any).description ||
                  `Order #${ticket.orderId || 'General'}`;

                return (
                  <tr key={ticket.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-neutral-900">
                      {ticket.ticketNumber || `#${ticket.id}`}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-neutral-900">
                      {ticket.customerName}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-neutral-900">{issueTitle}</div>
                      <div className="text-neutral-500 text-[11px] max-w-sm truncate">
                        {messageDesc}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isHighPriority
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isResolved
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isResolved ? 'RESOLVED' : 'OPEN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {!isResolved ? (
                        <button
                          onClick={() => handleResolve(ticket.id)}
                          className="bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition-colors shadow-2xs"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-medium">✓ Closed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
