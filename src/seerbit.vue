<script type="text/javascript">
import SeerBitButton from './seerbitButton.vue';
export default {
  name:"SeerBitCheckout",
  components: {
    SeerBitButton
  },
  props: {
    version: {
      type: Number,
      default: 2
    },
    buttonText: {
      type: String,
    },
    publicKey: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false,
    },
    vendorId: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    mobileNo: {
      type: String,
      required: false
    },
    fullName: {
      type: String,
      required: false
    },
    amount: {
      type: String,
      required: true
    },
    tranref: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: "NG"
    },
    currency: {
      type: String,
      default: "NGN"
    },
    planId: {
      type: String,
      required: false,
    },
    pocketRef: {
      type: String,
      required: false,
    },
    setAmountByCustomer: {
      type: Boolean,
      required: false,
      default: false,
    },
    tokenize: {
      type: Boolean,
      required: false,
      default: false
    },
    closePrompt: {
      type: Boolean,
      required: false,
      default: false
    },
    customization: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //new props for dynamic split added by yours successfully
    dynamicSplit: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
    callbackurl: {
      type: String,
      default: ""
    },
    onCallback: {
      type: Function,
      required: true,
      default: function() {}
    },
    onCloseCheckout: {
      type: Function,
      required: true,
      default: function() {}
    },
    autoCheckout: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      scriptLoaded: null
    };
  },
  created() {
    this.scriptLoaded = new Promise(resolve => {
      this.loadScript(() => {
        resolve();
      });
    });
  },
  mounted() {
    if (this.autoCheckout) {
      this.SeerBitCheckout();
    }
  },
  methods: {
    loadScript(callback) {
      const script = document.createElement("script");
      script.src = `https://checkout.seerbitapi.com/api/v${this.version}/seerbit.js`;
      document.getElementsByTagName("head")[0].appendChild(script);
      if (script.readyState) {
        // IE
        script.onreadystatechange = () => {
          if (
            script.readyState === "loaded" ||
            script.readyState === "complete"
          ) {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = () => {
          callback();
        };
        script.onerror = function() {
          console.error('Error loading ' + script.src)
        }
      }
    },

    // New method to validate dynamic split percentages added by Muyiwa
    validateDynamicSplit() {
      if (this.dynamicSplit && this.dynamicSplit.length > 0) {
        const totalPercentage = this.dynamicSplit.reduce((sum, split) => {
          return sum + (split.percentage || 0);
        }, 0);

        if (totalPercentage !== 100) {
          console.warn(
            `SeerBit Warning: Dynamic split percentages must add up to 100. Current total: ${totalPercentage}`
          );
          return false;
        }
      }
      return true;
    },

    SeerBitCheckout() {
      // Validate dynamic split before proceeding added by Muyiwa
      if (this.dynamicSplit && this.dynamicSplit.length > 0) {
        if (!this.validateDynamicSplit()) {
          console.error("SeerBit: Invalid dynamic split configuration");
          return;
        }
      }
      this.scriptLoaded &&
      this.scriptLoaded.then(() => {
        const checkoutOptions = {
          public_key: this.publicKey,
          email: this.email,
          mobile_no: this.mobileNo,
          full_name: this.fullName,
          description: this.description,
          amount: this.amount,
          tranref: this.tranref,
          callbackurl: this.callbackurl,
          callback: this.onCallback,
          close: this.onCloseCheckout,
          country: this.country,
          currency: this.currency,
          customization: this.customization,
          setAmountByCustomer: this.setAmountByCustomer,
          vendorId: this.vendorId,
          tokenize: this.tokenize,
          pocketRef: this.pocketRef,
          planId: this.planId,
          closePrompt: this.closePrompt,
          dynamicSplit: this.dynamicSplit,
        };

        window.SeerbitPay(checkoutOptions, this.onCallback, this.onCloseCheckout);
      });
    },
  }
};
</script>

<template>
  <SeerBitButton v-if="!autoCheckout"
    :buttonText="buttonText"
    v-on:click="SeerBitCheckout"/>
</template>