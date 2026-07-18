import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { shopApi } from '../api/shop';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clear, loadCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState('post');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { data: addresses = [], loading: addressesLoading } = useAsyncData(() => shopApi.getAddresses(), [], []);

  const shippingMethods = [
    { id: 'post', name: 'پست معمولی', price: 20000, duration: '5-7 روز کاری' },
    { id: 'express', name: 'پست پیشتاز', price: 50000, duration: '2-3 روز کاری' },
    { id: 'tipax', name: 'تیپاکس', price: 30000, duration: '3-4 روز کاری' }
  ];

  const selectedShippingMethod = shippingMethods.find(m => m.id === selectedShipping);
  const subtotal = getTotal();
  const shippingCost = selectedShippingMethod?.price || 0;
  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal + shippingCost - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const data = await shopApi.applyCoupon(couponCode);
      setAppliedCoupon(data);
      showToast('کد تخفیف اعمال شد!', 'success');
    } catch (err) {
      showToast(err.message || 'کد تخفیف نامعتبر است', 'error');
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress || !selectedShipping) return;
    setIsCheckingOut(true);
    try {
      const data = await shopApi.checkout({
        address_id: selectedAddress.id,
        shipping_method: selectedShipping,
        coupon_code: appliedCoupon?.code || null
      });
      clear();
      showToast('سفارش شما با موفقیت ثبت شد!', 'success');
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        navigate('/profile/orders');
      }
    } catch (err) {
      showToast(err.message || 'خطا در ثبت سفارش', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">سبد خرید شما خالی است!</h2>
        <Link to="/" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-5 h-5" />
          بازگشت
        </button>
        <h1 className="text-3xl font-bold text-gray-800">تکمیل خرید</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              step > s ? 'bg-green-500 text-white' : step === s ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-24 h-1 mx-4 transition-colors duration-300 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mb-12 text-sm font-medium text-gray-500">
        <span className={`${step === 1 ? 'text-blue-600 font-bold' : ''}`}>انتخاب آدرس</span>
        <span className="mx-8">انتخاب روش ارسال</span>
        <span className={`${step === 3 ? 'text-blue-600 font-bold' : ''}`}>خلاصه سفارش</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
                انتخاب آدرس تحویل
              </h2>

              {addressesLoading ? (
                <div className="text-center py-12 text-gray-500">در حال بارگذاری آدرس‌ها...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🏠</div>
                  <p className="text-gray-600 mb-6">هنوز آدرسی ثبت نکردید</p>
                  <Link to="/profile/addresses" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold">
                    افزودن آدرس
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedAddress?.id === address.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-bold text-gray-800 mb-2">{address.title_address}</h3>
                      <p className="text-gray-600 text-sm mb-1">{address.province}, {address.city}</p>
                      <p className="text-gray-700">{address.full_address}</p>
                      <p className="text-gray-500 text-sm mt-2">کد پستی: {address.postcode}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedAddress}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  مرحله بعد
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Truck className="w-6 h-6 text-blue-600" />
                انتخاب روش ارسال
              </h2>

              <div className="space-y-4">
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedShipping(method.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedShipping === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{method.name}</h3>
                        <p className="text-gray-500 text-sm">{method.duration}</p>
                      </div>
                      <span className="font-bold text-blue-600">{method.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  مرحله قبل
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  مرحله بعد
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                خلاصه سفارش
              </h2>

              {/* Selected Address */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  آدرس تحویل
                </h3>
                <p className="font-semibold text-gray-800">{selectedAddress?.title_address}</p>
                <p className="text-gray-600 text-sm">{selectedAddress?.province}, {selectedAddress?.city}</p>
                <p className="text-gray-700">{selectedAddress?.full_address}</p>
                <p className="text-gray-500 text-sm mt-2">کد پستی: {selectedAddress?.postcode}</p>
              </div>

              {/* Selected Shipping */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  روش ارسال
                </h3>
                <p className="font-semibold text-gray-800">{selectedShippingMethod?.name}</p>
                <p className="text-gray-500 text-sm">{selectedShippingMethod?.duration}</p>
              </div>

              {/* Coupon */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-4">کد تخفیف</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف خود را وارد کنید"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                  >
                    {isApplyingCoupon ? 'در حال اعمال...' : 'اعمال'}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-xl flex items-center justify-between">
                    <span>کد {appliedCoupon.code} با موفقیت اعمال شد</span>
                    <span className="font-bold">-{appliedCoupon.discount_amount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  مرحله قبل
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5" />
                  {isCheckingOut ? 'در حال پردازش...' : 'پرداخت و ثبت سفارش'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">خلاصه سبد خرید</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <img
                    src={item.product?.image || 'https://via.placeholder.com/60x60'}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{item.product?.name}</p>
                    <p className="text-gray-500 text-xs">تعداد: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{item.total?.toLocaleString('fa-IR') || 0} تومان</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>جمع کل</span>
                <span>{subtotal.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>هزینه ارسال</span>
                <span>{shippingCost.toLocaleString('fa-IR')} تومان</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>تخفیف</span>
                  <span>-{discount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between text-xl font-bold text-gray-800">
                <span>مبلغ قابل پرداخت</span>
                <span>{total.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
