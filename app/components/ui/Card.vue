<template>
  <section class="card bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 class="mb-3 font-bold"><slot name="title" /></h3>

    <slot name="content" />
  </section>
</template>