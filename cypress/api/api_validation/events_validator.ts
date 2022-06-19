export class EventsValidator {
  // Used to validate events triggered for account
  //ex:  const expEventsValidation: EventItem = {
  // account_id: accountID, product_id: productID, event_type:
  // results.event_type}
  // validateEventLineItem(eventsResponse,expEventsValidation)
  validateEventLineItem(response, expEventLineItem) {
    let filterEvent;
    if (expEventLineItem.event_type === "STATEMENT") {
      filterEvent = response.body.results.filter((event) => {
        return event.event_type === "STATEMENT" && event.statement_seq === expEventLineItem.statement_seq;
      });
    } else {
      filterEvent = response.body.results.filter((event) => {
        return (
          event.event_type === expEventLineItem.event_type && event.effective_at.includes(expEventLineItem.effective_at)
        );
      });
    }

    if (filterEvent.length === 0) {
      expect(expEventLineItem.event_type, expEventLineItem.validation_message).to.eq("");
    }
    //Verify given Event details
    expect(filterEvent[0].event_type, expEventLineItem.validation_message).to.eq(expEventLineItem.event_type);
    if (expEventLineItem.event_start === "null") {
      expect(filterEvent[0].event_start, "check event_start is null").to.null;
    } else {
      expect(filterEvent[0].event_start, "check event_start field value").to.includes(expEventLineItem.event_start);
    }
    expect(filterEvent[0].is_processed, "check is_processed field value").to.eq(expEventLineItem.is_processed);
    expect(filterEvent[0].account_id, "check account_id field value").to.eq(parseInt(expEventLineItem.account_id));
    expect(filterEvent[0].effective_at, "check effective_at field value").to.includes(expEventLineItem.effective_at);
    if (expEventLineItem.line_item_id === "null") {
      expect(filterEvent[0].line_item_id, "check line_item_id is null").to.null;
    } else {
      expect(filterEvent[0].line_item_id, "check line_item_id is displayed").to.not.null;
    }
    // TODO: Presently statement_id and product_id are not displayed.Need to
    // get confirmation about the issue
    // if (expEventLineItem.statement_id === "null") {
    //   expect(filterEvent[0].statement_id, "check statement_id is null").to.null;
    // } else {
    //   expect(filterEvent[0].statement_id, "check statement_id is displayed").to.not.null;
    // }
    //expect(filterEvent[0].product_id, "check product_id field value").to.eq(parseInt(expEventLineItem.product_id));
  }

  validateRetroTypeEvent(response, expEventLineItem) {
    const filterEvent = response.body.results.filter((event) => {
      return event.event_type === "RETRO" && event.effective_at.includes(expEventLineItem.effective_at);
    });

    if (filterEvent.length === 0) {
      expect(expEventLineItem.event_type, expEventLineItem.validation_message).to.eq("");
    }

    //Verify given event details
    expect(filterEvent[0].event_type, expEventLineItem.validation_message).to.eq(expEventLineItem.event_type);
    expect(filterEvent[0].is_processed, "check is_processed field value").to.eq(expEventLineItem.is_processed);
    expect(filterEvent[0].account_id, "check account_id field value").to.eq(parseInt(expEventLineItem.account_id));
    expect(filterEvent[0].effective_at, "check effective_at field value").to.includes(expEventLineItem.effective_at);
    expect(filterEvent[0].payload.reversed_line_item_ids[0], "check reversal line_item_id is displayed").to.not.null;
    expect(filterEvent[0].payload.reversal_line_item_type, "check reversal line_item_id is displayed").to.eq(
      expEventLineItem.retro_line_item_type
    );
  }

  validatePaymentProcessorEvent(response, expEventLineItem) {
    const filterEvent = response.body.results.filter((event) => {
      return (
        event.event_type === "PAYMENT_TX" &&
        event.effective_at.includes(expEventLineItem.effective_at) &&
        event.payload.payment_amount_cents == expEventLineItem.payment_amount_cents
      );
    });

    if (filterEvent.length === 0) {
      expect(expEventLineItem.event_type, expEventLineItem.validation_message).to.eq("");
    }

    cy.log(expEventLineItem.event_type);
    //Verify given event details
    expect(filterEvent[0].event_type, expEventLineItem.validation_message).to.eq(expEventLineItem.event_type);
    expect(filterEvent[0].is_processed, "check is_processed field value").to.eq(expEventLineItem.is_processed);
    expect(filterEvent[0].account_id, "check account_id field value").to.eq(parseInt(expEventLineItem.account_id));
    expect(filterEvent[0].effective_at, "check effective_at field value").to.includes(expEventLineItem.effective_at);
    expect(filterEvent[0].payload.payment_method, "verify payment method").to.eq(expEventLineItem.payment_method);
    expect(filterEvent[0].payload.payment_processor_name, "verify payment_processor_name").to.eq(
      expEventLineItem.payment_processor_name
    );
    expect(filterEvent[0].payload.payment_amount_cents, "verify payment_amount_cents").to.eq(
      expEventLineItem.payment_amount_cents
    );
    expect(filterEvent[0].payload.payment_status, "verify payment_status").to.eq(expEventLineItem.payment_status);
    expect(filterEvent[0].payload.transaction_status, "verify transaction_status").to.eq(
      expEventLineItem.transaction_status
    );
  }

  // Used to check given event type is available  in events
  //ex: checkEventType(eventsResponse,"AUTO_PAY")
  checkEventType(response, transType) {
    const filterEvent = response.body.results.filter((event) => {
      return event.event_type === transType;
    });
    if (filterEvent.length === 0) {
      return false;
    }
    //given line item is displayed in events list
    return true;
  }
}

export interface EventValidationFields {
  product_id?: string;
  account_id?: string;
  effective_at?: string;
  event_type?: string;
  is_processed: boolean;
  event_start?: any;
  line_item_id?: any;
  statement_id?: any;
  statement_seq?: number;
  retro_line_item_type?: string;
  validation_message?: string;
  payment_method?: string;
  payment_processor_name?: string;
  payment_amount_cents?: number;
  payment_status?: string;
  transaction_status?: string;
}

export const eventsValidator = new EventsValidator();
