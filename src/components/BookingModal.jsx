import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, User, Mail, Phone, AlertCircle } from 'lucide-react';
import { sendInvitationEmails } from '../services/emailService';
import { getLocalData, setLocalData } from '../services/supabaseClient';

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    org_name: '',
    event_type: 'Corporate Executive Keynote',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    event_date: '',
    audience_size: '100 - 500 Attendees',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send Direct Email via Resend
      const result = await sendInvitationEmails(formData);
      setDispatchResult(result);

      // 2. Save Invitation Record to Supabase / LocalStorage
      const currentInvitations = getLocalData('invitations') || [];
      const newInv = {
        id: 'inv-' + Date.now(),
        ...formData,
        status: 'Pending',
        created_at: new Date().toISOString().split('T')[0]
      };
      setLocalData('invitations', [newInv, ...currentInvitations]);

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="gradient-saffron text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Invite Kadamb Kanan Das</h3>
            <p className="text-xs text-amber-100 mt-1">Submit details for a Keynote Speech, Corporate Retreat or College Conclave.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                dispatchResult?.delivered ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {dispatchResult?.delivered ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <h4 className="text-2xl font-bold text-slate-900">
                {dispatchResult?.delivered ? 'Email Delivered to Your Inbox!' : 'Invitation Request Saved in CMS!'}
              </h4>

              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {dispatchResult?.delivered ? (
                  <>
                    Direct email notification has been dispatched to <strong>kadambkanan.rns@gmail.com</strong> (Ref ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">{dispatchResult.emailId}</code>).
                  </>
                ) : (
                  <>
                    Invitation details for <strong>{formData.org_name}</strong> have been securely saved in your <strong>Admin CMS Panel</strong>.
                  </>
                )}
              </p>

              {!dispatchResult?.delivered && dispatchResult?.reason && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3.5 rounded-2xl max-w-md mx-auto text-left space-y-1.5">
                  <p className="font-bold text-amber-900">Resend API Response Details:</p>
                  <p className="font-mono text-[11px] bg-white p-2 rounded border border-amber-200 text-slate-700 break-words">
                    {dispatchResult.reason}
                  </p>
                  <p className="text-[11px] text-amber-800 pt-1 leading-normal">
                    💡 <strong>Quick Fix Check:</strong> Ensure your Resend account was created using <code>kadambkanan.rns@gmail.com</code> (Resend free tier only sends to your registered account email), or check your Gmail <strong>Spam / Promotions</strong> folder.
                  </p>
                </div>
              )}

              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="gradient-saffron text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-sm mt-4"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Organization / College Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="org_name"
                      required
                      placeholder="e.g. Infosys / IIT Kharagpur"
                      value={formData.org_name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Type</label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                  >
                    <option value="Corporate Executive Keynote">Corporate Executive Keynote</option>
                    <option value="College Youth Conclave">College Youth Conclave</option>
                    <option value="Leadership & Wellness Retreat">Leadership & Wellness Retreat</option>
                    <option value="Universal Human Values Workshop">Universal Human Values Workshop</option>
                    <option value="Online Webinar">Online Webinar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Contact Person <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="contact_name"
                      required
                      placeholder="Your Name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="contact_email"
                      required
                      placeholder="name@company.com"
                      value={formData.contact_email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="contact_phone"
                      placeholder="+91 9876543210"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Proposed Event Date</label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Estimated Attendees</label>
                  <select
                    name="audience_size"
                    value={formData.audience_size}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                  >
                    <option value="50 - 100 Attendees">50 - 100 Attendees</option>
                    <option value="100 - 500 Attendees">100 - 500 Attendees</option>
                    <option value="500 - 2000+ Attendees">500 - 2000+ Attendees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Theme / Specific Topics Requested</label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Briefly describe your event goals or preferred topic..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-saffron text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {loading ? 'Dispatching...' : <><Send className="w-4 h-4" /> Submit Invitation Request</>}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
