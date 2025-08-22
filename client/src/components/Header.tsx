import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X, Activity } from 'lucide-react';
import { getHomeContent } from '@/api/homeContent';

export function Header() {
  console.log('Header: Component rendering...');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerText, setHeaderText] = useState('Stellar Codex');

  console.log('Header: User state:', user ? 'logged in' : 'not logged in');
  console.log('Header: Current location:', location.pathname);

  useEffect(() => {
    console.log('Header: useEffect triggered, user:', user);
    
    const fetchHeaderText = async () => {
      try {
        console.log('Header: Fetching header text from home content...');
        const response = await getHomeContent();
        console.log('Header: Home content response:', response);
        
        if (response.homeContent?.headerText) {
          console.log('Header: Setting header text to:', response.homeContent.headerText);
          setHeaderText(response.homeContent.headerText);
        } else {
          console.log('Header: No headerText found, using default');
        }
      } catch (error) {
        console.error('Header: Error fetching header text:', error);
        console.log('Header: Using default header text due to error');
      }
    };

    if (user) {
      fetchHeaderText();
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    console.log('Header: Logout initiated');
    try {
      await logout();
      navigate('/login');
      console.log('Header: Logout successful');
    } catch (error) {
      console.error('Header: Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    const active = location.pathname === path || location.pathname.startsWith(path + '/');
    console.log('Header: Checking if path', path, 'is active:', active);
    return active;
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/project-tracker', label: 'Live Tracker', special: true },
    { path: '/blog', label: 'Blog' },
    { path: '/skills', label: 'Skills' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  console.log('Header: Navigation items:', navItems);
  console.log('Header: Current header text:', headerText);

  if (!user) {
    console.log('Header: No user, not rendering header');
    return null;
  }

  console.log('Header: Rendering header with text:', headerText);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {headerText}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              } ${
                item.special 
                  ? 'px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200'
                  : ''
              }`}
            >
              {item.special && <Activity className="h-3 w-3 mr-1.5 inline" />}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Desktop logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted'
                } ${
                  item.special 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                    : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.special && <Activity className="h-3 w-3 mr-1.5 inline" />}
                {item.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start mt-4 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}