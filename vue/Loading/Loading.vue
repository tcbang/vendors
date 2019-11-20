<template>
    <transition :name="transition">
        <div tabindex="0"
             class="x-loading is-active"
             :class="{ 'is-full-page': isFullPage }"
             v-show="isActive"
             :aria-busy="isActive"
             aria-label="Loading"
             :style="{ zIndex: zIndex }">
            <div class="x-loading-background"
                 @click.prevent="cancel"
                 :style="{ background: backgroundColor, opacity: opacity }">
            </div>
            <div class="x-loading-content">
                <slot name="before"></slot>
                <slot name="default">
                    <svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :stroke="color">
                        <g fill="none" fill-rule="evenodd">
                            <g transform="translate(1 1)" stroke-width="2">
                                <circle stroke-opacity=".25" cx="18" cy="18" r="18"/>
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.8s" repeatCount="indefinite"/>
                                </path>
                            </g>
                        </g>
                    </svg>
                </slot>
                <slot name="after"></slot>
            </div>
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
        name: 'Loading',
        props: {
            active: Boolean,
            programmatic: Boolean,
            container: [Object, Function, HTMLElement],
            isFullPage: {
                type: Boolean,
                default: true
            },
            transition: {
                type: String,
                default: 'fade'
            },
            canCancel: Boolean,
            onCancel: {
                type: Function,
                default: () => {}
            },
            backgroundColor: String,
            opacity: Number,
            color: {
                type: String,
                default: '#000'
            },
            width: {
                type: Number,
                default: 64
            },
            height: {
                type: Number,
                default: 64
            },
            zIndex: Number
        },
        data() {
            return {
                isActive: this.active
            }
        },
        watch: {
            active(value) {
                this.isActive = value
            }
        },
        beforeMount() {
            // Insert the component in DOM when called programmatically
            if (this.programmatic) {
                if (this.container) {
                    this.isFullPage = false
                    this.container.appendChild(this.$el)
                } else {
                    document.body.appendChild(this.$el)
                }
            }
        },
        mounted() {
            // Activate immediately when called programmatically
            if (this.programmatic) {
                this.isActive = true
            }
            document.addEventListener('keyup', this.keyPress)
            document.addEventListener('focusin', this.focusIn)
        },
        beforeDestroy() {
            document.removeEventListener('keyup', this.keyPress)
            document.removeEventListener('focusin', this.focusIn)
        },
        methods: {
            cancel() {
                if (!this.canCancel || !this.isActive) return
                this.hide()
                this.onCancel.apply(null, arguments)
            },
            hide() {
                this.$emit('hide')
                this.$emit('update:active', false)
                // Timeout for the animation complete before destroying
                if (this.programmatic) {
                    this.isActive = false
                    setTimeout(() => {
                        this.$destroy()
                        removeElement(this.$el)
                    }, 150)
                }
            },
            keyPress(event) {
                // @TODO keyCode is deprecated
                if (event.keyCode === 27) this.cancel()
            },
            focusIn(event) {
                if (!this.isActive) return

                if (event.target === this.$el || this.$el.contains(event.target)) return

                let parent = this.container
                    ? this.container
                    : (this.isFullPage ? null : this.$el.parentElement)

                if (this.isFullPage || (parent && parent.contains(event.target))) {
                    event.preventDefault()
                    this.$el.focus()
                }
            }
        }
    }
</script>

<style lang="scss">
    .x-loading {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        display: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        z-index: 1;

        &.is-active {
            display: flex;
        }

        &.is-full-page {
            z-index: 999;
            position: fixed;
        }

        > .x-loading-background {
            bottom: 0;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            background: #fff;
            opacity: 0.5;
        }

        > .x-loading-content {
            position: relative;
        }
    }
</style>
