// Destructure Globals
const { useState, useEffect } = React;
const { createRoot } = ReactDOM;
const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip: RechartsTooltip, ResponsiveContainer, BarChart, Bar } = Recharts;
const { Trash2, LogOut, Eye, Hand, Users, Building, MapPin, Clock, MousePointerClick, Globe, ArrowUpRight } = lucide;

// Firebase Globals (Compat)
const firebaseConfig = {
    projectId: "offlineclub-admin-2025",
    appId: "1:548650740560:web:cb4aea73bbd005b1785a55",
    storageBucket: "offlineclub-admin-2025.firebasestorage.app",
    apiKey: "AIzaSyB35dGg37sgbgB-EOV1qMAHGvqhaTm54lE",
    authDomain: "offlineclub-admin-2025.firebaseapp.com",
    messagingSenderId: "548650740560"
};

// Initialize Firebase (Compat)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Simple Login Component
const Login = () => {
    const handleLogin = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Erro ao fazer login: " + error.message);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
            {/* Usando imagem estática ou cor sólida se vídeo falhar, mas mantendo a ref original */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0" />
            <div className="glass p-8 rounded-2xl z-10 flex flex-col items-center gap-6 max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold">Admin Portal</h1>
                <p className="text-gray-400 text-center">Acesse o dashboard para visualizar as métricas.</p>
                <button onClick={handleLogin} className="pill bg-white/10 hover:bg-white/20 text-white font-semibold w-full flex items-center justify-center gap-2">
                    <Globe size={20} />
                    Entrar com Google
                </button>
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [visits, setVisits] = useState([]);
    const [clicks, setClicks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) return;

        // Realtime Visits
        const qVisits = db.collection('visits').orderBy('timestamp', 'desc').limit(100);
        const unsubVisits = qVisits.onSnapshot((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVisits(data);
        });

        // Realtime Clicks
        const qClicks = db.collection('clicks').orderBy('timestamp', 'desc').limit(100);
        const unsubClicks = qClicks.onSnapshot((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClicks(data);
        });

        return () => {
            unsubVisits();
            unsubClicks();
        };
    }, [user]);

    const handleLogout = () => auth.signOut();

    const handleClear = async () => {
        if (!confirm("Tem certeza que deseja limpar TODOS os logs?")) return;
        alert("Função de limpar logs desativada por segurança no frontend.");
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
    if (!user) return <Login />;

    // Metrics Calculation
    const totalVisits = visits.length;
    const totalClicks = clicks.length;
    const uniqueCities = new Set(visits.map(v => v.city)).size;
    const sources = visits.reduce((acc, curr) => {
        const src = curr.source || 'Direto';
        acc[src] = (acc[src] || 0) + 1;
        return acc;
    }, {});
    const topSources = Object.entries(sources).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

    const visitsByDate = visits.reduce((acc, curr) => {
        const date = curr.timestamp?.toDate ? curr.timestamp.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'Hoje';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const visitsChartData = Object.entries(visitsByDate).map(([name, visits]) => ({ name, visits })).reverse();


    return (
        <div className="min-h-screen w-full bg-black text-white relative font-sans">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {/* Placeholder gradient background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black opacity-80"></div>
            </div>

            <main className="relative z-20 flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Dashboard de Análise</h1>
                    <div className="flex gap-2">
                        <button onClick={handleClear} className="px-4 py-2 glass border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                            <Trash2 size={16} /> Limpar Tudo
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 glass border border-white/10 hover:bg-white/10 rounded-xl flex items-center gap-2 cursor-pointer">
                            <LogOut size={16} /> Sair
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total de Visitas" value={totalVisits} icon={Eye} color="text-purple-400" />
                    <StatCard label="Total de Cliques" value={totalClicks} icon={Hand} color="text-green-400" />
                    <StatCard label="Fontes de Tráfego" value={Object.keys(sources).length} icon={Users} color="text-blue-400" />
                    <StatCard label="Cidades Únicas" value={uniqueCities} icon={Building} color="text-orange-400" />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="glass border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Tendência de Visitas</h2>
                            <ArrowUpRight size={16} className="text-gray-400" />
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitsChartData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="visits" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Distribuição de Fontes</h2>
                            <Users size={16} className="text-gray-400" />
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topSources} layout="vertical" margin={{ left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                    <XAxis type="number" stroke="#666" fontSize={12} hide />
                                    <YAxis dataKey="name" type="category" stroke="#999" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                    <Bar dataKey="value" fill="#fff" radius={[0, 4, 4, 0]} barSize={20} fillOpacity={0.8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Logs */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <LogList title="Log de Visitas" data={visits} type="visit" />
                    <LogList title="Log de Cliques" data={clicks} type="click" />
                </div>
            </main>
        </div>
    );
};

// Sub-components
const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="glass border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">{label}</p>
            <Icon size={16} className={color} />
        </div>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

const LogList = ({ title, data, type }) => (
    <div className="glass border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="max-h-[300px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {data.length === 0 ? <p className="text-gray-500 text-sm">Nenhum registro.</p> : data.map((item, i) => (
                <div key={i} className="flex flex-col bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all cursor-pointer border border-white/5">
                    <div className="flex justify-between items-center w-full">
                        <span className="text-gray-300 flex items-center gap-2 truncate">
                            {type === 'visit' ? <MapPin size={16} className="text-purple-400 flex-shrink-0" /> : <MousePointerClick size={16} className="text-blue-400 flex-shrink-0" />}
                            <span className="truncate">{type === 'visit' ? (item.city || 'Desconhecida') : (item.element || 'Clique')}</span>
                        </span>
                        <span className="text-gray-500 flex items-center gap-2 text-xs">
                            <Clock size={12} />
                            {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const root = createRoot(document.getElementById('root'));
root.render(<Dashboard />);
