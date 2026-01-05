<script setup lang="ts">
import Card from '../ui/Card.vue';

</script>

<template>
  <Card>
    <template #title>À propos</template>

    <template #content>
      <p class="mb-4">
        Version <strong>1.0.0</strong>
      </p>
      <p class="mb-0">
        PetCare est une application dédiée à la gestion et au suivi de la santé de vos animaux de compagnie. 
        <!--Elle vous permet d'enregistrer les informations de vos animaux, de suivre leur poids, leurs échéances de médicaments, 
          et bien plus encore. --> 
      </p>
      <p class="mb-4 text-gray-500 text-sm">(Certaines fonctionnalités sont en cours de développement)</p>
      <p class="mb-4 text-sm">
        Développée avec passion par <a href="https://torefi.fr" class="text-primary hover:underline">torefi.fr</a>, cette application vise à offrir une expérience utilisateur intuitive 
        et complète pour tous les propriétaires d'animaux.
      </p>
      <p class="mb-4 text-sm">
        Pour toute question ou suggestion, n'hésitez pas à me contacter à l'adresse suivante : 
        <a href="mailto:contact@torefi.fr" class="text-primary hover:underline">contact@torefi.fr</a>.
      </p>
      <p class="mb-4">
        Copyright © {{ new Date().getFullYear() }} Toréfi. Tous droits réservés.
      </p>
    </template>
  </Card>
</template>