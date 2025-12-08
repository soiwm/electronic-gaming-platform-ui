<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">{{ title }}</h2>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>