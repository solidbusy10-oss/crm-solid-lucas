import { Magnet, Trophy, CheckCircle, User, ClipboardList } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import logoIcon from "@/assets/logo-solid-icon.png";
import logoText from "@/assets/logo-solid-text.png";

const allItems = [
  { title: "Meu Perfil", url: "/perfil", icon: User },
  { title: "Ranking de Vendas", url: "/", icon: Trophy },
  { title: "Eficácia", url: "/eficacia", icon: CheckCircle },
  { title: "Pós Venda", url: "/pos-venda", icon: ClipboardList },
  
  { title: "Inbound", url: "/inbound", icon: Magnet },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { canAccess } = useUserRole();

  const items = allItems.filter((item) => canAccess(item.url));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30">
      <SidebarHeader className="p-4 flex items-center justify-center">
        {collapsed ? (
          <img src={logoIcon} alt="Solid Business" className="h-8 w-8 object-contain mix-blend-lighten brightness-[3] sepia saturate-0" style={{filter: 'brightness(0) invert(1) brightness(0.85)'}} />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <img src={logoIcon} alt="Solid Business" className="h-12 w-12 object-contain" style={{filter: 'brightness(0) invert(1) brightness(0.85)'}} />
            <img src={logoText} alt="Solid Business" className="h-6 object-contain" style={{filter: 'brightness(0) invert(1) brightness(0.85)'}} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 text-xs uppercase tracking-widest">
            Páginas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-primary/20 text-primary font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
