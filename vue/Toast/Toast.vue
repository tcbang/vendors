<template>
    <transition
            :enter-active-class="transition.enter"
            :leave-active-class="transition.leave">
        <div
                role="alert"
                v-show="isActive"
                class="x-toast"
                :class="[`x-toast-${type}`, `is-${position}`]"
                @click="onClick">
            <p class="x-toast-text">{{message}}</p>
        </div>
    </transition>
</template>

<script>
    const removeElement = (el) => {
        if (typeof el.remove !== 'undefined') {
            el.remove()
        } else {
            el.parentNode.removeChild(el)
        }
    }

    const hasWindow = () => {
        return typeof window !== 'undefined'
    }

    const HTMLElement = hasWindow() ? window.HTMLElement : Object

    export default {
        name: 'Toast',
        props: {
            message: {
                type: String,
                required: true
            },
            type: {
                type: String,
                default: 'success'
            },
            position: {
                type: String,
                default: 'bottom'
            },
            duration: {
                type: Number,
                default: 3000
            },
            dismissible: {
                type: Boolean,
                default: true
            },
            onHide: {
                type: Function,
                default: () => {}
            },
            queue: Boolean,
            container: {
                type: [Object, Function, HTMLElement],
                default: null
            }
        },
        data() {
            return {
                isActive: false,
                parentTop: null,
                parentBottom: null
            }
        },
        computed: {
            correctParent() {
                switch (this.position) {
                    case 'top-right':
                    case 'top':
                    case 'top-left':
                        return this.parentTop
                    case 'bottom-right':
                    case 'bottom':
                    case 'bottom-left':
                        return this.parentBottom
                }
            },
            transition() {
                switch (this.position) {
                    case 'top-right':
                    case 'top':
                    case 'top-left':
                        return {
                            enter: 'x-toast-fade-in-down',
                            leave: 'x-toast-fade-out'
                        }
                    case 'bottom-right':
                    case 'bottom':
                    case 'bottom-left':
                        return {
                            enter: 'x-toast-fade-in-up',
                            leave: 'x-toast-fade-out'
                        }
                }
            }
        },
        beforeMount() {
            this.setupContainer()
        },
        mounted() {
            this.showNotice()
        },
        methods: {
            setupContainer() {
                this.parentTop = document.querySelector('.x-toast-container.is-top')
                this.parentBottom = document.querySelector('.x-toast-container.is-bottom')
                // No need to create them, they already exists
                if (this.parentTop && this.parentBottom) return
                if (!this.parentTop) {
                    this.parentTop = document.createElement('div')
                    this.parentTop.className = 'x-toast-container is-top'
                }
                if (!this.parentBottom) {
                    this.parentBottom = document.createElement('div')
                    this.parentBottom.className = 'x-toast-container is-bottom'
                }
                const container = this.container || document.body
                container.appendChild(this.parentTop)
                container.appendChild(this.parentBottom)
                let containerParentClass = 'is-custom-parent'
                if (this.container) {
                    this.parentTop.classList.add(containerParentClass)
                    this.parentBottom.classList.add(containerParentClass)
                }
            },
            shouldQueue() {
                if (!this.queue) return false
                return (
                    this.parentTop.childElementCount > 0 ||
                    this.parentBottom.childElementCount > 0
                )
            },
            hide() {
                clearTimeout(this.timer)
                this.isActive = false
                // Timeout for the animation complete before destroying
                setTimeout(() => {
                    this.$destroy()
                    removeElement(this.$el)
                }, 150)
            },
            showNotice() {
                if (this.shouldQueue()) {
                    // Call recursively if should queue
                    setTimeout(() => this.showNotice(), 250)
                    return
                }
                this.correctParent.insertAdjacentElement('afterbegin', this.$el)
                this.isActive = true
                this.timer = setTimeout(() => this.hide(), this.duration)
            },
            onClick() {
                if (!this.dismissible) return
                this.onHide.apply(null, arguments)
                this.hide()
            }
        }
    }
</script>

<style lang="scss">
    $toast-colors: () !default;
    $toast-colors: map-merge(
                    (
                            "success": #28a745,
                            "info": #17a2b8,
                            "warning": #ffc107,
                            "error": #dc3545,
                            "default": #343a40
                    ),
                    $toast-colors
    );
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    .x-toast-container {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1052;
        padding: 2em;
        display: flex;
        overflow: hidden;
        pointer-events: none;

        /* container positions */
        &.is-top {
            flex-direction: column;
        }

        &.is-bottom {
            flex-direction: column-reverse;
        }

        &.is-custom-parent {
            position: absolute;
        }

        @media screen and (max-width: 768px) {
            padding: 0;
            position: fixed !important;
        }

        .x-toast {
            display: inline-flex;
            align-items: center;
            animation-duration: 150ms;
            margin: 0.5em 0;
            border-radius: 0.25em;
            pointer-events: auto;
            opacity: 0.95;
            color: #fff;
            min-height: 3em;
            cursor: pointer;

            /* toast animation */
            &.x-toast-fade-out {
                animation-name: fadeOut;
            }

            &.x-toast-fade-in-down {
                animation-name: fadeInDown;
            }

            &.x-toast-fade-in-up {
                animation-name: fadeInUp;
            }

            /* toast position */
            &.is-top,
            &.is-bottom {
                align-self: center;
            }

            &.is-top-right,
            &.is-bottom-right {
                align-self: flex-end;
            }

            &.is-top-left,
            &.is-bottom-left {
                align-self: flex-start;
            }

            .x-toast-text {
                margin: 0;
                padding: 0.5em 1em;
            }
        }

        /* toast type bg color */
        @each $toast-colors-key, $toast-colors-value in $toast-colors {
            .x-toast-#{$toast-colors-key} {
                background-color: rgba($toast-colors-value, .65);
                box-shadow: 0 1px 4px rgba($toast-colors-value, 0.12),
                0 0 6px rgba($toast-colors-value, 0.04);
            }
        }
    }
</style>
