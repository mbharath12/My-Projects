export class PaymentProcessorValidation {
  //Validate payment processor config details from account response
  //ex: payment.validatePaymentProcessConfigResponse(response,"repay")
  validatePaymentProcessConfigResponse(response, processorName) {
    let expProcessorMessage;

    //Assign message name based on process name
    switch (processorName.toLowerCase()) {
      case "repay":
        expProcessorMessage = "Repay secrets saved.";
        break;
      case "checkout":
        expProcessorMessage = "Checkout.com secrets saved.";
        break;
      case "dwolla":
        expProcessorMessage = "Dwolla secrets saved.";
        break;
      case "modern_treasury":
        expProcessorMessage = "Modern Treasury secrets saved.";
        break;
      case "authorize_net":
        expProcessorMessage = "Authorize.net secrets saved.";
        break;
      default:
        expProcessorMessage = null;
    }
    expect(response.status).to.eq(200);
    expect(response.body.payment_processor_name).to.eq(processorName);
    expect(response.body.message).to.include(expProcessorMessage);
  }

  //Verify payment processor details from account response
  //type AccountPaymentProcessor = Pick<PaymentProcessor,"auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token">;
  // const accountPaymentProcessor: AccountPaymentProcessor = {
  //auto_enabled: true,
  //default_payment_processor_method: "ACH",
  //payment_processor_name: "REPAY",
  //validate_processor_token: true,
  //usage : paymentProcessValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
  validatePaymentProcessorAccount(response, paymentProcessDts) {
    expect(response.body.payment_processor_config.autopay_enabled, "check auto enable value").to.eq(
      paymentProcessDts.auto_enabled
    );
    expect(
      response.body.payment_processor_config.default_payment_processor_method,
      "check default payment processor method"
    ).to.eq(paymentProcessDts.default_payment_processor_method);

    let paymentProcessorMethod;
    if ("payment_processor_method" in paymentProcessDts) {
      paymentProcessorMethod = paymentProcessDts.payment_processor_method;
    } else {
      paymentProcessorMethod = paymentProcessDts.default_payment_processor_method;
    }

    let processorConfigName;
    if ("processor_config_name" in paymentProcessDts) {
      processorConfigName = paymentProcessDts.processor_config_name;
    } else {
      processorConfigName = paymentProcessDts.payment_processor_name;
    }

    //check process name in processor config details
    const expProcessorName = this.getPaymentProcessorName(response, paymentProcessorMethod);
    expect(expProcessorName, "check processor name").to.eq(paymentProcessDts.payment_processor_name);
    //check token is generated for give processor in processor config details
    if ("validate_processor_token" in paymentProcessDts) {
      const token = this.getPaymentProcessorToken(response, paymentProcessorMethod, processorConfigName);
      expect(token, "check token is not null for processor configured ").to.not.null;
    }
  }

  //get the processor name from response for given processor name
  //usage: getPaymentProcessorName(response,"ach")
  getPaymentProcessorName(response, paymentProcessorMethod) {
    switch (paymentProcessorMethod.toLowerCase()) {
      case "ach":
        return response.body.payment_processor_config.ach.payment_processor_name;
      case "debit_card":
        return response.body.payment_processor_config.debit_card.payment_processor_name;
      case "credit_card":
        return response.body.payment_processor_config.credit_card.payment_processor_name;
      default:
        return null;
    }
  }

  //get the processor token using default_payment_processor_method and processor name
  //usage: getPaymentProcessorName(response,ach,repay)
  getPaymentProcessorToken(response, paymentProcessorMethod, paymentProcessorName) {
    const processorConfigJSONPath = response.body.payment_processor_config;
    const processorNameJSONPath = processorConfigJSONPath[paymentProcessorMethod.toLowerCase()]; //ach or debit_card

    // token JSON path is different while onboarding account and get account by ID
    if ("ach_token" in processorNameJSONPath) return processorNameJSONPath["ach_token"];
    if ("card_token" in processorNameJSONPath) return processorNameJSONPath["card_token"];

    const processorNameMethod = paymentProcessorMethod.concat("_", paymentProcessorName);

    switch (processorNameMethod.toLowerCase()) {
      case "ach_repay":
        return response.body.payment_processor_config.ach.repay_config.ach_token;
      case "ach_dwolla":
        return response.body.payment_processor_config.ach.dwolla_config.ach_token;
      case "ach_modern_treasury":
        return response.body.payment_processor_config.ach.modern_treasury_config.ach_token;
      case "debit_card_repay":
        return response.body.payment_processor_config.debit_card.repay_config.card_token;
      case "credit_card_checkout":
        return response.body.payment_processor_config.credit_card.checkout_config.card_token;
      default:
        return null;
    }
  }
}

export interface PaymentProcessorFieldDetails {
  auto_enabled?: boolean;
  payment_processor_name: string;
  default_payment_processor_method?: string;
  payment_processor_method?: String;
  ach_payment_processor_name?: string;
  debit_card_payment_processor_name?: string;
  credit_card_payment_processor_name?: string;
  multiple_config?: string;
  validate_processor_token?: boolean;
  processor_config_name?: string;
}
export const paymentProcessorValidator = new PaymentProcessorValidation();
