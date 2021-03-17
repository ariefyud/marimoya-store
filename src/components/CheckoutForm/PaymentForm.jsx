import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
  // Payment details
  // const [cardNum, setCardNum] = useState(('4242 4242 4242 4242': ''));
  // const [expMonth, setExpMonth] = useState(('11': ''));
  // const [expYear, setExpYear] = useState(('2023': ''));
  // const [cvv, setCvv] = useState(('123': ''));
  // const [billingPostalZipcode, setBillingPostalZipcode] = useState(('90089': ''));

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      console.log('[error]', error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: {
          name: 'International',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
        },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
          // gateway: 'test_gateway',
          // card: {
          //   number: cardNum,
          //   expire_monthz: expMonth,
          //   expireYear: expYear,
          //   cvc: cvv,
          //   postal_zip_code: billingPostalZipcode,
          // },
        },
      };

      onCaptureCheckout(checkoutToken.id, orderData);

      nextStep();
    }
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>
        Payment method
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={e => handleSubmit(e, elements, stripe)}>
              <p>*for test: Card number = 4242 4242 4242 4242 || MM/YY CVC ZIP = 04 / 24 242 42424</p>
              <CardElement />
              {/* <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='cardNum'
                label='Card Number'
                name='cardNum'
                value={cardNum}
                onChange={e => setCardNum(e.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='expMonth'
                label='Expiry Month'
                name='expMonth'
                value={expMonth}
                onChange={e => setExpMonth(e.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='expYear'
                label='Expiry Year'
                name='expYear'
                value={expYear}
                onChange={e => setExpYear(e.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='cvv'
                label='CVV'
                name='cvv'
                value={cvv}
                onChange={e => setCvv(e.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='billingPostalZipcode'
                label='Postal/Zip Code'
                name='postalCode'
                value={billingPostalZipcode}
                onChange={e => setBillingPostalZipcode(e.target.value)}
              /> */}
              <br /> <br />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='outlined' onClick={backStep}>
                  Back
                </Button>
                <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
