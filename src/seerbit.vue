
<script lang="ts">
import { PropType } from 'vue';
import { DynamicSplitRule } from './types';
import SeerBitButton from './seerbitButton.vue';

declare global {
  interface Window {
    SeerbitPay: (options: any, callback: Function, closeCallback: Function) => void;
  }
}

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
    //new props for dynamic split 
    split: {
      type: Object as PropType<DynamicSplitRule>,
      required: false,
      default: () => ({})
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
    this.scriptLoaded = new Promise<void>(resolve => {
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
      if ((script as any).readyState) {
        // IE
        (script as any).onreadystatechange = () => {
          if (
            (script as any).readyState === "loaded" ||
            (script as any).readyState === "complete"
          ) {
            (script as any).onreadystatechange = null;
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

    // New method to validate dynamic split
    validateDynamicSplit() {
    if (this.split) {
      if (!this.split.type) {
        console.error('SeerBit Error: split.type is required');
        return false;
      }

      if (this.split.type !== 'FLAT' && this.split.type !== 'PERCENTAGE') {
        console.error('SeerBit Error: split.type must be either "FLAT" or "PERCENTAGE"');
        return false;
      }

      if (!this.split.transactionFee) {
        console.error('SeerBit Error: split.transactionFee is required');
        return false;
      }

      const validTransactionFees = ['SUB_ACCOUNT', 'ALL_ACCOUNTS', 'PROPORTIONATE', 'PARENT_ACCOUNT'];
      if (!validTransactionFees.includes(this.split.transactionFee)) {
        console.error('SeerBit Error: split.transactionFee must be one of: SUB_ACCOUNT, ALL_ACCOUNTS, PROPORTIONATE, PARENT_ACCOUNT');
        return false;
      }

      if (!this.split.items || !Array.isArray(this.split.items) || this.split.items.length === 0) {
        console.error('SeerBit Error: split.items is required and must be a non-empty array');
        return false;
      }

      for (let i = 0; i < this.split.items.length; i++) {
        const item = this.split.items[i];

        if (!item.subAccountCode) {
          console.error(`SeerBit Error: split.items[${i}].subAccountCode is required`);
          return false;
        }

        if (!item.value) {
          console.error(`SeerBit Error: split.items[${i}].value is required`);
          return false;
        }

        if (isNaN(parseFloat(item.value))) {
          console.error(`SeerBit Error: split.items[${i}].value must be a valid number`);
          return false;
        }
      }
    }
  
  return true;
},

    SeerBitCheckout() {
      if (this.split) {
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
          split: this.split,
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