import Toast from './Toast'

Toast.install = function (Vue, props = {}) {
    let api = ((Vue, globalOptions = {}) => {
        return {
            show(options) {
                let message
                if (typeof options === 'string') message = options

                const defaultOptions = {
                    message
                }

                const propsData = Object.assign({}, defaultOptions, globalOptions, options)

                return new (Vue.extend(Toast))({
                    el: document.createElement('div'),
                    propsData
                })
            },
            success(message, options = {}) {
                return this.show(Object.assign({}, {
                    message,
                    type: 'success'
                }, options))
            },
            error(message, options = {}) {
                return this.show(Object.assign({}, {
                    message,
                    type: 'error'
                }, options))
            },
            info(message, options = {}) {
                return this.show(Object.assign({}, {
                    message,
                    type: 'info'
                }, options))
            },
            warning(message, options = {}) {
                return this.show(Object.assign({}, {
                    message,
                    type: 'warning'
                }, options))
            },
            default(message, options = {}) {
                return this.show(Object.assign({}, {
                    message,
                    type: 'default'
                }, options))
            }
        }
    })(Vue, props)

    Vue.$toast = api
    Vue.prototype.$toast = api
}

export {Toast}
export default Toast
