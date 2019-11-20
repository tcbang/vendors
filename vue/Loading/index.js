import Loading from './Loading'

Loading.install = function (Vue, props = {}, slots = {}) {
    let api = ((Vue, globalProps = {}, globalSlots = {}) => {
        return {
            show(props = globalProps, slots = globalSlots) {
                const forceProps = {
                    programmatic: true
                }
                const propsData = Object.assign({}, globalProps, props, forceProps)

                const instance = new (Vue.extend(Loading))({
                    el: document.createElement('div'),
                    propsData
                })

                const mergedSlots = Object.assign({}, globalSlots, slots)
                Object.keys(mergedSlots).map((name) => {
                    instance.$slots[name] = mergedSlots[name]
                })

                return instance
            }
        }
    })(Vue, props, slots)

    Vue.$loading = api
    Vue.prototype.$loading = api
    Vue.component(Loading.name, Loading)
}

export {Loading}
export default Loading
