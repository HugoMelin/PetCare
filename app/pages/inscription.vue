<script setup>
import Card from '~/components/ui/Card.vue';
import GoogleIcon from '~/components/icons/GoogleIcon.vue';
import FacebookIcon from '~/components/icons/FacebookIcon.vue';
import AppleIcon from '~/components/icons/AppleIcon.vue';
import MailIcon from '~/components/icons/MailIcon.vue';
import LockIcon from '~/components/icons/LockIcon.vue';
import EyeIcon from '~/components/icons/EyeIcon.vue';
import EyeOffIcon from '~/components/icons/EyeOffIcon.vue';
import UserIcon from '~/components/icons/UserIcon.vue';
import Button from '~/components/ui/Button.vue';

import { signUp } from '~/lib/auth-client';

definePageMeta({
  layout: 'auth',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const error = ref(null);

const formSignUp = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleSignUp = async () => {
  error.value = null;

  const email = formSignUp.email.trim();
  const password = formSignUp.password;
  const confirmPassword = formSignUp.confirmPassword;
  const name = formSignUp.name.trim();

  if (!email || !password || !confirmPassword || !name) {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }

  if (password !== confirmPassword) {
    error.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  const { error: signUpError } = await signUp(email, password, name);
  if (signUpError) {
    error.value = signUpError.message || "Une erreur est survenue lors de l'inscription.";
  } else {
    error.value = null;
  }
};
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-primary mb-2">PetCare</h1>
      <p class="text-gray-600">Créer votre compte</p>
    </div>

    <Card>
      <template #title>
        Créer un compte
      </template>
      <template #content>
        <!-- Social Buttons -->
        <div class="space-y-3 mb-6">
          <Button 
            variant="socialAuth" 
            size="lg" 
            class="w-full"
            disabled
            @click="signUp('google')"
          >
            <GoogleIcon class="w-5 h-5 mr-2" />
            <span>S'inscrire avec Google</span>
          </Button>

          <Button 
            variant="socialAuth" 
            size="lg" 
            class="w-full"
            disabled
            @click="signUp('facebook')"
          >
            <FacebookIcon class="w-5 h-5 mr-2 rounded-full" />
            <span>S'inscrire avec Facebook</span>
          </Button>

          <Button 
            variant="socialAuth" 
            size="lg" 
            class="w-full"
            disabled
            @click="signUp('apple')"
          >
            <AppleIcon class="w-5 h-5 mr-2" />
            <span>S'inscrire avec Apple</span>
          </Button>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <!-- Sign Up Form -->
        <form
          @submit.prevent="handleSignUp"
          class="space-y-4"
        >
          <div>
            <label for="name" class="block text-gray-700 mb-2">Nom</label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                v-model="formSignUp.name"
                type="text"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="Marie Dupont"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <div class="relative">
              <MailIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                v-model="formSignUp.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="votre@email.com"
              />
            </div>
            <p v-if="error && error === 'Invalid email'" class="mt-1 text-red-600 text-sm">
              Adresse email invalide.
            </p>
          </div>

          <div>
            <label for="password" class="block text-gray-700 mb-2">Mot de passe</label>
            <div class="relative">
              <LockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                v-model="formSignUp.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="••••••••"
                minlength="8"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-red-600 mt-1" v-if="formSignUp.password && formSignUp.password.length < 8">Le mot de passe doit contenir au moins 8 caractères.</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-gray-700 mb-2">Confirmer le mot de passe</label>
            <div class="relative">
              <LockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                v-model="formSignUp.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="••••••••"
                minlength="8"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-red-600 mt-1" v-if="formSignUp.password && formSignUp.confirmPassword && formSignUp.password !== formSignUp.confirmPassword">Les mots de passe ne correspondent pas.</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                required
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <p class="text-sm text-gray-600">
                J'accepte les 
                <RouterLink to="/conditions-utilisation" class="text-primary">conditions d'utilisation</RouterLink> 
                et la 
                <RouterLink to="/politique-confidentialite" class="text-primary">politique de confidentialité</RouterLink>
              </p>
            </label>
          </div>

          <Button 
            type="submit" 
            variant="default" 
            size="lg" 
            class="w-full"
          >
            Créer un compte
          </Button>
          
          <p v-if="error && error === 'User already exists. Use another email.'" class="mt-4 text-red-600 text-sm">
            L'utilisateur existe déjà. Veuillez utiliser un autre email.
          </p>
          <p 
            v-if="error 
              && error !== 'Invalid email' 
              && error !== 'Les mots de passe ne correspondent pas.'
              && error !== 'User already exists. Use another email.'" 
            class="mt-4 text-red-600 text-sm"
          >
            {{ error }}
          </p>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Déjà un compte ?
            <RouterLink to="/connexion">
              <span class="text-primary hover:text-primary/90">Se connecter</span>
            </RouterLink>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>
