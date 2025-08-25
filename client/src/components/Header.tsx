import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { getHomeContent } from '@/api/homeContent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  console.log('Header: Component rendering...');
  
  const { user, logout } = useAuth();
  console.log('Header: User state:', user ? 'logged in' : 'not logged in');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerText, setHeaderText] = useState('Stellar Codex');
  const location = useLocation();
  
  console.log('Header: Current location:', location.pathname);
  console.log('Header: User object details:', user);

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/project-tracker', label: 'Live Tracker', special: true },
    { path: '/blog', label: 'Blog' },
    { path: '/skills', label: 'Skills' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  console.log('Header: Navigation items:', navigationItems);
  console.log('Header: Current header text:', headerText);

  useEffect(() => {
    console.log('Header: useEffect triggered, user:', user);
    if (user) {
      console.log('Header: Fetching header text from home content...');
      const fetchHeaderText = async () => {
        try {
          const response = await getHomeContent();
          console.log('Header: Home content response:', response);
          if (response?.homeContent?.headerText) {
            console.log('Header: Setting header text to:', response.homeContent.headerText);
            setHeaderText(response.homeContent.headerText);
          }
        } catch (error) {
          console.error('Header: Error fetching home content:', error);
        }
      };
      fetchHeaderText();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    const isActive = location.pathname === path;
    console.log(`Header: Checking if path ${path} is active:`, isActive);
    return isActive;
  };

  console.log('Header: Rendering header with text:', headerText);
  console.log('Header: About to render user dropdown with User icon (no initials)');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo/Brand with colorful gradient styling */}
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300">
              {headerText}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-colors hover:text-foreground/80 ${
                isActivePath(item.path)
                  ? 'text-foreground'
                  : 'text-foreground/60'
              } ${
                item.special
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-md hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side items */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all duration-300">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
        <div className="md:hidden">
          <nav className="flex flex-col space-y-3 px-4 py-3 border-t bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-foreground/80 ${
                  isActivePath(item.path)
                    ? 'text-foreground font-medium'
                    : 'text-foreground/60'
                } ${
                  item.special
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 shadow-md'
                    : 'py-2'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="border-t pt-3">
                  <Link
                    to="/about"
                    className="flex items-center py-2 text-foreground/60 hover:text-foreground/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center py-2 text-foreground/60 hover:text-foreground/80 w-full text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}