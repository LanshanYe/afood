<template>
  <div class="numright van-stepper">
    <div class="van-stepper__minus lineblock" @click.stop.prevent="reduce($event)" />
    <div class="van-stepper__input steppertext lineblock">{{ value }}</div>
    <div class="van-stepper__plus lineblock" @click.stop.prevent="add($event)" />
  </div>
</template>

<script>
export default {
  name: 'MyStepper',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 50
    },
    min: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      step: 0
    }
  },
  methods: {
    add(e) {
      if (this.value >= this.max) {
        return false
      }
      this.$emit('input', this.value + 1)
      this.$emit('adding', e)
    },
    reduce(e) {
      if (this.value <= this.min) {
        return false
      }
      this.$emit('input', this.value - 1)
      this.$emit('reducing', e)
    }
  }
}
</script>

<style scoped>
    .steppertext{
        line-height: 22px;
    }
    .lineblock{
        display: inline-block;
    }
</style>
