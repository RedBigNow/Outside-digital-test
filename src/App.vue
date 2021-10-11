<template>
    <div class="wrapper">
        <div class="wrapper-content">

            <div class="hero-btn">
                <button class="btn btn-default" @click="modalShow = !modalShow"><span>Налоговый вычет</span></button>
            </div>

            <modalTax 
                v-show="modalShow"
                @close="modalShow = false"/>

            
        </div>
    </div>
</template>

<script>
import modal from '@/components/UI/Modal.vue'
import modalTax from '@/components/ModalTax.vue'

export default {
    components: { 
        modal,
        modalTax 
    },
    data () {
        return {
            modalShow: false
        }
    }
}
</script>

<style lang="scss">
.hero-btn {
    height: 100vh;
    max-width: 200px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
</style>