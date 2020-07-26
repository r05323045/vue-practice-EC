export default {
    template: '#shopCart',
    data() {
      return {
          cart: {},
          cartTotal: 0,
      };
    },
    props: {
        user: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    created() {
        this.$emit('loading', true)
        this.getCart();
    },
    
    methods: {
        addToCart(item, quantity = 1) {
            const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/shopping`;
            const cart = {
                product: item.id,
                quantity,
            };
            this.$emit('loading', true)
      
            axios.post(url, cart).then(() => {
                this.getCart();
            }).catch((error) => {
                console.log(error.response.data.errors);
                this.$emit('cart', {cart: this.cart, cartTotal: this.cartTotal, loading: false, cartloding: false})
            });
          },
        getCart() {
          const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/shopping`;
          axios.get(url).then((response) => {
              this.cart = response.data.data;
              this.cartTotal = 0
              this.cart.forEach((item) => {
                  this.cartTotal += item.product.price * item.quantity;
              });
              this.$emit('cart', {cart: this.cart, cartTotal: this.cartTotal, loading: false, cartloding: false, checkoutloading: false})
          });
        },
        quantityUpdata(id, num) {
          
          if (!/^[0-9]+$/.test(num)||num < 1) {
            num = 1
          }
          const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/shopping`;
          const data = {
            product: id,
            quantity: num,
          };
          this.$emit('cartloading', true)
          axios.patch(url, data).then(() => {
              this.getCart();
          })
        },
        removeAllCartItem() {
          this.$emit('cartloading', true)
          const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/shopping/all/product`;
    
          axios.delete(url)
            .then(() => {
              this.getCart();
            });
        },
        removeCartItem(id) {
          this.$emit('cartloading', true)
          const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/shopping/${id}`;
    
          axios.delete(url).then(() => {
            this.getCart();
          });
        },
        backToHomepage() {
          this.$emit('backtohomepage')
        },
        goToCheckout() {
          this.$emit('gotocheckout')
        }
    },
}