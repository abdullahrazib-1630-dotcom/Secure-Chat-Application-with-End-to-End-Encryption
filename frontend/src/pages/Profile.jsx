import { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [changePwd, setChangePwd] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    api.get('/users/profile').then((res) => setProfile(res.data.profile));
  }, []);

  const update = async (e) => {
    e.preventDefault();
    const res = await api.put('/users/profile', profile);
    setProfile(res.data.profile);
    setMessage('Profile updated');
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/change-password', changePwd);
    setMessage(res.data.message);
    setChangePwd({ oldPassword: '', newPassword: '' });
  };

  if (!profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
        <h1 className="mb-3 text-2xl font-bold">Profile</h1>
        <form className="space-y-3" onSubmit={update}>
          <input className="w-full rounded bg-slate-900/40 p-2" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <input className="w-full rounded bg-slate-900/40 p-2" value={profile.profilePicture || ''} placeholder="Profile picture URL" onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })} />
          <select className="w-full rounded bg-slate-900/40 p-2" value={profile.status} onChange={(e) => setProfile({ ...profile, status: e.target.value })}>
            <option value="online">Online</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
          </select>
          <button className="rounded bg-sky-600 px-4 py-2">Update Profile</button>
        </form>

        <h2 className="mt-6 text-lg font-semibold">Change Password</h2>
        <form className="mt-2 space-y-2" onSubmit={updatePassword}>
          <input className="w-full rounded bg-slate-900/40 p-2" type="password" placeholder="Old password" value={changePwd.oldPassword} onChange={(e) => setChangePwd({ ...changePwd, oldPassword: e.target.value })} />
          <input className="w-full rounded bg-slate-900/40 p-2" type="password" placeholder="New password" value={changePwd.newPassword} onChange={(e) => setChangePwd({ ...changePwd, newPassword: e.target.value })} />
          <button className="rounded bg-emerald-600 px-4 py-2">Change Password</button>
        </form>

        {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
