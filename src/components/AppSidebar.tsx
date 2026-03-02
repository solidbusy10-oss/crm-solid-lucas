import { Magnet, Trophy, CheckCircle, User } from "lucide-react";
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
import logoText from "@/assets/logo-solid-text.png";
import logoIcon from "@/assets/logo-solid-icon.png";

const allItems = [
  { title: "Meu Perfil", url: "/perfil", icon: User },
  { title: "Ranking de Vendas", url: "/", icon: Trophy },
  { title: "Eficácia", url: "/eficacia", icon: CheckCircle },
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
          <img src={logoIcon} alt="Solid Business" className="h-8 w-8 object-contain" />
        ) : (
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Solid Business" className="h-9 w-9 object-contain" />
            <img src={logoText} alt="Solid Business" className="h-7 object-contain opacity-90" />
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
