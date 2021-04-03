<template>
	<div class="input_box">
		<input type="text" class="input_main" :value="modelValue" @input="handleInput">
		<van-icon name="exchange" :color="iconColor" size="24" class="prefix_icon" @click="handleChange"/>
		<van-icon name="search" :color="iconColor" size="24" class="subfix_icon" @click="$emit('search')" v-show="isSearch"/>
		<van-icon name="plus" :color="iconColor" size="24" class="subfix_icon" @click="$emit('add')" v-show="!isSearch"/>
	</div>
</template>

<script>
import { computed } from 'vue'
export default {
	props: {
    modelValue: String,
		isSearch: Boolean
  },
	setup(props, ctx) {
		const iconColor = computed(() => { return `#888` })
		const handleInput = (e) => {
			ctx.emit('update:modelValue', e.target.value)
		}
		const handleChange = () => {
			ctx.emit('update:isSearch', !props.isSearch)
		}
		return {
			iconColor,
			handleInput,
			handleChange
		}
	}
}
</script>

<style lang="scss" scoped>
.input_box {
	position: relative;
}
.input_main {
	height: 80px;
	width: 100%;
	border-radius: 24px;
	border: 2px solid #b2b2b2;
	font-size: 28px;
	line-height: 8px;
	padding: 0 90px;
	box-sizing: border-box;
}
.subfix_icon {
	position: absolute;
	top: 50%;
	right: 24px;
	transform: translateY((-50%));
}
.prefix_icon {
	position: absolute;
	top: 50%;
	left: 24px;
	transform: translateY((-50%));
}
</style>