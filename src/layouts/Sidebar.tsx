import { BarChart3, Package, Warehouse, Home } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

export const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '#sales', icon: BarChart3, label: 'Sales', isHash: true },
    { to: '#products', icon: Package, label: 'Products', isHash: true },
    { to: '#warehouse', icon: Warehouse, label: 'Warehouse', isHash: true },
  ];

  const handleHashClick = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(hash);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isHash) {
            return (
              <a
                key={item.to}
                href={item.to}
                onClick={handleHashClick(item.to)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeClassName="bg-accent text-accent-foreground"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
