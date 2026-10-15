<script setup lang="ts">
import {
  ArrowLeft,
  LayoutDashboard,
  ListChecks,
  ShieldCheck,
  X,
} from "@lucide/vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";

const route = useRoute();
const { isMobile, setOpenMobile } = useSidebar();
const adminItems = [
  { to: "/pet-adm", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/pet-adm/features", label: "Fonctionnalités", icon: ListChecks },
];

const isActive = (path: string) =>
  path === "/pet-adm"
    ? route.path === path || route.path === `${path}/`
    : route.path === path || route.path.startsWith(`${path}/`);

watch(
  () => route.fullPath,
  () => setOpenMobile(false),
);
</script>

<template>
  <Sidebar collapsible="icon" class="bg-white">
    <SidebarHeader class="border-b border-sidebar-border bg-white">
      <div class="flex h-12 items-center gap-2 px-2">
        <ShieldCheck class="size-5 shrink-0 text-primary" />
        <span
          class="truncate font-semibold group-data-[collapsible=icon]:hidden"
          >Administration</span
        >
        <button
          v-if="isMobile"
          type="button"
          class="ml-auto rounded-md p-2 hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          aria-label="Fermer la navigation admin"
          @click="setOpenMobile(false)"
        >
          <X class="size-4" />
        </button>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Gestion PetCare</SidebarGroupLabel>
        <SidebarGroupContent>
          <nav aria-label="Navigation admin">
            <SidebarMenu>
              <SidebarMenuItem v-for="item in adminItems" :key="item.to">
                <SidebarMenuButton
                  as-child
                  :is-active="isActive(item.to)"
                  :tooltip="item.label"
                  class="data-[active=true]:bg-[#269394]/10 data-[active=true]:text-primary"
                >
                  <NuxtLink
                    :to="item.to"
                    :aria-current="isActive(item.to) ? 'page' : undefined"
                    @click="setOpenMobile(false)"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </nav>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="border-t border-sidebar-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child tooltip="Retour à l’application">
            <NuxtLink to="/parametres" @click="setOpenMobile(false)">
              <ArrowLeft />
              <span>Retour à l’application</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail
      aria-label="Afficher ou réduire la navigation admin"
      title="Afficher ou réduire la navigation admin"
    />
  </Sidebar>
</template>
