
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AdminPanel } from './components/AdminPanel';
import { getInvestmentAdvice, generateProductDescription } from './services/gemini';

const LoginPage: React.FC = () => {
  const { login, register, settings } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleAdmin = () => {
    setIsAdminMode(!isAdminMode);
    setPhone(isAdminMode ? '' : 'admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isAdminMode) {
        const success = await login(phone, password);
        if (!success) alert("Admin Access Denied.");
      } else if (isLogin) {
        const success = await login(phone, password);
        if (!success) alert("Invalid credentials");
      } else {
        if (phone.length !== 10) {
          alert("Enter valid 10-digit number");
          return;
        }
        const success = await register(name, phone, password);
        if (!success) alert("Registration failed");
      }
    } catch (err) {
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f172a]">
      <div className={`w-full max-w-sm glass p-6 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden border-white/5 transition-all duration-500 ${isAdminMode ? 'border-rose-500/30' : ''}`}>
        <div className="text-center">
          <div 
            onDoubleClick={toggleAdmin}
            className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-2xl transition-all cursor-pointer select-none active:scale-90 ${isAdminMode ? 'bg-rose-600' : 'bg-emerald-500'}`}
          >
            {settings.appLogo}
          </div>
          <h2 className="text-2xl font-black mb-1 tracking-tight">
            {isAdminMode ? 'System Admin' : (isLogin ? settings.appName : 'Create Account')}
          </h2>
          <p className="text-slate-400 text-xs px-4">
            {isAdminMode ? 'Restricted Access Only' : (isLogin ? 'Sign in to access your dashboard' : 'Join the leading energy network')}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && !isAdminMode && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full text-sm bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="text"
            placeholder={isAdminMode ? "Admin User" : "Mobile Number"}
            className={`w-full text-sm bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 outline-none focus:ring-2 transition-all ${isAdminMode ? 'focus:ring-rose-500' : 'focus:ring-emerald-500'}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            readOnly={isAdminMode}
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full text-sm bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 outline-none focus:ring-2 transition-all ${isAdminMode ? 'focus:ring-rose-500' : 'focus:ring-emerald-500'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-black py-3 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2 ${isAdminMode ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-black'}`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isLogin ? 'Login ⚡' : 'Register ⚡')}
          </button>
        </form>

        {!isAdminMode && (
          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-400 font-bold text-xs"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, products, buyProduct } = useApp();
  const [advice, setAdvice] = useState('Optimizing modules...');
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.balance !== undefined) {
      getInvestmentAdvice(user.balance).then(setAdvice);
    }
  }, [user?.balance]);

  const handleBuy = async (productId: string) => {
    setBuyingId(productId);
    const success = await buyProduct(productId);
    if (success) {
      alert("Plan Activated!");
    } else {
      alert("Insufficient Balance.");
    }
    setBuyingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden glass p-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-600/20 via-[#1e293b] to-blue-600/10 border-white/5">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-emerald-400 text-[10px] font-black mb-1 uppercase tracking-widest opacity-80">Wallet Balance</h3>
              <p className="text-4xl font-black tracking-tight">₹{(user?.balance || 0).toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl shadow-lg border-white/10">💰</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-3 rounded-2xl bg-white/5 border-white/5">
              <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Active Assets</p>
              <p className="font-black text-sm">₹{user?.totalInvestment.toLocaleString()}</p>
            </div>
            <div className="glass p-3 rounded-2xl bg-white/5 border-white/5">
              <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Life Earnings</p>
              <p className="font-black text-sm text-emerald-400">₹{user?.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-4 rounded-2xl flex items-center gap-4 border-l-4 border-emerald-400">
        <div className="w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner">🤖</div>
        <p className="text-[11px] font-semibold leading-tight text-slate-200">{advice}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-black">Market Highlights</h2>
          <button className="text-[10px] font-black text-emerald-400 uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {products.slice(0, 3).map(p => (
            <div key={p.id} className="glass p-4 rounded-3xl border-white/5 flex gap-4 items-center">
              <img src={p.image} className="w-16 h-16 rounded-2xl object-cover border border-white/5" alt={p.name} />
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm truncate">{p.name}</h4>
                <p className="text-[10px] text-emerald-400 font-bold">₹{p.dailyIncome}/Day profit</p>
                <p className="text-[10px] text-slate-500">Cost: ₹{p.price}</p>
              </div>
              <button 
                onClick={() => handleBuy(p.id)}
                disabled={buyingId === p.id}
                className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-[10px] font-black shadow-lg active:scale-95 transition-all"
              >
                {buyingId === p.id ? '...' : 'Buy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Invest: React.FC = () => {
  const { products, buyProduct } = useApp();
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    products.forEach(p => {
      generateProductDescription(p.name, p.dailyIncome).then(desc => {
        setDescriptions(prev => ({ ...prev, [p.id]: desc }));
      });
    });
  }, [products]);

  const handleBuy = async (productId: string) => {
    setBuyingId(productId);
    const success = await buyProduct(productId);
    if (success) {
      alert("Plan Activated Successfully!");
    } else {
      alert("Insufficient Balance!");
    }
    setBuyingId(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black px-1">Global Marketplace</h2>
      <div className="space-y-4">
        {products.map(p => (
          <div key={p.id} className="glass p-5 rounded-[2.5rem] space-y-4 border-white/5">
            <div className="flex gap-4">
              <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 border border-white/10 shadow-xl">
                <img src={p.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="font-black text-lg truncate leading-tight">{p.name}</h3>
                <span className="text-[8px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 inline-block mt-1">{p.category}</span>
                <p className="text-[10px] text-slate-400 italic mt-3 line-clamp-3 leading-tight opacity-70">"{descriptions[p.id] || 'Generating smart plan details...'}"</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
              <div className="text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Deposit</p>
                <p className="font-black text-sm">₹{p.price}</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Income</p>
                <p className="font-black text-sm text-emerald-400">₹{p.dailyIncome}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Cycle</p>
                <p className="font-black text-sm">{p.validityDays} Days</p>
              </div>
            </div>

            <button 
              onClick={() => handleBuy(p.id)} 
              disabled={buyingId === p.id}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${buyingId === p.id ? 'bg-slate-700' : 'bg-emerald-500 text-black shadow-emerald-500/20 active:scale-95'}`}
            >
              {buyingId === p.id ? 'Processing Activation...' : 'Activate Plan ⚡'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Wallet: React.FC = () => {
  const { recharge, withdraw, user, transactions, settings } = useApp();
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [userUpi, setUserUpi] = useState('');
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw'>('recharge');
  const [showUtrField, setShowUtrField] = useState(false);

  const handlePay = () => {
    if (!amount || Number(amount) < settings.minRecharge) {
      alert(`Min deposit ₹${settings.minRecharge}`);
      return;
    }
    window.location.href = `upi://pay?pa=${settings.platformUpi}&pn=${settings.appName}&am=${amount}&cu=INR`;
    setShowUtrField(true);
  };

  const handleRechargeSubmit = () => {
    if (!utr) return alert("Enter 12-digit UTR");
    recharge(Number(amount), utr);
    alert("Recharge request sent! Processing in background.");
    setAmount(''); setUtr(''); setShowUtrField(false);
  };

  const handleWithdraw = async () => {
    const amt = Number(amount);
    if (!amt || amt < settings.minWithdrawal) return alert(`Min withdrawal ₹${settings.minWithdrawal}`);
    if (!userUpi) return alert("Enter UPI ID");
    const success = await withdraw(amt, userUpi);
    if (success) { alert("Withdrawal in progress!"); setAmount(''); setUserUpi(''); }
    else alert("Low wallet balance.");
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1.5 p-1 glass rounded-2xl border-white/5">
        <button onClick={() => setActiveTab('recharge')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'recharge' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>Add Money</button>
        <button onClick={() => setActiveTab('withdraw')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'withdraw' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>Payout</button>
      </div>

      <div className="glass p-8 rounded-[2.5rem] space-y-6 border-white/5">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Withdrawable Balance</p>
          <p className="text-5xl font-black text-emerald-400">₹{(user?.balance || 0).toFixed(0)}</p>
        </div>

        {activeTab === 'recharge' ? (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black">₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-8 pr-4 text-xl font-black outline-none focus:border-emerald-500" />
            </div>
            {!showUtrField ? (
              <button onClick={handlePay} className="w-full bg-emerald-500 py-4 rounded-2xl text-black font-black shadow-lg active:scale-95 transition-all">Instant UPI Deposit 📱</button>
            ) : (
              <div className="space-y-3">
                <input type="text" value={utr} onChange={e => setUtr(e.target.value)} placeholder="12-digit UTR Number" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 text-center font-black outline-none focus:border-emerald-500" />
                <button onClick={handleRechargeSubmit} className="w-full bg-white py-4 rounded-2xl text-black font-black text-sm">Verify Payment ⚡</button>
              </div>
            )}
            <p className="text-[9px] text-slate-500 text-center font-bold">MIN RECHARGE: ₹{settings.minRecharge}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black">₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-8 pr-4 text-xl font-black outline-none focus:border-emerald-500" />
            </div>
            <input type="text" value={userUpi} onChange={e => setUserUpi(e.target.value)} placeholder="Your UPI ID (name@upi)" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-emerald-500" />
            <button onClick={handleWithdraw} className="w-full bg-white py-4 rounded-2xl text-black font-black shadow-lg active:scale-95 transition-all">Withdraw Funds 💸</button>
            <p className="text-[9px] text-slate-500 text-center font-bold">MIN PAYOUT: ₹{settings.minWithdrawal}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="px-2 text-[10px] text-slate-500 uppercase font-black tracking-widest">Transaction Records</h4>
        <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
          {transactions.filter(tx => tx.userId === user?.id).map(tx => (
            <div key={tx.id} className="glass p-3 rounded-2xl flex justify-between items-center border-white/5">
              <div className="flex gap-3 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${tx.type === 'recharge' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {tx.type === 'recharge' ? '📥' : '📤'}
                </div>
                <div>
                  <p className="font-black capitalize text-[11px] leading-none mb-1">{tx.type}</p>
                  <p className="text-[8px] text-slate-400">{new Date(tx.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${tx.type === 'withdraw' ? 'text-rose-400' : 'text-emerald-400'}`}>₹{tx.amount}</p>
                <span className={`text-[7px] uppercase font-black px-2 py-0.5 rounded-full bg-white/5`}>{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, logout, redeemGift, settings } = useApp();
  const [giftCode, setGiftCode] = useState('');
  const [view, setView] = useState<'main' | 'assets' | 'about'>('main');

  const ProfileCard: React.FC<{ icon: string, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="glass p-5 rounded-3xl flex items-center gap-4 active:scale-95 transition-all border-white/5 w-full">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner">{icon}</div>
      <span className="font-black text-sm uppercase tracking-wide flex-1 text-left">{label}</span>
      <span className="text-slate-600">→</span>
    </button>
  );

  if (view === 'assets') return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('main')} className="w-10 h-10 glass rounded-full flex items-center justify-center text-xl">←</button>
        <h2 className="text-2xl font-black">Investment Portfolio</h2>
      </div>
      <div className="space-y-4">
        {user?.activeInvestments.length === 0 ? (
          <div className="glass p-20 rounded-[3rem] text-center space-y-4 border-dashed border-white/10">
            <p className="text-slate-500 font-black uppercase text-[10px]">No active assets</p>
          </div>
        ) : (
          user?.activeInvestments.map(inv => (
            <div key={inv.id} className="glass p-5 rounded-[2rem] border-l-4 border-emerald-500 space-y-2">
              <h3 className="font-black text-base">{inv.productName}</h3>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>Daily Profit: ₹{inv.dailyReturn}</span>
                <span>Exp: {new Date(inv.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (view === 'about') return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('main')} className="w-10 h-10 glass rounded-full flex items-center justify-center text-xl">←</button>
        <h2 className="text-2xl font-black">Our Vision</h2>
      </div>
      <div className="glass p-8 rounded-[3rem] space-y-6 border-white/5">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-2xl">{settings.appLogo}</div>
          <h3 className="text-2xl font-black">{settings.appName}</h3>
          <p className="text-sm text-slate-300 leading-relaxed italic opacity-80">"{settings.aboutContent}"</p>
        </div>
        <div className="pt-6 border-t border-white/5 space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
            <span>Protocol Version</span>
            <span className="text-emerald-400">v4.6.0 Stable</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
            <span>Support</span>
            <span className="text-blue-400">Telegram @OfficialHelp</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-6">
      <div className="glass p-8 rounded-[3rem] bg-gradient-to-br from-indigo-900/20 to-blue-900/10 text-center relative border-white/5 shadow-2xl">
        <div className="w-24 h-24 bg-slate-800 rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl mb-4 shadow-xl border-2 border-emerald-500/20">{settings.appLogo}</div>
        <h2 className="text-2xl font-black tracking-tight mb-1">{user?.name}</h2>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">{user?.phone}</p>
        <div className="mt-6 inline-block glass px-4 py-2 rounded-2xl bg-white/5">
          <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Asset Power</p>
          <p className="text-xl font-black text-emerald-400 tracking-tighter">₹{user?.totalInvestment.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <ProfileCard icon="📊" label="My Assets" onClick={() => setView('assets')} />
        <ProfileCard icon="ℹ️" label="About Us" onClick={() => setView('about')} />
        
        <div className="glass p-6 rounded-[2.5rem] space-y-4 border-white/5">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Claim Special Bonus</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="GIFT CODE" 
              value={giftCode} 
              onChange={e => setGiftCode(e.target.value)} 
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 font-black text-xs uppercase outline-none focus:border-emerald-500 transition-all" 
            />
            <button 
              onClick={() => redeemGift(giftCode.toUpperCase())} 
              className="bg-emerald-500 text-black font-black px-6 py-3 rounded-2xl text-xs shadow-lg active:scale-95 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <button onClick={logout} className="w-full py-5 rounded-[2rem] bg-rose-500/10 text-rose-500 font-black text-sm border border-rose-500/20 active:scale-95 transition-all shadow-lg">Terminate Session 🚪</button>
    </div>
  );
};

const Team: React.FC = () => {
  const { user, settings } = useApp();
  return (
    <div className="space-y-6">
      <div className="glass p-10 rounded-[3rem] bg-gradient-to-br from-indigo-950/40 to-blue-900/20 text-center shadow-2xl border-white/5">
        <h2 className="text-2xl font-black mb-1">Network Hub</h2>
        <p className="text-xs text-slate-400 mb-8 px-4 leading-relaxed">Grow your grid and earn up to 15% team commissions daily.</p>
        <div className="glass p-6 rounded-[2rem] bg-white/5 mb-8 border-white/5">
          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Referral Protocol ID</p>
          <p className="text-4xl font-black text-emerald-400 tracking-[0.2em]">{user?.referralCode}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(user?.referralCode || ''); alert('Copied to clipboard!'); }} className="w-full bg-indigo-500 py-5 rounded-[2rem] font-black active:scale-95 transition-all shadow-xl shadow-indigo-500/20">Copy Referral Link 🔗</button>
        <div className="grid grid-cols-2 gap-4 mt-8">
           <div className="glass p-4 rounded-3xl bg-white/5 border-white/5">
              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Nodes</p>
              <p className="text-2xl font-black">{user?.referrals || 0}</p>
           </div>
           <div className="glass p-4 rounded-3xl bg-white/5 border-white/5">
              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Total Yield</p>
              <p className="text-2xl font-black text-emerald-400">₹0</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (user?.isAdmin) setActiveTab('admin');
    else setActiveTab('home');
  }, [user]);

  if (!user) return <LoginPage />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {user.isAdmin ? (
        <>
          {activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'profile' && <Profile />}
        </>
      ) : (
        <>
          {activeTab === 'home' && <Dashboard />}
          {activeTab === 'invest' && <Invest />}
          {activeTab === 'wallet' && <Wallet />}
          {activeTab === 'team' && <Team />}
          {activeTab === 'profile' && <Profile />}
        </>
      )}
    </Layout>
  );
};

const App: React.FC = () => <AppProvider><MainApp /></AppProvider>;
export default App;
