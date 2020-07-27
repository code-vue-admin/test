<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
    import { reactive,ref,onMounted,computed } from '@vue/composition-api';
    export default {
        name: "svgIcon",
        props:{
            iconClass:{
                type:String,
                default:''
            },
            className:{
                type: String,
                default: ''
            }
        },
        setup(props){
            const msg = ref("你好呀大家");
            const  number = ref(1);
            //计算属性，得出最终结果，并返回
            const iconName = computed(() =>`#icon-${props.iconClass}`)
            const svgClass = computed(() =>{
                if (props.className) {
                    return`svg-icon ${props.className}`
                }else {
                    return`svg-icon`
                }
            })
            return{
                msg,
                iconName,
                svgClass
            }
        },

    }
</script>

<style lang="scss" scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        fill: currentColor;
    }
</style>