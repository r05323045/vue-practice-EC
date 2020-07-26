
import zh from './zh_TW.js';
import pagination from './module/pagination.js'
import shopCart from './module/cart.js'
import checkout from './module/checkout.js'
VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});
VeeValidate.localize('tw', zh);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
Vue.component('loading', VueLoading);
Vue.component('popoverloading', VueLoading);
Vue.component('cartloading', VueLoading);
Vue.component('checkoutloading', VueLoading);
Vue.component('b-popover', BootstrapVue.BPopover);
Vue.component('b-dropdown', BootstrapVue.BDropdown);
Vue.component('shopcart', shopCart);
Vue.component('checkout', checkout)
Vue.component('pagination', pagination)
Vue.filter('priceFormat', function (value) {
    return 'NT$ ' + value
           .toString()
           .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function(all, pre, groupOf3Digital) {
            return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
           });
  })
new Vue({
    el: '#app',
    data() {
        return {
            products: [],
            pagination: {},
            tempProduct: {
                imageUrl: [],
                enabled: false
            },
            user: {
                token: '',
                uuid: '765c633d-f16f-4821-90b7-1588004cb252',
            },
            isLoading: false,
            popoverLoading: false,
            cartLoading: false,
            checkoutLoading: false,
            cart: {},
            cartTotal: 0,
            cartId: [],
            cartOpen: false,
            checkoutOpen: false
        };
    },
    created() {
        this.getProducts();
    },
    methods: {
        // 取得產品資料
        getProducts(page = 1) {
            this.isLoading = true
            const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/products?page=${page}`;
            axios.get(api).then((response) => {
                this.products = response.data.data;
                this.pagination = response.data.meta.pagination;
                this.isLoading = false
            }).catch((error) => {
                console.log(error)
                this.isLoading = false
            })
        },
        getProduct(item) {
            if (!item.description) {
                this.popoverLoading = true
                const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/product/${item.id}`;
                axios.get(api).then((response) => {
                    this.tempProduct  = response.data.data;
                    this.products.forEach((product, index) => {
                        if (product.id === this.tempProduct.id) {
                            this.products[index] = this.tempProduct
                        }
                    })
                    this.popoverLoading = false
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        toolTip() {
            $('[data-toggle="tooltip"]').tooltip();
        },
        loadingEvent(event) {
            this.isLoading = event
        },
        cartloadingEvent(event) {
            this.cartLoading = event
        },
        rating() {
            let result = []
            let score = Math.floor((2.5 + Math.random() * 2) * 2.5) / 2
            for (let i = 0; i < Math.floor(score); i++){
                result.push('on')
            }
            if (score % 1 !== 0) {
                result.push('half')
            }
            while(result.length < 5){
                result.push('off')
            }
            return result
        },
        clickAddButton(item) {
            this.$refs.shopcart.addToCart(item)
            this.$refs[`popover-${item.id}`][0].$emit('close')
        },
        cartData(event) {
            this.cart = event.cart
            this.cartId = this.cart.map(item => item.product.id)
            this.cartTotal = event.cartTotal
            this.isLoading = event.loading
            this.checkoutLoading = event.cartloading
            this.cartLoading = event.cartloading
        },
        cartSwitch() {
            this.checkoutOpen = false
            this.cartOpen = true
        },
        checkoutSwitch() {
            this.$refs.checkout.$refs.formvalidation.reset()
            this.$refs.checkout.$refs.checkoutform.reset()
            this.cartOpen = false
            this.checkoutOpen = true
        },
        forceToHome() {
            this.cartOpen = false
            this.checkoutOpen = false
        },
        goGetCart() {
            this.$refs.shopcart.getCart()
            this.cartOpen = false
            this.checkoutOpen = false
        }
    },
})