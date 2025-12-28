<script setup>
import { ArrowLeft, CheckCircle, Send } from 'lucide-vue-next';
import Button from '~/components/ui/Button.vue';
import Card from '~/components/ui/Card.vue';
import { fetchUserSession } from '~/lib/auth-client';
import useFeedback from '~/composables/useFeedback';

const { sendFeedback } = useFeedback();

const feedbackTypes = [
  { value: 'suggestion', label: 'Suggestion', icon: '💡' },
  { value: 'bug', label: 'Signaler un bug', icon: '🐛' },
  { value: 'support', label: 'Support', icon: '🆘' },
  { value: 'other', label: 'Autre', icon: '💬' },
];

const isSubmitted = ref(false);
const isSubmitting = ref(false);
const user = ref(null);

const form = ref({
  type: 'suggestion',
  email: user.value?.email || '',
  subject: '',
  message: '',
  honeypot: '',
});

const handleSubmit = async () => {
  if (form.value.honeypot) {
    return;
  }

  isSubmitting.value = true;
  try {
    await sendFeedback(form.value);
    isSubmitted.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  const session = await fetchUserSession();
  user.value = session.data?.user || null;
  form.value.email = user.value?.email || '';
});

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="link" size="lg">
        <NuxtLink to="/parametres" class="flex items-center justify-center gap-2 p-2">
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </NuxtLink>
      </Button>
      <h2 class="text-2xl font-bold">Feedback</h2>
    </div>

    <Card v-if="isSubmitted">
      <template #title-section>
        <div class="flex flex-col items-center text-center py-6">
          <div class="w-16 h-16 rounded-full bg-[#44C4A1]/10 flex items-center justify-center mb-4">
            <CheckCircle class="w-8 h-8 text-[#44C4A1]" />
          </div>
          <h2 class="text-[#44C4A1] mb-2 text-2xl font-bol">Merci pour votre retour !</h2>
        </div>
      </template>
      <template #content>
        <p class="text-gray-700 mb-4">Votre message a été envoyé avec succès. Nous reviendrons vers vous si nécessaire.
        </p>
        <p class="text-gray-700">Nous apprécions votre contribution pour améliorer notre application.</p>
      </template>
    </Card>

    <Card v-else>
      <template #title>
        Envoyez-nous votre retour
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-700 mb-3" for="feedback-type">
              Type de feedback
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button v-for="type in feedbackTypes" :key="type.value" type="button" :class="`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${form.type === type.value
                  ? 'border-primary bg-[#269394]/5'
                  : 'border-gray-200 hover:border-gray-300'
                }`" @click="form.type = type.value">
                <span class="text-2xl">{{ type.icon }}</span>
                <span class="text-sm text-center">{{ type.label }}</span>
              </button>
            </div>
          </div>

          <div>
            <label for="email" class="block text-gray-700 mb-2">
              Email de contact <span class="text-red-500">*</span>
            </label>
            <input id="email" v-model="form.email" type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              placeholder="votre@email.com" required />
            <p class="text-sm text-gray-500 mt-1">
              Pour que nous puissions vous répondre
            </p>
          </div>

          <div>
            <label for="subject" class="block text-gray-700 mb-2">
              Sujet (optionnel)
            </label>
            <input id="subject" v-model="form.subject" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              placeholder="Ex: Problème avec l'ajout de poids" />
          </div>

          <div>
            <label for="message" class="block text-gray-700 mb-2">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea id="message" v-model="form.message" rows="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow resize-none"
              placeholder="Décrivez votre retour, suggestion ou problème en détail..." required />
            <p class="text-sm text-gray-500 mt-1">
              {{ form.message.length }} caractères
            </p>
          </div>

          <label style="display:none">
            Si vous êtes un humain, ne remplissez pas ce champ :
          </label>
          <input type="checkbox" v-model="form.honeypot" style="display:none" />

          <Button type="submit" size="lg" class="self-end" :disabled="isSubmitting">
            <template v-if="isSubmitting">Envoi...</template>
            <template v-else>
              <Send class="w-5 h-5 pr-2" />
              Envoyer le feedback
            </template>
          </Button>
        </form>
      </template>
    </Card>

    <Card v-if="!isSubmitted">
      <template #title>
        💬 Votre avis compte
      </template>
      <template #content>
        <div class="space-y-2 text-sm text-gray-600">
          <p>
            Nous lisons chaque feedback et l'utilisons pour améliorer PetCare.
          </p>
          <p>
            • Pour les bugs, décrivez les étapes pour reproduire le problème
          </p>
          <p>
            • Pour les suggestions, expliquez comment cela vous aiderait
          </p>
          <p>
            • Pour le support, soyez le plus précis possible
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>