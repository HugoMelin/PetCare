<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import LogOutIcon from "~/components/icons/LogOutIcon.vue";
import { signOut } from "~/lib/auth-client";
import AccountDeleteButton from "./AccountDeleteButton.vue";
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <Button
      type="button"
      size="lg"
      class="flex items-center justify-center gap-2"
      @click="navigateTo('/feedback')"
    >
      <IconMessageSquare class="w-5 h-5" />
      Feedback
    </Button>

    <Button variant="destructive" size="lg" @click="signOut">
      <LogOutIcon class="w-5 h-5 mr-2" />
      Déconnexion
    </Button>

    <AccountDeleteButton />
  </div>
</template>
