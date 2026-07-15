const UserList = ({ users, activeUserId, onSelect }) => (
  <div className="space-y-2">
    {users.map((user) => (
      <button
        key={user._id || user.id}
        onClick={() => onSelect(user)}
        className={`w-full rounded-xl border p-3 text-left transition ${
          activeUserId === (user._id || user.id) ? 'border-sky-400 bg-sky-500/20' : 'border-white/20 bg-white/10 hover:bg-white/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{user.name}</span>
          <span className={`text-xs ${user.status === 'online' ? 'text-emerald-400' : 'text-slate-300'}`}>
            {user.status || 'offline'}
          </span>
        </div>
        <p className="text-xs text-slate-300">{user.email}</p>
      </button>
    ))}
  </div>
);

export default UserList;
