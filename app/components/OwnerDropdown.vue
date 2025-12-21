<script setup>
import { ChevronDown, UserMinus, UserPlus, X } from 'lucide-vue-next';
import { removeDogOwner, addDogOwner } from '~/composables/useDog';
import Button from './ui/Button.vue';

const props = defineProps({
  dogId: {
    type: Number,
    required: true
  },
  dogCreator: {
    type: String,
    required: false,
    default: null
  },
  user: {
    type: Object,
    required: false,
    default: null
  },
});
const { dogId, user, dogCreator } = toRefs(props);
const dogStore = useDogStore();

console.log("OwnerDropdown user:", user.value);
console.log("OwnerDropdown dogId:", dogId.value);
console.log("OwnerDropdown dogCreator:", dogCreator.value);

const { fetchOwners } = dogStore;

const owners = ref([]);
const isExpanded = ref(false);
const newOwnerEmail = ref('');
const isAddingOwner = ref(false);

const isYourDog = (ownerEmail) => {
  return ownerEmail === user.value.email;
};

const handleRemoveOwner = async (owner) => {
  if(confirm(`Êtes-vous sûr de vouloir retirer ${owner.name || owner.email} des propriétaires de ce chien ?`)) {
    try {
      await removeDogOwner(dogId.value, owner.id);
      owners.value = owners.value.filter(o => o.id !== owner.id);
    } catch (error) {
      console.error("Error removing owner:", error);
    }
  }
};

const handleAddOwner = async () => {
  if (!newOwnerEmail.value) {
    alert("Veuillez entrer un email valide.");
    return;
  }; 

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newOwnerEmail.value)) {
    alert("Veuillez entrer un email valide.");
    return;
  }

  if(owners.value.some(owner => owner.email === newOwnerEmail.value)) {
    alert("Cet utilisateur est déjà propriétaire de ce chien.");
    return;
  }

  try {
    const newOwner = await addDogOwner(dogId.value, newOwnerEmail.value);
    if (!newOwner || !newOwner.data) {
      throw new Error("Utilisateur non trouvé.");
    }
    owners.value.push(newOwner.data);
    newOwnerEmail.value = '';
    isAddingOwner.value = false;
  } catch (error) {
    console.error("Error adding owner:", error);
    if (error.message) {
      alert(error.message);
      return;
    }
    alert("Erreur lors de l'ajout du propriétaire. Veuillez vérifier l'email et réessayer.");
  }
};

onMounted(async () => {
  try {
    const response = await fetchOwners(dogId.value);
    owners.value = response;
  } catch (error) {
    console.error("Error fetching owners:", error);
  }
});
</script>

<template>
  <div class="border border-gray-300 rounded-lg overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <span class="text-gray-700">
        Propriétaire{{ owners.length > 1 ? 's' : '' }} ({{ owners.length }})
      </span>
      <ChevronDown 
        :class="`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`" 
      />
    </button>

    <div
      v-if="isExpanded" 
      class="p-4 space-y-3 bg-white"
    >
      <div
        v-for="owner in owners" 
        :key="owner.id"
        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex-1">
          <p class="text-gray-900 text-sm">{{ isYourDog(owner.email) ? 'Vous' : owner.name || owner.email }}</p>
          <p v-if="owner.name" class="text-xs text-gray-500">{{ owner.email }}</p>
        </div>

        <button
          v-if="owner.id !== dogCreator"
          class="p-2 hover:bg-red-100 rounded-lg transition-colors"
          @click="handleRemoveOwner(owner)" 
        >
          <UserMinus 
            class="w-4 h-4 text-red-600 hover:text-red-800" 
            title="Retirer ce propriétaire" 
          />
        </button>
      </div>

      <form v-if="isAddingOwner" @submit.prevent="handleAddOwner" class="border border-primary rounded-lg p-3 space-y-2 bg-[#269394]/5">
        <input 
          v-model="newOwnerEmail"
          type="email" 
          placeholder="email@example.com" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-sm"
        />
        <div class="flex gap-2">
          <Button 
            type="submit"
            class="flex gap-1"
          >
            <UserPlus class="w-3 h-3" />
            Ajouter
          </Button>
          <Button variant="secondary" class="flex gap-1"
            type="button"
            @click="isAddingOwner = false; newOwnerEmail = ''"
          >
            <X class="w-3 h-3" />
            Annuler
          </Button>
        </div>
      </form>
      <button
        v-else
        type="button"
        @click="isAddingOwner = true"
        class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-primary text-primary rounded-lg hover:bg-[#269394]/5 transition-colors text-sm"
      >
        <UserPlus class="w-4 h-4" />
        Ajouter un propriétaire
      </button>
    </div>
  </div>
</template>