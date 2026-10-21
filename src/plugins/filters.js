import Vue from 'vue';

Vue.filter('price-break', (value) => {
    if (value === null || value === 0) {
        return '0';
    }
    return String(value).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
});
