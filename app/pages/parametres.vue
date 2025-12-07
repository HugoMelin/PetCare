<script setup>
import Button from '~/components/ui/Button.vue';
import LogOutIcon from '~/components/icons/LogOutIcon.vue';

import { signOut } from '~/lib/auth-client';
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Paramètres</h2>

    <Button variant="destructive" size="lg" @click="signOut">
      <LogOutIcon class="w-5 h-5 mr-2" />
      Déconnexion
    </Button>
  </div>
</template>