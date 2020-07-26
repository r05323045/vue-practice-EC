export default {
    template: '#checkout',
    data() {
        return {
            form: {
                name: '',
                email: '',
                tel: '',
                address: '',
                payment: '',
                message: '',
            },
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
    methods: {
        backToHomepage() {
            this.$emit('backtohomepage')
        },
        goToCart() {
            this.$emit('gotocart')
        },
        createOrder() {
            const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/ec/orders`;
      
            axios.post(url, this.form).then((response) => {
                if (response.data.data.id) {
                    Object.keys(this.form).forEach(item => {item = ''})
                    this.$emit('gogetcart')
                    this.$refs.formvalidation.reset()
                    this.$refs.checkoutform.reset()
                    $('#orderModal').modal('show');
                }
            }).catch((error) => {
                this.$emit('checkoutloading', false)
                console.log(error);
            });
            
        },
    },
}