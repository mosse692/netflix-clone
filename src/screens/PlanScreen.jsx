import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { addDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import db from "../firebase";
import "./PlanScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlanScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    getDocs(collection(db, `customers/${user.uid}/subscriptions`)).then(
      (querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start:
              subscription.data().current_period_start.seconds,
          });
        });
      }
    );
  }, [user.uid]);

  useEffect(() => {
    async function fetchData() {
      const products = {};
      const q = query(collection(db, "products"), where("active", "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data();
        const priceSnap = await getDocs(collection(productDoc.ref, "prices"));
        priceSnap.forEach((price) => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data(),
          };
        });
      });
      setProducts(products);
    }
    fetchData();
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await addDoc(
      collection(db, `customers/${user.uid}/checkout_sessions`),
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(docRef, async (snap) => {
      try {
        const { sessionId } = snap.data();
        const stripe = await loadStripe(
          "pk_test_51K0sLbHgjFQsx3u11R7my47f1JmEKsmEZS9hcvxPL5NyqHZ6TN847i1pS7RxtQ1VHvCrq44qyYgBh0pmq10CyBQB00KEqRyb9A"
        );
        stripe.redirectToCheckout({ sessionId });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className="plansScreen">
      <br />
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
      {Object.entries(products).map(([productId, productData]) => {
        // TODO: add some logic to check the user subscription is active...

        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            className={`${
              isCurrentPackage && "planScreen__plan--disabled"
            } planScreen__plan`}
            key={productId}
          >
            <div className="planScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlanScreen;
