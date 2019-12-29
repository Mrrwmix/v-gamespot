<template>
  <div>
    <comp-featured />
    <comp-content />
  </div>
</template>

<script>
import compFeatured from './Feature';
import compContent from './Content';

export default {
  components: {
    compFeatured,
    compContent
  }
};
</script>
