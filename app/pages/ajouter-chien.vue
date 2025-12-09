<script setup>
import Button from '~/components/ui/Button.vue';
import Card from '~/components/ui/Card.vue';
const { dogs, selectedDog } = storeToRefs(useDogStore());

const form = ref({
  name: '',
  breed: '',
  birthdate: new Date().toISOString().substr(0, 10),
});

const handleSubmit = async () => {
  // Logique pour ajouter le chien
  console.log('Chien ajouté:', form.value);
  const res = await addDog(form.value);
  form.value = {
    name: '',
    breed: '',
    birthdate: new Date().toISOString().substr(0, 10),
  };

  if (res && res.code === 201) {
    selectedDog.value = res.data;
    dogs.value.push(res.data);
    navigateTo('/');
  }

  console.log('Chien ajouté avec succès:', res);
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Ajouter un chien</h2>

    <Card>
      <template #title>
        Formulaire d'ajout de chien
      </template>
      <template #content>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="name"   
              v-model="form.name"
              type="text"
              required
              class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div>
            <label for="breed" class="block text-sm font-medium text-gray-700">Race</label>
            <input
              id="breed"
              v-model="form.breed"
              type="text"
              class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              id="birthdate"
              v-model="form.birthdate"
              type="date"
              class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <Button class="w-full sm:w-auto" variant="default" size="lg" type="submit">
            Ajouter le chien
          </Button>
        </form>
      </template>
    </Card>
  </div>
</template>