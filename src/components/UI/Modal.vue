<template>
    <transition name="modal">
        <div class="modal__wrapper" @click="$emit('close')">
            <div class="modal-content" @click.stop="">
                <!-- header -->
                <div class="modal-header">
                    <h2 class="modal-title"> {{ title }} </h2>
                    <span class="button-close" @click="$emit('close')"></span>
                </div>
                <!-- body -->
                <div class="modal-body">
                    <slot name="body">Default body</slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    mounted () {
        document.body.addEventListener('keyup', e => {
            if (e.key === 'Escape') this.$emit('close')
        })
    },
    computed: {},
    methods: {}
}
</script>

<style lang="scss">
//animations
.modal-enter, .modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-content,
.modal-leave-active .modal-content {
    transform: scale(1.2);
}

.modal__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(00,00,00,.5);
    transition: opacity .3s ease;
}

.modal-content {
    position: relative;
    z-index: 999;
    max-width: 552px;
    padding: 32px;
    background-color: #fff;
    transition: all .3s ease;
    border-radius: 30px;
    overflow: hidden;
}


.modal-header {
    padding-bottom: 16px;
}

.modal-title {
    font-size: 28px;
    font-weight: 500;
    line-height: 40px;
}

.button-close {
    position: absolute;
    right: 23px;
    top: 27px;
    width: 18px;
    height: 18px;
    background: url('~@/assets/images/close.svg') no-repeat 100%;
    background-size: 100%;
    cursor: pointer;
}

@media screen and (max-width: 768px) {
    .modal-content {
        max-width: 453px;
    }
}

@media screen and (max-width: 576px) {
    .modal-content {
        height: 100%;
        padding: 32px 16px;
        border-radius: 0;
        overflow-y: auto;
    }

    .button-close {
        width: 12px;
        height: 12px;
    }
}
</style>
