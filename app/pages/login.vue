<script setup>
import Card from '~/components/ui/Card.vue';

import { signUp, signIn, authClient, signOut } from '~/lib/auth-client';

const session = authClient.useSession();

const formSignUp = reactive({
  name: '',
  email: '',
  password: '',
  rememberMe: false,
});

const formSignIn = reactive({
  email: '',
  password: '',
  rememberMe: false,
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 col-span-12">Login</h2>

    <pre>{{ session.data }}</pre>

    <div v-if="!session.data">
      <Card>
        <template #title>
          S'inscrire
        </template>
        <template #content>
          <form class="grid grid-cols-1 gap-4" @submit.prevent="signUp(formSignUp.email, formSignUp.password, formSignUp.name)" >
            <div class="mb-4">
              <label for="name_signUp" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                id="name_signUp"
                v-model="formSignUp.name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div class="mb-4">
              <label for="email_signUp" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email_signUp"
                v-model="formSignUp.email"
                type="email"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div class="mb-4">
              <label for="password_signUp" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                id="password_signUp"
                v-model="formSignUp.password"
                type="password"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              S'inscrire
            </button>
          </form>
        </template>
      </Card>
      <Card>
        <template #title>
          Se connecter
        </template>
        <template #content>
          <form class="grid grid-cols-1 gap-4" @submit.prevent="signIn(formSignIn.email, formSignIn.password, formSignIn.rememberMe)" >
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                v-model="formSignIn.email"
                type="email"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                id="password"
                v-model="formSignIn.password"
                type="password"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div class="mb-4">
              <label for="rememberMe" class="inline-flex items-center">
                <input
                  id="rememberMe"
                  v-model="formSignIn.rememberMe"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
            </div>
            <button
              type="submit"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Se connecter
            </button>
          </form>
        </template>
      </Card>
    </div>
    
    <Card v-else>
      <template #content>
        <button
          @click="signOut()"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </template>
    </Card>
  </div>
</template>
