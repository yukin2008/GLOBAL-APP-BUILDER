<style scoped>
@import "styles/common.css";
</style>
<template>
    <div>
        <transition name="move">

            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
  data() {
    return {map: []};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
