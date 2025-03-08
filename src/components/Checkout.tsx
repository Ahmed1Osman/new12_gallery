import { usePayment } from '../context/PaymentContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Checkout: React.FC = () => {
    const { cart, applyDiscount, clearCart } = usePayment();
  const stripe = useStripe();
  const elements = useElements();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = applyDiscount(subtotal);

  const createPaymentIntent = async (amount: number) => {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100) })
    });
    const { clientSecret } = await response.json();
        return clientSecret;
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    const paymentResult = await stripe.confirmCardPayment(
      await createPaymentIntent(total),
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      }
    );

    const { error, paymentIntent } = paymentResult;

    if (error) {
      alert(`Payment failed: ${error.message}`);
    } else if (paymentIntent?.status === 'succeeded') {
      clearCart();
      alert('Payment succeeded!');
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      
      <div className="mb-6">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.title} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mb-6 border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Website Discount (10%):</span>
          <span>-${(subtotal * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElement className="mb-4 p-3 border rounded" />
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Pay ${total.toFixed(2)}
        </button>
      </form>
    </div>
  );
};

export default Checkout;