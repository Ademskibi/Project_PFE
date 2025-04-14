// useCartTimeout.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';

const useCartTimeout = (userId) => {
  const dispatch = useDispatch();
  const createdAt = useSelector((state) => state.cart.createdAtByUserId?.[userId]);

  useEffect(() => {
    if (!createdAt || !userId) return;

    const now = new Date();
    const createdTime = new Date(createdAt);
    const elapsed = now - createdTime;
    const remaining = Math.max(0, 15 * 60 * 1000 - elapsed);

    const timer = setTimeout(() => {
      dispatch(clearCart(userId));
      console.log('⏰ Cart expired for user:', userId);
    }, remaining);

    return () => clearTimeout(timer);
  }, [createdAt, dispatch, userId]);
};

export default useCartTimeout;
