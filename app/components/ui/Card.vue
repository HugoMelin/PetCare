<template>
  <section class="card bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 v-if="$slots.title" class="mb-3 font-bold">
      <slot name="title" />
    </h3>

    <div v-if="$slots['title-section']" class="mb-3">
      <slot name="title-section" />
    </div>

    <slot name="content" />
  </section>
</template>