<script type="text/javascript">
import seerbit from '../../src/seerbit.vue';
export default {
  components: {
	  seerbit
  },
  data() {
    return {
      publicKey: "SBTESTPUBK_t4G16GCA1O51AV0Va3PPretaisXubSw1",
      fullName: "John Doe",
      email: "johndoe@mail.com",
      mobileNo: "",
      amount: "10.00",
      planId: "",
      description: "",
      productId: "",
      pocketRef: "",
      tokenize: "",
      currency: "NGN",
      customization: {
        theme: {
          border_color: "#000000",
          background_color: "#004C64",
          button_color: "#0084A0",
        },
        
        payment_method: ["card", "account", "transfer", "wallet", "ussd"],
        display_fee: true, 
        logo: "logo_url | base64",
      },
      dynamicSplit: [
        { accountId: "acct_12345", percentage: 40 },
        { accountId: "acct_67890", percentage: 30 },
        { accountId: "acct_67899", percentage: 30 },
      ],
      callbackurl: "",
      buttonText: "Pay With SeerBit",
      autoCheckout: false,
    };
  },
  computed: {
    tranref() {
      return Date.now().toString();
    }
  },
  methods: {
    onCallback: function(response) {
      console.log(response)
    },
    onCloseCheckout: function() {
      console.log("checkout closed")
    }
  }
}
</script>

<template>
  <div class="container">
    <seerbit
      :amount="amount"
      :email="email"
      :publicKey="publicKey"
      :tranref="tranref"
      :onCallback="onCallback"
      :onCloseCheckout="onCloseCheckout"
      :planId="planId"
      :customization="customization"
      :pocketRef="pocketRef"
      :callbackurl="callbackurl"
      :tokenize="tokenize"
      :description="description"
      :productId="productId"
      :currency="currency"
      :mobileNo="mobileNo"
      :buttonText="buttonText"
      :autoCheckout="false"
      :dynamicSplit="dynamicSplit"
    />
  </div>
</template>

<style>
  .seerbitButton {
    align-self: center;
    background-color: #000000;
    color: #ffffff;
    font-weight: 400; 
    cursor: pointer;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 16px;
  }
</style>
