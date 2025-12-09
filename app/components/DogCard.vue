<script setup>
import { computed, toRefs } from 'vue';
import { Pencil, Trash2, Save, X } from 'lucide-vue-next';
import Button from './ui/Button.vue';
import { deleteDog, updateDog } from '~/composables/useDog';

const dogStore = useDogStore();

const props = defineProps({
  dog: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  isCreator: {
    type: Boolean,
    default: false
  }
});

const { dog, isEditing, isCreator } = toRefs(props);

const form = ref({
  name: dog.value.name,
  breed: dog.value.breed,
  birthdate: new Date(dog.value.birthdate).toISOString().substr(0, 10)
});

const emit = defineEmits(['edit-dog']);

const dogAvatars = ['🐕', '🦮', '🐺', '🐶', '🐩', '🦴', '🐕‍🦺'];

const dogAvatar = computed(() => {
  const index = dog.value.id % dogAvatars.length;
  return dogAvatars[index];
});

const handleEditClick = (dog) => {
  emit('edit-dog', dog);
};

const handleDelete = (dog) => {
  deleteDog(dog.id)
    .then(() => {
      dogStore.removeDogById(dog.id);
    })
    .catch((error) => {
      console.error("Error deleting dog:", error);
    });
};

const handleUpdate = async () => {
  try {
    const updatedDog = await updateDog(dog.value.id, {
      name: form.value.name,
      breed: form.value.breed,
      birthdate: form.value.birthdate
    });
    dogStore.updateDogInStore(updatedDog.data);
    emit('edit-dog', null);
  } catch (error) {
    console.error("Error updating dog:", error);
  }
};
</script>

<template>
  <div v-if="!isEditing"
    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div class="flex items-center gap-3">
      <div
        class="w-12 h-12 rounded-full bg-gradient-to-br from-[#4CA8E0] to-[#44C4A1] flex items-center justify-center text-2xl">
        {{ dogAvatar }}
      </div>
      <div>
        <p class="text-gray-900">{{ dog.name }}</p>
        <p class="text-sm text-gray-500">{{ dog.breed }}</p>
        <p class="text-sm text-gray-500">Né le {{ new Date(dog.birthdate).toLocaleDateString() }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button title="Modifier" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        @click="handleEditClick(dog)">
        <Pencil class="w-4 h-4 hover:text-primary" />
      </button>
      <button 
        title="Supprimer"
        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isCreator" @click="handleDelete(dog)">
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
  <form v-else @submit.prevent="handleUpdate" class="border border-primary rounded-lg p-4 space-y-4 bg-[#269394]/5">
    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700 mb-2 text-sm">
          Nom
        </label>
        <input 
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          placeholder="Max" 
        />
      </div>
      <div>
        <label class="block text-gray-700 mb-2 text-sm">
          Race
        </label>
        <input 
          v-model="form.breed"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          placeholder="Golden Retriever" 
        />
      </div>
      <div>
        <label class="block text-gray-700 mb-2 text-sm">
          Date de naissance
        </label>
        <input 
          v-model="form.birthdate"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          placeholder="01/01/2020" 
        />
      </div>
    </div>

    <div class="flex gap-2">
      <Button class="gap-1 flex-1" size="lg" type="submit">
        <Save class="w-4 h-4" />
        Sauvegarder
      </Button>
      <Button variant="secondary" class="flex-1" size="lg" @click="$emit('edit-dog', null)">
        <X class="w-4 h-4" />
        Annuler
      </Button>
    </div>
  </form>
</template>