import Layout from "@/components/layout";
import { MOCK_USERS, MOCK_MISSIONS } from "@/lib/mock-data";
import { ShieldAlert, CheckCircle, XCircle, BarChart3, Users, DollarSign } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'users'>('overview');

  return (
    <Layout>
      <div className="px-6 py-8 pb-24 bg-gray-50/50 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-slate-800 text-white p-2 rounded-lg">
            <ShieldAlert size={24} />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-800">Admin Console</h1>
        </div>

        {/* Admin Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['overview', 'missions', 'users', 'payments', 'disputes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab 
                  ? "bg-slate-800 text-white shadow-lg shadow-slate-800/20" 
                  : "bg-white text-slate-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <Users size={20} />
                  <span className="font-bold text-xs uppercase tracking-wider">Total Users</span>
                </div>
                <p className="text-3xl font-display font-bold">1,248</p>
                <span className="text-green-500 text-xs font-bold">+12% this week</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <DollarSign size={20} />
                  <span className="font-bold text-xs uppercase tracking-wider">Volume</span>
                </div>
                <p className="text-3xl font-display font-bold">$45,200</p>
                <span className="text-green-500 text-xs font-bold">+8% this week</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <ShieldAlert size={20} />
                  <span className="font-bold text-xs uppercase tracking-wider">Pending Review</span>
                </div>
                <p className="text-3xl font-display font-bold text-orange-500">14</p>
                <span className="text-slate-400 text-xs font-bold">Requires attention</span>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg">Recent Missions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-slate-500 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Mission</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MOCK_MISSIONS.map((mission) => (
                      <tr key={mission.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium">{mission.title}</td>
                        <td className="px-6 py-4">{mission.client.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            mission.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {mission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold">${mission.price}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={18} /></button>
                          <button className="p-1 text-red-500 hover:bg-red-50 rounded"><XCircle size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <BarChart3 size={48} className="mb-4 opacity-20" />
            <p className="font-medium">This section is under construction</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
