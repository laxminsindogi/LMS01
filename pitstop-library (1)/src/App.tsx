import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  User as UserIcon, 
  ShieldCheck, 
  Plus, 
  Library, 
  Search,
  Filter,
  Grid,
  List as ListIcon,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Mail,
  BookOpen,
  Calendar,
  Building
} from 'lucide-react';
import { Book, Role, User } from './types';
import AuthPage from './components/AuthPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('f1_token'));
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Books');
  const [activeNav, setActiveNav] = useState('Home');
  const [visibleBooksCount, setVisibleBooksCount] = useState(7);
  const [visibleBlogCount, setVisibleBlogCount] = useState(7);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [myLoans, setMyLoans] = useState<Book[]>([]);

  useEffect(() => {
    if (token) {
      validateToken();
      fetchMyLoans();
    }
    fetchBooks();
  }, [token]);

  useEffect(() => {
    if (activeNav === 'Blog') {
      // Small timeout to allow the component to render before scrolling
      setTimeout(() => {
        const blogList = document.getElementById('blog-registry-start');
        if (blogList) {
          blogList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeNav]);

  const fetchMyLoans = async () => {
    try {
      const res = await fetch('/api/my-loans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyLoans(data);
      }
    } catch (err) {
      console.error('Failed to fetch loans');
    }
  };

  const handleAllocate = async (bookId: number) => {
    try {
      const res = await fetch(`/api/books/${bookId}/allocate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchBooks();
        fetchMyLoans();
        alert('Book allocated successfully! Check your profile for details.');
      } else {
        const data = await res.json();
        alert(data.error || 'Allocation failed');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const validateToken = async () => {
    try {
      const res = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setCurrentUser(userData);
      } else {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    }
  };

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
  };

  const handleLogin = (user: User, token: string) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('f1_token', token);
    setActiveNav('Home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('f1_token');
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookData = {
      title: formData.get('title'),
      author: formData.get('author'),
      category: formData.get('category'),
      isbn: formData.get('isbn'),
      cover_url: formData.get('cover_url') || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?w=400&h=600&fit=crop',
    };

    const method = editingBook ? 'PUT' : 'POST';
    const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books';

    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData),
    });

    setIsFormOpen(false);
    setEditingBook(null);
    fetchBooks();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to retire this book from the grid?')) {
      await fetch(`/api/books/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchBooks();
    }
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Books' || b.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const role = currentUser.role;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-f1-dark f1-border shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              <div className="flex items-center">
                <span className="font-display font-black text-2xl tracking-tighter uppercase">
                  <span className="text-f1-red">Kle</span><span className="text-white ml-1">LIB</span>
                </span>
                <div className="ml-4 h-6 w-1 bg-f1-red rotate-12"></div>
              </div>

              <nav className="flex gap-2 items-center overflow-x-auto no-scrollbar py-2 -mx-2 px-2 max-w-[calc(100vw-120px)] md:max-w-none">
                {['Home', 'Blog', 'About', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveNav(item)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all duration-300 rounded-full border cursor-pointer whitespace-nowrap ${
                      activeNav === item 
                        ? 'bg-f1-red text-white border-f1-red shadow-[0_0_20px_rgba(255,24,1,0.4)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-2 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-f1-red flex items-center justify-center font-black italic text-[10px] md:text-xs text-white shrink-0">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] md:text-[10px] text-white font-black uppercase tracking-tighter leading-none truncate max-w-[60px]">{currentUser.username}</span>
                  <span className="text-[7px] md:text-[8px] text-f1-red font-bold uppercase tracking-widest leading-tight">{currentUser.role}</span>
                </div>
                <div className="h-4 w-[1px] bg-white/20 mx-0.5 md:mx-1" />
                <button 
                  onClick={() => setActiveNav('Profile')}
                  className={`p-1 md:p-1.5 rounded-full transition-all ${activeNav === 'Profile' ? 'bg-f1-red text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                  title="View Profile"
                >
                  <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1 md:p-1.5 text-gray-400 hover:text-f1-red hover:bg-f1-red/10 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

            <div className="flex sm:hidden items-center gap-2">
              {/* Optional: Add a simple search icon toggle for mobile if space is tight */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-f1-dark pt-20 pb-12 overflow-hidden border-b-4 border-f1-red">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-f1-red/10 skew-x-[-20deg] translate-x-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-f1-red" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-f1-red">
                  Elite Academic Resource
                </span>
              </div>
              <h1 className="font-display font-black text-5xl md:text-8xl uppercase italic leading-none mb-6">
                TODAY A READER, <br /> 
                <span className="text-transparent bg-clip-text bg-linear-to-r from-f1-red to-white">
                  TOMORROW A LEADER
                </span>
              </h1>
              <p className="text-gray-400 max-w-xl text-lg font-medium leading-relaxed">
                Experience technical superiority in research. Access the college's most elite academic 
                collection with unmatched speed and precision.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white/5 backdrop-blur-md p-6 border-l-4 border-f1-red">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Sector</span>
                <span className="text-2xl font-black italic">{role.toUpperCase()} PORTAL</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {activeNav === 'Home' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search library catalog..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleBooksCount(7);
                  }}
                  className="w-full bg-f1-gray border border-white/10 rounded-sm py-3 pl-12 pr-4 focus:outline-hidden focus:border-f1-red transition-colors font-medium text-white placeholder-gray-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                { (role === 'Employee' || role === 'Admin') && (
                  <button 
                    onClick={() => {
                      setEditingBook(null);
                      setIsFormOpen(true);
                    }}
                    className="bg-f1-blue px-8 py-3 f1-slant font-black uppercase text-sm flex items-center gap-2 hover:brightness-110 transition-all text-white"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Book
                  </button>
                )}
              </div>
            </div>

            {/* Categories / Tabs */}
            <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto pb-4 no-scrollbar">
              {['All Books', 'Engineering', 'Computer Science', 'Mathematics', 'Physics', 'Economics', 'Generic'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleBooksCount(7);
                  }}
                  className={`text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat ? 'text-f1-red border-b-2 border-f1-red pb-1' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Book List (F1 Style Table) */}
            <div className="bg-f1-gray rounded-lg overflow-hidden border-l-8 border-f1-red shadow-2xl">
              <div className="grid grid-cols-12 bg-f1-gray-dark p-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-white/5">
                <div className="col-span-2 md:col-span-1 text-center md:text-left">ID</div>
                <div className="col-span-2 md:col-span-1 text-center">Cover</div>
                <div className="col-span-5 md:col-span-4">Book Title</div>
                <div className="col-span-2 hidden md:block text-center text-xs">Category</div>
                <div className="col-span-3 md:col-span-2 text-center text-xs">Status</div>
                <div className="hidden md:block md:col-span-2 text-right">Actions</div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-f1-red scrollbar-track-f1-gray">
                <AnimatePresence mode="popLayout">
                  {filteredBooks.slice(0, visibleBooksCount).map((book, idx) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-12 p-4 border-b border-gray-700 items-center hover:bg-f1-gray-light transition-colors group"
                    >
                      <div className="col-span-2 md:col-span-1 font-mono text-f1-red text-sm text-center md:text-left">#{8800 + book.id}</div>
                      <div className="col-span-2 md:col-span-1 flex justify-center">
                        <img 
                          src={book.cover_url} 
                          alt="" 
                          className="w-10 h-14 md:w-8 md:h-10 object-cover rounded-sm transition-all border border-white/10 shadow-lg group-hover:scale-110" 
                        />
                      </div>
                      <div className="col-span-5 md:col-span-4 pl-4 md:pl-0">
                        <div className="font-bold text-white uppercase italic text-sm md:text-base leading-tight md:leading-normal truncate">{book.title}</div>
                        <div className="text-[10px] md:text-xs text-gray-400 italic font-normal truncate">{book.author}</div>
                      </div>
                      <div className="col-span-2 hidden md:block text-xs font-bold uppercase text-gray-300 text-center">{book.category}</div>
                      <div className="col-span-3 md:col-span-2 text-center">
                        <span className={`px-2 py-0.5 md:py-1 rounded text-[9px] md:text-[10px] font-black uppercase tracking-tighter ${book.available ? 'bg-green-900/50 text-green-300' : 'bg-f1-blue/30 text-blue-300'}`}>
                          {book.available ? 'Ready' : 'Issued'}
                        </span>
                      </div>
                      <div className="col-span-12 md:col-span-2 flex justify-start md:justify-end gap-2 mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-white/5">
                        {role !== 'Student' ? (
                          <>
                            <button 
                              onClick={() => {
                                setEditingBook(book);
                                setIsFormOpen(true);
                              }}
                              className="bg-f1-blue hover:brightness-110 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
                            >
                              Update
                            </button>
                            <button 
                              onClick={() => handleDelete(book.id)}
                              className="bg-f1-red hover:brightness-110 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setViewingBook(book)}
                              className="text-[10px] font-bold uppercase text-gray-400 hover:text-white transition-colors"
                            >
                              View
                            </button>
                            {book.available && (
                              <button 
                                onClick={() => handleAllocate(book.id)}
                                className="bg-f1-red hover:brightness-110 px-3 py-1 rounded text-[10px] font-black uppercase italic transition-all text-white border border-f1-red/50 shadow-[0_0_10px_rgba(255,24,1,0.2)]"
                              >
                                Allocate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {visibleBooksCount < filteredBooks.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleBooksCount(prev => prev + 7)}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 px-12 py-4 font-black uppercase italic tracking-[0.2em] f1-slant hover:bg-f1-red hover:text-white transition-all text-xs"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Load More Resources <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}

            {filteredBooks.length === 0 && (
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/20 rounded-md">
                <Library className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">No books found on the grid</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </div>
            )}
          </motion.div>
        )}

        {activeNav === 'Blog' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
            id="blog-registry-start"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-f1-red" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">TECHNICAL LOG REGISTRY</h2>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-f1-gray px-3 py-1 rounded-sm border border-white/5">
                Total Logs: {books.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.slice(0, visibleBlogCount).map((book, idx) => (
                <a 
                  key={idx}
                  href={`https://medium.com/search?q=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-f1-gray border border-white/5 p-5 hover:bg-f1-gray-light transition-all flex gap-5 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-full bg-white/5 skew-x-[-15deg] translate-x-12 group-hover:translate-x-4 transition-transform" />
                  
                  <div className="relative w-20 h-28 shrink-0">
                    <img 
                      src={book.cover_url} 
                      alt="" 
                      className="w-full h-full object-cover border border-white/10 shadow-xl group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-f1-dark/80 to-transparent flex items-end justify-center p-1">
                       <span className="text-[7px] font-black uppercase text-f1-red opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Connect</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-f1-red/20 text-[7px] font-black uppercase text-f1-red border border-f1-red/30 rounded-xs">Article</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Review</span>
                    </div>
                    <h3 className="text-lg font-black italic uppercase text-white group-hover:text-f1-red transition-colors leading-tight mb-1 truncate">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-3 line-clamp-2 italic">
                      Technical breakdown of {book.author}'s contribution to {book.category}.
                    </p>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-f1-red group-hover:gap-2 gap-1.5 transition-all">
                      Access Entry <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {visibleBlogCount < books.length && (
              <div className="flex justify-center mt-12 pb-12">
                <button
                  onClick={() => setVisibleBlogCount(prev => prev + 7)}
                  className="group relative overflow-hidden bg-f1-red/10 border border-f1-red/20 px-12 py-4 font-black uppercase italic tracking-[0.2em] f1-slant hover:bg-f1-red text-f1-red hover:text-white transition-all text-xs"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Expand Log Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}

            {books.length === 0 && (
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/20 rounded-md">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Loading Blog Engine...</h3>
                <p className="text-gray-500">Establish database connection to fetch deep dive logs.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeNav === 'About' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-f1-gray border border-white/10 p-12 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-1/2 h-full bg-f1-red/5 skew-x-[-15deg] translate-x-24" />
             <div className="relative z-10 max-w-2xl">
               <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-8">Engineering Distinction</h2>
               <p className="text-lg text-gray-300 font-medium leading-relaxed mb-6">
                 Kle Academic Systems represents the pinnacle of educational resource management. Built on the principles of speed, precision, and technical superiority, we provide an elite gateway to global knowledge.
               </p>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="block text-4xl font-black italic text-f1-red mb-1">99.8%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Resource Uptime</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-black italic text-f1-red mb-1">12K+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Academic Logs</span>
                  </div>
               </div>
             </div>
          </motion.div>
        )}

        {activeNav === 'Contact' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-20"
          >
             <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Direct Link</h2>
             <p className="text-gray-400 mb-12">Establish immediate communication with our system administrators.</p>
             <a href="mailto:support@kleacademic.edu" className="inline-block bg-white text-f1-dark px-12 py-5 font-black uppercase italic tracking-widest f1-slant hover:bg-f1-red hover:text-white transition-all text-xl">
               OPEN COMM CHANNEL
             </a>
          </motion.div>
        )}

        {activeNav === 'Profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left: Identity Card */}
            <div className="md:col-span-1">
              <div className="bg-f1-gray border-t-8 border-f1-red p-8 shadow-2xl sticky top-32">
                <div className="relative group mb-8 flex justify-center">
                  <div className="w-40 h-40 rounded-sm overflow-hidden border-4 border-white/10 group-hover:border-f1-red transition-colors relative">
                    {currentUser.avatar_url ? (
                      <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-f1-dark flex items-center justify-center">
                        <UserIcon className="w-16 h-16 text-gray-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Scan</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-f1-red p-2 text-white shadow-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black italic uppercase text-white truncate">{currentUser.username}</h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="h-0.5 w-4 bg-f1-red" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{currentUser.role} ID: #{8800 + currentUser.id}</span>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-4 h-4 text-f1-red" />
                    <span className="text-xs font-bold truncate">{currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Building className="w-4 h-4 text-f1-red" />
                    <span className="text-xs font-bold uppercase">{currentUser.role || 'Personnel'}</span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full mt-10 bg-white/5 border border-white/10 py-3 rounded-xs font-black uppercase italic tracking-widest text-xs hover:bg-f1-red hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Deauthorize
                </button>
              </div>
            </div>

            {/* Right: Demographics & Stats */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-f1-gray p-8 border-l-4 border-f1-red">
                <h3 className="text-xl font-black italic uppercase text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-f1-red" />
                  Personnel Demographics
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-black/20 p-4 border border-white/5">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Sector Age
                      </span>
                      <span className="text-xl font-black italic text-white">{currentUser.demographics?.age || '--'} Years</span>
                    </div>
                    <div className="bg-black/20 p-4 border border-white/5">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Building className="w-3 h-3" /> Assigned Unit
                      </span>
                      <span className="text-xl font-black italic text-white uppercase">{currentUser.demographics?.department || 'Unassigned'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-black/20 p-4 border border-white/5">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> Enrollment Reference
                      </span>
                      <span className="text-xl font-black italic text-white">{currentUser.demographics?.enrollmentYear || '2024'} Cycle</span>
                    </div>
                    <div className="bg-f1-blue/20 p-4 border border-f1-blue/30 h-full">
                       <span className="block text-[10px] font-black uppercase tracking-widest text-f1-blue-light mb-2">Access Level</span>
                       <div className="flex gap-1 mb-2">
                         {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className={`h-1.5 w-full ${currentUser.role === 'Admin' ? 'bg-f1-red' : (currentUser.role === 'Employee' && i <= 3 ? 'bg-f1-blue' : (currentUser.role === 'Student' && i <= 1 ? 'bg-green-500' : 'bg-white/10'))}`} />
                         ))}
                       </div>
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                         {currentUser.role === 'Admin' ? 'Level 5: Full System Access' : currentUser.role === 'Employee' ? 'Level 3: Resource Management' : 'Level 1: Academic Consumer'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-f1-red mb-4">Bio / Personnel Log</h4>
                   <p className="text-sm font-medium text-gray-400 italic leading-relaxed bg-black/20 p-6 border-r-4 border-white/5">
                      "{currentUser.demographics?.bio || 'No personnel bio has been recorded in the central database for this entity. Please update your profile from the main terminal if necessary.'}"
                   </p>
                </div>
              </div>

              {role === 'Student' && (
                <div className="bg-f1-blue/10 border border-f1-blue/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
                      <Library className="w-6 h-6 text-f1-blue" />
                      Active Allocations
                    </h3>
                    <span className="px-3 py-1 bg-f1-blue text-[10px] font-black uppercase italic tracking-widest">08:00 Cycle Update</span>
                  </div>
                  
                  <div className="flex flex-col gap-4 mt-4">
                    {myLoans.length > 0 ? (
                      myLoans.map(book => (
                        <div key={book.id} className="flex items-center gap-4 bg-black/20 p-4 border border-white/5 group hover:border-f1-red transition-all">
                          <img src={book.cover_url} alt="" className="w-10 h-14 object-cover" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-black italic uppercase text-white truncate text-sm">{book.title}</h5>
                            <p className="text-[10px] text-f1-red font-bold uppercase tracking-widest">#{8800 + book.id}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] font-black uppercase text-gray-500 block mb-1">Due Cycle</span>
                             <span className="text-[10px] font-black uppercase text-f1-blue tracking-tighter">72H REMAINING</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center border-t border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                          <BookOpen className="w-8 h-8 text-gray-600" />
                        </div>
                        <h4 className="text-lg font-black uppercase italic text-gray-500">No active book allocations</h4>
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-2">Visit the grid to initiate a resource request</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Book Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl bg-f1-gray border-t-8 border-f1-red p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-black text-3xl uppercase italic leading-none">
                {editingBook ? 'UPDATE RESOURCE' : 'NEW REPOSITORY ENTRY'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Book Title</label>
                <input 
                  name="title"
                  defaultValue={editingBook?.title}
                  required
                  className="w-full bg-f1-dark border border-white/10 p-3 text-white focus:outline-hidden focus:border-f1-red transition-colors"
                  placeholder="e.g. Aerodynamics in Speed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Author</label>
                  <input 
                    name="author"
                    defaultValue={editingBook?.author}
                    required
                    className="w-full bg-f1-dark border border-white/10 p-3 text-white focus:outline-hidden focus:border-f1-red transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                  <select 
                    name="category"
                    defaultValue={editingBook?.category}
                    className="w-full bg-f1-dark border border-white/10 p-3 text-white focus:outline-hidden focus:border-f1-red transition-colors"
                  >
                    <option>Engineering</option>
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Economics</option>
                    <option>Generic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">ISBN</label>
                  <input 
                    name="isbn"
                    defaultValue={editingBook?.isbn}
                    required
                    className="w-full bg-f1-dark border border-white/10 p-3 text-white focus:outline-hidden focus:border-f1-red transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cover URL</label>
                  <input 
                    name="cover_url"
                    defaultValue={editingBook?.cover_url}
                    className="w-full bg-f1-dark border border-white/10 p-3 text-white focus:outline-hidden focus:border-f1-red transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-f1-red py-4 font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-f1-red transition-all cursor-pointer f1-slant"
              >
                {editingBook ? 'APPLY MODIFICATIONS' : 'ADD TO REPOSITORY'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Book View Modal */}
      <AnimatePresence>
        {viewingBook && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="w-full max-w-3xl bg-f1-gray border-l-8 border-f1-red shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
            >
              <button 
                onClick={() => setViewingBook(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-f1-red transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto">
                <img 
                  src={viewingBook.cover_url} 
                  alt={viewingBook.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-3/5 p-8 flex flex-col">
                <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-f1-red mb-2 block">
                    Academic Specification
                  </span>
                  <h2 className="font-display font-black text-4xl uppercase italic leading-tight mb-2">
                    {viewingBook.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-8 bg-white/20" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">
                      Author: {viewingBook.author}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/20 p-4 border-l-2 border-white/10">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Resource ID</span>
                    <span className="font-mono text-f1-red font-bold text-lg">#{8800 + viewingBook.id}</span>
                  </div>
                  <div className="bg-black/20 p-4 border-l-2 border-white/10">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Category</span>
                    <span className="text-white font-black uppercase italic tracking-tighter">{viewingBook.category}</span>
                  </div>
                  <div className="bg-black/20 p-4 border-l-2 border-white/10">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</span>
                    <span className={`font-black uppercase italic tracking-tighter ${viewingBook.available ? 'text-green-500' : 'text-blue-300'}`}>
                      {viewingBook.available ? 'ACTIVE' : 'ISSUED'}
                    </span>
                  </div>
                  <div className="bg-black/20 p-4 border-l-2 border-white/10">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ISBN Reference</span>
                    <span className="text-gray-400 font-mono text-xs">{viewingBook.isbn}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-4">
                  <button className="flex-1 bg-f1-red text-white py-4 font-black uppercase tracking-widest text-sm italic f1-slant hover:brightness-110 active:translate-y-1 transition-all">
                    Reserve Now
                  </button>
                  <button 
                    onClick={() => setViewingBook(null)}
                    className="flex-1 bg-white/5 text-white py-4 font-black uppercase tracking-widest text-sm italic f1-slant border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-f1-gray-dark border-t border-f1-red py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> System Active</span>
              <span>Latency: {(Math.random() * 20 + 5).toFixed(0)}ms</span>
              <span>DB: Connected</span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              &copy; 2024 Kle Academic Systems | Library Portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
