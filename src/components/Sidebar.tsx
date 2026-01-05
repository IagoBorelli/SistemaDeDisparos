import { NavLink } from 'react-router-dom';
import { House, ChatCircle, ChartBar, WhatsappLogo } from 'phosphor-react';
import clsx from 'clsx'; // clsx é ótimo para classes condicionais

const navItems = [
  { path: '/', label: 'Dashboard', icon: House },
  { path: '/mensagem', label: 'Mensagens', icon: ChatCircle },
  { path: '/relatorio', label: 'Relatórios', icon: ChartBar },
];

export function Sidebar() {
  return (
    <nav className="flex h-full w-60 flex-col bg-sidebar p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <WhatsappLogo size={28} className="text-action-primary" />
        <span className="text-xl font-bold text-text-primary">
          Sistema de Disparos
        </span>
      </div>

      {/* Lista de Navegação */}
      <ul className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end 
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-md px-4 py-2 text-text-secondary transition-colors',
                  {
                    'bg-action-primary text-white': isActive, 
                    'hover:bg-card hover:text-text-primary': !isActive,
                  }
                )
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}